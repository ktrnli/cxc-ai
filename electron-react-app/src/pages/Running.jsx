import { useEffect, useRef, useState } from "react";

export default function Running() {
  const [listening, setListening] = useState(false);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  async function startAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
  }

  function stopAudio() {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();

    setListening(false);
  }

  function sendAudioFrame(audioArray) {
    fetch("/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ samples: audioArray })
    }).catch(() => {});
  }

  return (
    <div>
      <button onClick={listening ? stopAudio : startAudio}>
        {listening ? "Stop Mic" : "Start Mic"}
      </button>
    </div>
  );
}
