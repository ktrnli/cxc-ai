import { Background } from "./components/Background";
import { RecordButton } from "./components/RecordButton";
import { PitchLabel } from "./components/PitchLabel";
import { NoteLabel } from "./components/NoteLabel";
import { OffsetLabel } from "./components/OffsetLabel";
import { Mic } from "./components/Mic";
import { Logo } from "./components/Logo";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.container} data-name="MacBook Air - Audio Intake Page">
      <Background />
      <RecordButton />
      <PitchLabel />
      <NoteLabel />
      <OffsetLabel />
      <Mic />
      <Logo />
    </div>
  );
}
