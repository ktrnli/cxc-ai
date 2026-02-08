import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import GlassSurface from "./GlassSurface";

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

const PitchFeedback = ({ stream: externalStream = null }) => {
  const [listening, setListening] = useState(false);
  const [pitchHz, setPitchHz] = useState(null);
  const [note, setNote] = useState("-");
  const [cents, setCents] = useState(null);
  const [status, setStatus] = useState("Start Mic to begin");
  const [hint, setHint] = useState("");

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

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

    inflightRef.current = false;

    setListening(false);
    setStatus("Start Mic to begin");
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

  useEffect(() => {
    if (!externalStream) return;

    setStatus("Listening…");
    setListening(true);

    const audioContext = new AudioContext({ sampleRate: SR });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(externalStream);
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

    return () => stop();
  }, [externalStream, sendFrame, stop]);

  const centsDisplay = useMemo(() => {
    if (cents === null) return "-";
    const sign = cents > 0 ? "+" : "";
    return `${sign}${cents.toFixed(0)}¢`;
  }, [cents]);

  const textStyle = { color: "rgba(255, 255, 255, 0.95)", margin: 0, fontSize: "0.95rem" };
  const labelStyle = { ...textStyle, opacity: 0.85, fontWeight: 500 };

  return (
    <GlassSurface
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "1.25rem 1.75rem",
        minWidth: 260,
        textAlign: "center",
        zIndex: 2,
      }}
    >
      <h2 style={{ ...textStyle, marginBottom: "0.75rem", fontSize: "1.1rem" }}>Pitch Feedback</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={textStyle}><span style={labelStyle}>Status: </span>{status}</div>
        {hint && <div style={{ ...textStyle, opacity: 0.8 }}>{hint}</div>}
        <div style={textStyle}><span style={labelStyle}>Pitch (Hz): </span>{pitchHz ? pitchHz.toFixed(1) : "-"}</div>
        <div style={textStyle}><span style={labelStyle}>Note: </span>{note}</div>
        <div style={textStyle}><span style={labelStyle}>Offset: </span>{centsDisplay}</div>
      </div>
    </GlassSurface>
  );
};

export default PitchFeedback;
