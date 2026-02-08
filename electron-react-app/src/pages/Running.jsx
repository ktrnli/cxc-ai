import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassSurface from "../components/GlassSurface";

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

const Running = () => {
  const [listening, setListening] = useState(false);
  const [stream, setStream] = useState(null);

  // pitch UI state (from PitchFeedback)
  const [pitchHz, setPitchHz] = useState(null);
  const [note, setNote] = useState("-");
  const [cents, setCents] = useState(null);
  const [status, setStatus] = useState("Start Mic to begin");
  const [hint, setHint] = useState("");

  const navigate = useNavigate();

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  const inflightRef = useRef(false);

  const getSessionPayload = () => {
    try {
      const raw = sessionStorage.getItem("expectedNotes");
      const notes = raw ? JSON.parse(raw) : [];
      return {
        expectedNotes: notes,
        toleranceCents: Number(sessionStorage.getItem("toleranceCents") || "35"),
      };
    } catch {
      return { expectedNotes: [], toleranceCents: 35 };
    }
  };

  const stopAudio = useCallback(
    (shouldNavigate = true) => {
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

      setListening(false);
      setStream(null);

      // reset pitch UI
      inflightRef.current = false;
      setPitchHz(null);
      setNote("-");
      setCents(null);
      setStatus("Start Mic to begin");
      setHint("");

      if (shouldNavigate) navigate("/");
    },
    [navigate]
  );

  useEffect(() => {
    return () => stopAudio(false);
  }, [stopAudio]);

  // single place that sends frames + updates pitch UI
  const sendFrame = useCallback(async (audioDataFloat32) => {
    inflightRef.current = true;

    try {
      const res = await fetch("/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          samples: Array.from(audioDataFloat32),
          sampleRate: SR,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      // If backend returns an error, try to surface the actual message
      if (!res.ok) {
        let details = "";
        let errPayload = null;

        try {
          if (contentType.includes("application/json")) {
            errPayload = await res.json();
            if (typeof errPayload === "string") {
              details = `: ${errPayload.slice(0, 180)}`;
            } else if (errPayload && typeof errPayload === "object") {
              // prefer common keys, otherwise show a compact preview
              const msg =
                errPayload.error ||
                errPayload.message ||
                errPayload.detail ||
                errPayload.msg;
              details = msg
                ? `: ${String(msg).slice(0, 180)}`
                : `: ${JSON.stringify(errPayload).slice(0, 180)}`;
            }
          } else {
            const text = await res.text();
            details = text ? `: ${text.slice(0, 180)}` : "";
          }
        } catch (parseErr) {
          console.error("/audio error body parse failed", parseErr);
        }

        setStatus(`Backend error (${res.status})${details}`);
        setHint("");
        console.error("/audio failed", {
          status: res.status,
          contentType,
          errPayload,
        });
        return;
      }

      // Parse JSON safely
      let json;
      try {
        json = contentType.includes("application/json") ? await res.json() : null;
      } catch {
        json = null;
      }

      if (!json) {
        setStatus("Backend returned a non-JSON response");
        setHint("");
        return;
      }

      if (json.status === "warming_up") {
        setHint("Warming up…");
        setStatus("Listening…");
        return;
      }

      const hz = json.current_pitch_hz ?? null;
      setPitchHz(hz);

      if (!hz) {
        setNote("-");
        setCents(null);
        setStatus("No pitch detected");
        setHint("");
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
      setStatus(`Request failed: ${e?.message || String(e)}`);
      setHint("");
      console.error("/audio exception", e);
    } finally {
      inflightRef.current = false;
    }
  }, []);

  const startAudio = useCallback(async () => {
    // 1) Start session in backend
    const { expectedNotes, toleranceCents } = getSessionPayload();
    if (!expectedNotes || expectedNotes.length === 0) {
      alert("No expected notes found. Go back and upload a MIDI file first.");
      return;
    }

    let sessionRes;
    try {
      sessionRes = await fetch("/session_start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedNotes, toleranceCents }),
      });
    } catch (e) {
      alert("Session start failed (network). Is the proxy/Flask running?");
      console.error("/session_start exception", e);
      return;
    }

    if (!sessionRes.ok) {
      let msg = "";
      try {
        const ct = sessionRes.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const j = await sessionRes.json();
          msg = j?.error ? `: ${j.error}` : "";
        } else {
          const t = await sessionRes.text();
          msg = t ? `: ${t.slice(0, 180)}` : "";
        }
      } catch {}

      alert(`Session start failed (${sessionRes.status})${msg}. Check Flask logs.`);
      console.error("/session_start failed", sessionRes.status);
      return;
    }

    // 2) Get mic stream
    const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = newStream;
    setStream(newStream);

    // 3) Wire audio graph
    const audioContext = new AudioContext({ sampleRate: SR });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(newStream);
    sourceRef.current = source;

    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (inflightRef.current) return;
      const audioData = e.inputBuffer.getChannelData(0);
      setStatus("Listening…");
      sendFrame(audioData);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setListening(true);
    setStatus("Listening…");
  }, [sendFrame]);

  const handleMicClick = () => {
    if (listening) stopAudio(true);
    else startAudio();
  };

  const centsDisplay = useMemo(() => {
    if (cents === null) return "-";
    const sign = cents > 0 ? "+" : "";
    return `${sign}${cents.toFixed(0)}¢`;
  }, [cents]);

  const textStyle = { color: "rgba(255, 255, 255, 0.95)", margin: 0, fontSize: "0.95rem" };
  const labelStyle = { ...textStyle, opacity: 0.85, fontWeight: 500 };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", zIndex: 1 }}>
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem" }}>
        <GlassSurface to="/">Home</GlassSurface>
      </div>

      <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
        <GlassSurface as="button" onClick={handleMicClick}>
          {listening ? "Stop Mic" : "Start Mic"}
        </GlassSurface>
      </div>

      {/* Pitch Feedback UI (merged here) */}
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
        <h2 style={{ ...textStyle, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
          Pitch Feedback
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={textStyle}>
            <span style={labelStyle}>Status: </span>
            {status}
          </div>

          {hint && <div style={{ ...textStyle, opacity: 0.8 }}>{hint}</div>}

          <div style={textStyle}>
            <span style={labelStyle}>Pitch (Hz): </span>
            {pitchHz ? pitchHz.toFixed(1) : "-"}
          </div>

          <div style={textStyle}>
            <span style={labelStyle}>Note: </span>
            {note}
          </div>

          <div style={textStyle}>
            <span style={labelStyle}>Offset: </span>
            {centsDisplay}
          </div>
        </div>
      </GlassSurface>
    </div>
  );
};

export default Running;