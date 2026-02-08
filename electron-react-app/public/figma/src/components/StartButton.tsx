interface StartButtonProps {
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function StartButton({ style, onClick }: StartButtonProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        height: '68px',
        left: '106px',
        top: '183px',
        width: '305px',
        cursor: 'pointer',
        ...style
      }} 
      data-name="Start Button"
      onClick={onClick}
    >
      {/* Button border */}
      <div 
        style={{
          position: 'absolute',
          background: 'rgba(0,0,0,0)',
          border: '2px solid #c8b6ff',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '200px'
        }} 
      />

      {/* Button text */}
      <div 
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontStyle: 'italic',
          top: '14.71%',
          right: '22.95%',
          bottom: '14.71%',
          left: '22.95%',
          justifyContent: 'center',
          lineHeight: 0,
          color: '#e4dbff',
          fontSize: '24px'
        }}
      >
        <p 
          style={{
            lineHeight: 'normal',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}
        >
          Start Practice
        </p>
      </div>
    </div>
  );
}
