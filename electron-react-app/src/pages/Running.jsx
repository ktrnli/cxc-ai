import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PitchFeedback from "../components/PitchFeedback";
import GlassSurface from "../components/GlassSurface";

const Running = () => {
  const [listening, setListening] = useState(false);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

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

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setListening(false);
      setStream(null);

      if (shouldNavigate) {
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    return () => stopAudio(false);
  }, [stopAudio]);

  const startAudio = async () => {
    // 1) Start session in backend (timer starts here)
    const { expectedNotes, toleranceCents } = getSessionPayload();
    if (!expectedNotes || expectedNotes.length === 0) {
      alert("No expected notes found. Go back and upload a MIDI file first.");
      return;
    }

    await fetch("/session_start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedNotes, toleranceCents }),
    });

    const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = newStream;
    setStream(newStream);

    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(newStream);
    sourceRef.current = source;

    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      sendAudioFrame(Array.from(audioData));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setListening(true);
  };

  const handleMicClick = () => {
    if (listening) {
      stopAudio(true);
    } else {
      startAudio();
    }
  };

  const sendAudioFrame = (audioArray) => {
    fetch("/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ samples: audioArray, sampleRate: 16000 }),
    }).catch(() => {});
  };

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
      <PitchFeedback stream={stream} />
    </div>
  );
};

export default Running;
