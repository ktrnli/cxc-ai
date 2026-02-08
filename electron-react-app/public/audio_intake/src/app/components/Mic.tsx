import imgImageRemovebgPreview1 from "figma:asset/d40b6338b1e877311b46169d7e5fa4d5ebb6b88b.png";
import styles from "./Mic.module.css";

interface MicProps {
  className?: string;
}

export function Mic({ className }: MicProps) {
  return (
    <div className={className || styles.mic} data-name="Mic">
      <div className={styles.shadow} data-name="image-removebg-preview 1">
        <div className={styles.imageContainer}>
          <img alt="" className={styles.image} src={imgImageRemovebgPreview1} />
        </div>
      </div>
    </div>
  );
}
