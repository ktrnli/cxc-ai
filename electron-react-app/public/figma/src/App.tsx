import { Background } from "./components/Background";
import { Logo } from "./components/Logo";
import { StartButton } from "./components/StartButton";
import { UploadButton } from "./components/UploadButton";
import { VHSVertical } from "./components/VHSVertical";
import { VHSHorizontal } from "./components/VHSHorizontal";

export default function App() {
  return (
    <div 
      style={{
        background: '#2e2733',
        position: 'relative',
        width: '100%',
        height: '100%'
      }} 
      data-name="MacBook Air - Home Screen"
    >
      <Background />
      <Logo />
      <VHSVertical />
      <VHSHorizontal />
      <StartButton />
      <UploadButton />
    </div>
  );
}
