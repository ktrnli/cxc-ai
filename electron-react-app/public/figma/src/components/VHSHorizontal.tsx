import imgVhsVertical from "figma:asset/a93e158ffb43269b996fca21c5f2601565964428.png";

interface VHSHorizontalProps {
  style?: React.CSSProperties;
}

export function VHSHorizontal({ style }: VHSHorizontalProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        display: 'flex',
        height: '500.404px',
        alignItems: 'center',
        justifyContent: 'center',
        left: '66px',
        top: '292px',
        width: '714.128px',
        ...style
      }}
    >
      <div 
        style={{
          flexShrink: 0,
          transform: 'rotate(89.4deg)'
        }}
      >
        <div 
          style={{
            height: '709px',
            position: 'relative',
            boxShadow: '10px 5px 17px 0px rgba(0,0,0,0.4)',
            width: '493px'
          }} 
          data-name="VHS Horizontal"
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
                height: '122.65%',
                left: '-101.55%',
                maxWidth: 'none',
                top: '-11.59%',
                width: '226.77%'
              }}
              src={imgVhsVertical} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
