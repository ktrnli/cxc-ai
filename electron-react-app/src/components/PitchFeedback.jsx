import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";

const SR = 16000;

function hzToMidi(hz) {
  return 69 + 12 * Math.log2(hz / 440);
}

function midiToNoteName(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const m = Math.round(midi);
  const name = names[((m % 12) + 12) % 12];
  const octave = Math.floor(m / 12) - 1;
  return `${name}${octave}`;
}

function centsOffFromNearest(midi) {
  const nearest = Math.round(midi);
  return (midi - nearest) * 100;
}

function feedbackText(cents, deadzone = 8) {
  const abs = Math.abs(cents);
  if (abs <= deadzone) return `In tune (±${deadzone}¢)`;
  if (cents > 0) return `Sharp by ${abs.toFixed(0)}¢`;
  return `Flat by ${abs.toFixed(0)}¢`;
}

const PitchFeedback = () => {
  const [listening, setListening] = useState(false);
  const [pitchHz, setPitchHz] = useState(null);
  const [note, setNote] = useState("-");
  const [cents, setCents] = useState(null);
  const [status, setStatus] = useState("Click Start");
  const [hint, setHint] = useState("");

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  const inflightRef = useRef(false);

  const stop = useCallback(() => {
    try {
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      audioContextRef.current?.close();
    } catch {}

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    inflightRef.current = false;

    setListening(false);
    setStatus("Stopped");
    setHint("");
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  // ✅ Define sendFrame BEFORE start so start can depend on it
  const sendFrame = useCallback(async (audioData) => {
    inflightRef.current = true;

    try {
      const res = await fetch("http://127.0.0.1:5000/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          samples: Array.from(audioData),
          sampleRate: SR,
        }),
      });

      const json = await res.json();

      if (json.status === "warming_up") {
        setHint("Warming up…");
        return;
      }

      const hz = json.current_pitch_hz ?? null;
      setPitchHz(hz);

      if (!hz) {
        setNote("-");
        setCents(null);
        setStatus("No pitch detected");
        return;
      }

      if (typeof json.cents_error === "number") {
        setCents(json.cents_error);

        const midi =
          typeof json.detected_midi === "number" ? json.detected_midi : hzToMidi(hz);

        setNote(json.expected_note || midiToNoteName(midi));
        setStatus(feedbackText(json.cents_error));
      } else {
        const midi = hzToMidi(hz);
        const c = centsOffFromNearest(midi);

        setNote(midiToNoteName(midi));
        setCents(c);
        setStatus(feedbackText(c));
      }

      setHint("");
    } catch (e) {
      setStatus("Backend not reachable (is Flask running on :5000?)");
    } finally {
      inflightRef.current = false;
    }
  }, []);

  const start = useCallback(async () => {
    setStatus("Requesting microphone…");
    setHint("");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext({ sampleRate: SR });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;

    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (inflightRef.current) return;
      const audioData = e.inputBuffer.getChannelData(0);
      sendFrame(audioData);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setListening(true);
    setStatus("Listening…");
  }, [sendFrame]);

  const centsDisplay = useMemo(() => {
    if (cents === null) return "-";
    const sign = cents > 0 ? "+" : "";
    return `${sign}${cents.toFixed(0)}¢`;
  }, [cents]);

  return (
    <div style={{ padding: 16, maxWidth: 500 }}>
      <h2>Pitch Feedback</h2>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <div><strong>Status:</strong> {status}</div>
        {hint && <div style={{ color: "#666" }}>{hint}</div>}
        <div><strong>Pitch (Hz):</strong> {pitchHz ? pitchHz.toFixed(1) : "-"}</div>
        <div><strong>Note:</strong> {note}</div>
        <div><strong>Offset:</strong> {centsDisplay}</div>
      </div>

      <button onClick={listening ? stop : start}>
        {listening ? "Stop" : "Start"}
      </button>

      <p style={{ marginTop: 10, color: "#666" }}>
        Shows sharp/flat vs nearest note. If you use <code>/session_start</code>,
        feedback will be relative to the expected note instead.
      </p>
    </div>
  );
};

export default PitchFeedback;
