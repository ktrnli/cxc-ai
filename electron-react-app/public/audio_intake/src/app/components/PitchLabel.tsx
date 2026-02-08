import svgPaths from "../../imports/svg-hmh9i6xgid";
import styles from "./PitchLabel.module.css";

interface PitchLabelProps {
  className?: string;
}

export function PitchLabel({ className }: PitchLabelProps) {
  return (
    <div className={className || styles.pitchLabel} data-name="Pitch Label">
      <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 141 43">
        <g id="Vector">
          <path d={svgPaths.p21eaa80} fill="#C8B6FF" fillOpacity="0.67" />
          <path d={svgPaths.p22134c80} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p2a4a46f0} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p38675400} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p16a87280} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p1e051400} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p22c96c80} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p35f01b00} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p1219600} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p32ca8680} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p2c558000} fill="var(--fill-0, #E4DBFF)" />
        </g>
      </svg>
    </div>
  );
}
