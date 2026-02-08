import React from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Running } from "./pages";
import './index.css';
import Background from './components/background';
import GlassSurface from './components/GlassSurface';

function GlassLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <GlassSurface
        style={{
          position: 'relative',
          width: isHome ? 'min(1100px, 92vw)' : '100%',
          maxWidth: isHome ? undefined : 720,
          minHeight: isHome ? '75vh' : undefined,
          maxHeight: isHome ? '92vh' : '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          paddingTop: '1.75rem',
          paddingBottom: '1.75rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          overflow: 'auto',
        }}
      >
        {isHome && (
          <div
            className="maestro-deco cassette"
            style={{
              position: 'absolute',
              left: '50%',
              top: '55%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '60%',
              minWidth: 280,
              minHeight: 220,
              backgroundImage: 'url(/cassette.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              opacity: 0.9,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
        <header
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <Link to="/" className="maestro-logo" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="" />
            maestro.
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <Outlet />
          </div>
        </header>
      </GlassSurface>
    </div>
  );
}

const App = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <div
        className="app-purple-bg"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url(/purple_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Background
        audioIntensity={2.66}
        hue={301}
        backgroundColor="#400194"
        externalEnabled={true}
      />
      <Router>
        <Routes>
          <Route path="/" element={<GlassLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/running" element={<Running />} />
        </Routes>
      </Router>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;