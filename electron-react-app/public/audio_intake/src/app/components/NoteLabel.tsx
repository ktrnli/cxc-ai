import svgPaths from "../../imports/svg-hmh9i6xgid";
import styles from "./NoteLabel.module.css";

interface NoteLabelProps {
  className?: string;
}

export function NoteLabel({ className }: NoteLabelProps) {
  return (
    <div className={className || styles.noteLabel} data-name="Note Label">
      <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 141 43">
        <g id="Vector">
          <path d={svgPaths.p21eaa80} fill="#363169" />
          <path d={svgPaths.p241ed900} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p19017600} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p2169f800} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p2c47a080} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.pb5b9400} fill="var(--fill-0, #E4DBFF)" />
        </g>
      </svg>
    </div>
  );
}
