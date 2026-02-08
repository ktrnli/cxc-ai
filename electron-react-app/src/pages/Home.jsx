import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Midi } from "@tonejs/midi";

const Home = () => {
  const navigate = useNavigate();

  const [midiLoaded, setMidiLoaded] = useState(false);
  const [error, setError] = useState("");
  const [expectedNotes, setExpectedNotes] = useState([]);
  const [bpm, setBpm] = useState(120);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setMidiLoaded(false);
    setExpectedNotes([]);

    if (!file.name.endsWith(".mid") && !file.name.endsWith(".midi")) {
      setError("Please upload a valid MIDI file (.mid or .midi)");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target.result;
        const midi = new Midi(arrayBuffer);

        const tempoFromFile = midi.header.tempos?.[0]?.bpm;
        const sessionBpm = tempoFromFile ? Math.round(tempoFromFile) : bpm;
        setBpm(sessionBpm);

        const notes = [];
        for (const track of midi.tracks) {
          for (const n of track.notes) {
            notes.push({
              startSec: n.time,
              endSec: n.time + n.duration,
              midi: n.midi,
            });
          }
        }

        notes.sort((a, b) => a.startSec - b.startSec);

        if (notes.length === 0) {
          setError("This MIDI file contains no note events.");
          setMidiLoaded(false);
          return;
        }

        setExpectedNotes(notes);
        setMidiLoaded(true);
        setError("");

        sessionStorage.setItem("expectedNotes", JSON.stringify(notes));
        sessionStorage.setItem("toleranceCents", "35");
        sessionStorage.setItem("bpm", String(sessionBpm));
      } catch (err) {
        console.error(err);
        setError("Failed to parse MIDI file");
        setMidiLoaded(false);
        setExpectedNotes([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const startPractice = () => {
    if (!midiLoaded || expectedNotes.length === 0) {
      setError("Upload a MIDI file before starting practice");
      return;
    }

    navigate("/running", {
      state: { expectedNotes, toleranceCents: 35, bpm },
    });
  };

  return (
    <div>
      <h1>maestro</h1>

      <input type="file" accept=".mid,.midi" onChange={handleFileUpload} />

      {midiLoaded && (
        <p style={{ color: "green" }}>
          MIDI loaded ✓ ({expectedNotes.length} notes, BPM {bpm})
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={startPractice}>Start Practice</button>
    </div>
  );
};

export default Home;
