import svgPaths from "../../imports/svg-hmh9i6xgid";
import styles from "./OffsetLabel.module.css";

interface OffsetLabelProps {
  className?: string;
}

export function OffsetLabel({ className }: OffsetLabelProps) {
  return (
    <div className={className || styles.offsetLabel} data-name="Offset Label">
      <svg className={styles.svg} fill="none" preserveAspectRatio="none" viewBox="0 0 141 43">
        <g id="Vector">
          <path d={svgPaths.p21eaa80} fill="#533778" />
          <path d={svgPaths.p24513800} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p18eee700} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p36adc500} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p2b03d180} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p21076980} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.pf1c8a80} fill="var(--fill-0, #E4DBFF)" />
          <path d={svgPaths.p50acb70} fill="var(--fill-0, #E4DBFF)" />
        </g>
      </svg>
    </div>
  );
}
