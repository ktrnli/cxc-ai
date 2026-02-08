interface UploadButtonProps {
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function UploadButton({ style, onClick }: UploadButtonProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        height: '68px',
        left: '431px',
        top: '183px',
        width: '305px',
        cursor: 'pointer',
        ...style
      }} 
      data-name="Upload Button"
      onClick={onClick}
    >
      {/* Button border with rotation */}
      <div 
        style={{
          position: 'absolute',
          display: 'flex',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            flexShrink: 0,
            height: '68px',
            transform: 'rotate(180deg)',
            width: '305px'
          }}
        >
          <div 
            style={{
              background: 'rgba(0,0,0,0)',
              border: '2px solid #c8b6ff',
              borderRadius: '200px',
              width: '100%',
              height: '100%'
            }} 
          />
        </div>
      </div>

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
          right: '11.15%',
          bottom: '14.71%',
          left: '11.15%',
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
          Upload Sheet Music
        </p>
      </div>
    </div>
  );
}
