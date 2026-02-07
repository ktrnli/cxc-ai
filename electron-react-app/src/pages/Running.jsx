import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Running = () => {
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  const stopAudio = useCallback((shouldNavigate = true) => {
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

    if (shouldNavigate) {
      navigate("/feedback");
    }
  }, [navigate]);

  useEffect(() => {
    return () => stopAudio(false);
  }, [stopAudio]);

  const startAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
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

  const sendAudioFrame = (audioArray) => {
    fetch("/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ samples: audioArray }),
    }).catch(() => {});
  };

  return (
    <div>
      <button onClick={listening ? () => stopAudio(true) : startAudio}>
        {listening ? "Stop Mic" : "Start Mic"}
      </button>
    </div>
  );
};

export default Running;
