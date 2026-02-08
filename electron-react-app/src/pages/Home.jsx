import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Midi } from "@tonejs/midi";
import GlassSurface from "../components/GlassSurface";

const glassButtonLabelStyle = {
  cursor: "pointer",
  display: "block",
  padding: "12px 24px",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "rgba(255, 255, 255, 0.95)",
  textAlign: "center",
};

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
        <GlassSurface primary className="glass-button" style={{ padding: 0 }}>
          <label style={glassButtonLabelStyle} onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mid,.midi"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            Upload Sheet Music
          </label>
        </GlassSurface>
        <GlassSurface primary as="button" onClick={startPractice}>
          Start Practice
        </GlassSurface>
      </div>

      {midiLoaded && (
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", margin: 0 }}>
          MIDI loaded ✓ ({expectedNotes.length} notes, BPM {bpm})
        </p>
      )}

      {error && <p style={{ color: "rgba(255,180,180,0.95)", fontSize: "0.9rem", margin: 0 }}>{error}</p>}
    </div>
  );
};

export default Home;
