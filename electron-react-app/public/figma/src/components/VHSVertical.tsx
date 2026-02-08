import imgVhsVertical from "figma:asset/a93e158ffb43269b996fca21c5f2601565964428.png";

interface VHSVerticalProps {
  style?: React.CSSProperties;
}

export function VHSVertical({ style }: VHSVerticalProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        height: '757px',
        left: '793px',
        boxShadow: '5px 10px 17px 0px rgba(0,0,0,0.4)',
        top: '50px',
        width: '429px',
        ...style
      }} 
      data-name="VHS Vertical"
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <img 
          alt="" 
          style={{
            position: 'absolute',
            height: '125.49%',
            left: '-31.3%',
            maxWidth: 'none',
            top: '-14.91%',
            width: '284.48%'
          }}
          src={imgVhsVertical} 
        />
      </div>
    </div>
  );
}
