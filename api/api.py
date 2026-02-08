from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import crepe
import time
import math

app = Flask(__name__)
CORS(app)

# config
SR = 16000 
BUFFER_SECONDS = 2.0 
BUFFER_SAMPLES = int(SR * BUFFER_SECONDS)
STEP_SIZE_MS = 10
CONF_THRESH = 0.5

audio_buffer = np.zeros((0,), dtype=np.float32)

# session state
session_active = False
session_t0 = None
expected_notes = []
tolerance_cents = 35

def _append_to_buffer(x: np.ndarray) -> None:
    global audio_buffer
    audio_buffer = np.concatenate([audio_buffer, x])

    if audio_buffer.size > BUFFER_SAMPLES:
        audio_buffer = audio_buffer[-BUFFER_SAMPLES:]

def _run_crepe_on_buffer(x: np.ndarray):
    """
    Returns:
      times (n_frames,)
      freqs (n_frames,)
      conf (n_frames,)
    """

    times, freqs, conf, _ = crepe.predict(
        x,
        SR,
        step_size=STEP_SIZE_MS,
        viterbi=True,
        model_capacity="tiny"
    )
    return times, freqs, conf

@app.route("/audio", methods=["POST"])
def receive_audio():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data"}), 400
        
        samples = data.get("samples", [])
        print(f"Received {len(samples)} audio samples")

        # list to numpy array to buffer
        x = np.asarray(samples, dtype=np.float32)
        x = np.clip(x, -1.0, 1.0)
        _append_to_buffer(x)

        # wait for audio buffer, wait 0.75s
        if audio_buffer.size < int(SR * 0.75):
            return jsonify({
                "status": "warming_up",
                "buffered_samples": int(audio_buffer.size),
                "buffered_seconds": audio_buffer.size / SR
            })

        # crepe
        times, freqs, conf = _run_crepe_on_buffer(audio_buffer)

        # filter low-conf frames
        freqs_f = freqs.copy()
        freqs_f[conf < CONF_THRESH] = np.nan

        # current pitch
        valid = np.isfinite(freqs_f)
        if np.any(valid):
            current_pitch_hz = float(freqs_f[np.where(valid)[0][-1]])
            median_pitch_hz = float(np.nanmedian(freqs_f))
        else:
            current_pitch_hz = None
            median_pitch_hz = None

        # record time
        now_sec = time.time()
        t_sec = (now_sec - session_t0) if (session_active and session_t0 is not None) else None

        expected_midi = None
        expected_note = None
        detected_midi = None
        cents_error = None
        in_tune = None

        if t_sec is not None:
            expected_midi = get_expected_midi_at(t_sec)
            if expected_midi is not None:
                expected_note = midi_to_note_name(expected_midi)

        if current_pitch_hz is not None:
            detected_midi = hz_to_midi(current_pitch_hz)

        if expected_midi is not None and detected_midi is not None:
            cents_error = float((detected_midi - expected_midi) * 100.0)
            in_tune = bool(abs(cents_error) <= tolerance_cents)

        # pitch contour every Nth frame
        N = 5
        t_out = times[::N].tolist()
        f_out = np.nan_to_num(freqs_f[::N], nan=0.0).tolist()
        c_out = conf[::N].tolist()

        return jsonify({
            "status": "ok",
            "buffer_seconds": audio_buffer.size / SR,

            "t_sec": t_sec,
            "expected_midi": expected_midi,
            "expected_note": expected_note,

            "current_pitch_hz": current_pitch_hz,
            "detected_midi": detected_midi,
            "cents_error": cents_error,
            "in_tune": in_tune,

            "median_pitch_hz": median_pitch_hz,
            "contour": {
                "t": t_out,
                "f_hz": f_out,
                "confidence": c_out
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/reset", methods=["POST"])
def reset():
    global audio_buffer, session_active, session_t0, expected_notes
    audio_buffer = np.zeros((0,), dtype=np.float32)
    session_active = False
    session_t0 = None
    expected_notes = []
    return jsonify({"status": "reset"})

def hz_to_midi(f_hz: float) -> float:
    return 69.0 + 12.0 * math.log2(f_hz / 440.0)                                           

def midi_to_note_name(midi: int) -> str:
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    n = int(round(midi))
    name = names[n % 12]
    octave = (n // 12) - 1
    return f"{name}{octave}"

def get_expected_midi_at(t_sec: float):
    for n in expected_notes:
        if n["startSec"] <= t_sec < n["endSec"]:
            return int(n["midi"])
    return None

@app.route("/session_start", methods=["POST"])
def session_start():
    global session_active, session_t0, expected_notes, tolerance_cents, audio_buffer

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON data"}), 400

    notes = data.get("expectedNotes")
    if not isinstance(notes, list) or len(notes) == 0:
        return jsonify({"error": "expectedNotes must be a non-empty list"}), 400

    cleaned = []
    for n in notes:
        try:
            start_sec = float(n["startSec"])
            end_sec = float(n["endSec"])
            midi = int(n["midi"])
            if end_sec <= start_sec:
                continue
            cleaned.append({"startSec": start_sec, "endSec": end_sec, "midi": midi})
        except Exception:
            continue

    if len(cleaned) == 0:
        return jsonify({"error": "No valid notes after validation"}), 400

    cleaned.sort(key=lambda x: x["startSec"])

    expected_notes = cleaned
    tolerance_cents = int(data.get("toleranceCents", 35))

    session_t0 = time.time()
    session_active = True

    audio_buffer = np.zeros((0,), dtype=np.float32)

    return jsonify({
        "status": "ok",
        "notes_loaded": len(expected_notes),
        "toleranceCents": tolerance_cents
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)