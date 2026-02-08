import svgPaths from "../../imports/svg-hmh9i6xgid";
import styles from "./RecordButton.module.css";

interface RecordButtonProps {
  className?: string;
}

export function RecordButton({ className }: RecordButtonProps) {
  return (
    <div className={className || styles.recordButton} data-name="Record Button">
      <div className={styles.border}>
        <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 216 72">
          <path d={svgPaths.p1a8da000} fill="var(--fill-0, black)" fillOpacity="0.01" id="Vector" stroke="url(#paint0_linear_1_56)" strokeLinejoin="round" strokeWidth="2" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_56" x1="16" x2="64" y1="36" y2="36">
              <stop stopColor="#C8B6FF" />
              <stop offset="0.125" stopColor="#E4C2FB" />
              <stop offset="0.25" stopColor="#FFCDF8" />
              <stop offset="0.5" stopColor="#575EFF" />
              <stop offset="1" stopColor="#5915B3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={styles.circleContainer} data-name="Vector">
        <div className={styles.circleInner}>
          <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <path d={svgPaths.p1ce16040} fill="var(--fill-0, black)" fillOpacity="0.01" id="Vector" stroke="url(#paint0_linear_1_54)" strokeLinejoin="round" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_54" x1="2" x2="50" y1="26" y2="26">
                <stop stopColor="#C8B6FF" />
                <stop offset="0.125" stopColor="#E4C2FB" />
                <stop offset="0.25" stopColor="#FFCDF8" />
                <stop offset="0.5" stopColor="#575EFF" />
                <stop offset="1" stopColor="#5915B3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className={styles.playIconContainer}>
        <div className={styles.playIcon}>
          <div className={styles.playIconInner}>
            <div className={styles.playIconSvg}>
              <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 23.9186 21.25">
                <path d={svgPaths.p2d496880} fill="var(--fill-0, black)" fillOpacity="0.01" id="Polygon 1" stroke="url(#paint0_linear_1_48)" strokeLinejoin="round" strokeWidth="2" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_48" x1="11.9593" x2="11.9593" y1="2" y2="25">
                    <stop stopColor="#E4C2FB" />
                    <stop offset="0.5" stopColor="#E49DFD" />
                    <stop offset="1" stopColor="#575EFF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.text}>
        <p className={styles.textContent}>Record</p>
      </div>
    </div>
  );
}
