import imgKatsfavicon1 from "figma:asset/32780c1222698aa66400a44011bd08773b06c85a.png";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={className || styles.logo} data-name="Logo">
      <div className={styles.iconContainer} data-name="katsfavicon 1">
        <img alt="" className={styles.icon} src={imgKatsfavicon1} />
      </div>
      <div className={styles.text}>
        <p className={styles.textContent}>maestro.</p>
      </div>
    </div>
  );
}
