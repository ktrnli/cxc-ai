from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import crepe

app = Flask(__name__)
CORS(app)

# config
SR = 16000 
BUFFER_SECONDS = 2.0 
BUFFER_SAMPLES = int(SR * BUFFER_SECONDS)
STEP_SIZE_MS = 10
CONF_THRESH = 0.5

audio_buffer = np.zeros((0,), dtype=np.float32)

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

        # pitch contour every Nth frame
        N = 5
        t_out = times[::N].tolist()
        f_out = np.nan_to_num(freqs_f[::N], nan=0.0).tolist()
        c_out = conf[::N].tolist()

        return jsonify({
            "status": "ok",
            "buffer_seconds": audio_buffer.size / SR,
            "current_pitch_hz": current_pitch_hz,
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
    global audio_buffer
    audio_buffer = np.zeros((0,), dtype=np.float32)
    return jsonify({"status": "reset"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)