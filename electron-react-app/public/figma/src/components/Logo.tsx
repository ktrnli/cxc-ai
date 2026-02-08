import imgKatsfavicon1 from "figma:asset/32780c1222698aa66400a44011bd08773b06c85a.png";

interface LogoProps {
  style?: React.CSSProperties;
}

export function Logo({ style }: LogoProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        height: '87px',
        left: '106px',
        top: '54px',
        width: '704px',
        ...style
      }} 
      data-name="Logo"
    >
      {/* Favicon image */}
      <div 
        style={{
          position: 'absolute',
          aspectRatio: '320/320',
          left: 0,
          right: '92.9%',
          top: '19px'
        }} 
        data-name="katsfavicon 1"
      >
        <img 
          alt="" 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            maxWidth: 'none',
            objectFit: 'cover',
            pointerEvents: 'none',
            width: '100%',
            height: '100%'
          }}
          src={imgKatsfavicon1} 
        />
      </div>

      {/* Text */}
      <div 
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fontStyle: 'italic',
          top: 0,
          right: 0,
          bottom: 0,
          left: '9.52%',
          justifyContent: 'center',
          lineHeight: 0,
          fontSize: '36px',
          color: 'white'
        }}
      >
        <p 
          style={{
            lineHeight: 'normal',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}
        >
          maestro.
        </p>
      </div>
    </div>
  );
}
