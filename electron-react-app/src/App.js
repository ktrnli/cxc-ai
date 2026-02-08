import React from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Home, Running } from "./pages";
import './index.css';
import Background from './components/background';
import GlassSurface from './components/GlassSurface';

function GlassLayout() {
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
          width: '100%',
          maxWidth: 520,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '1.75rem',
          paddingBottom: '1.75rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          overflow: 'auto',
        }}
      >
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassSurface to="/">Home</GlassSurface>
        </nav>
        <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Outlet />
        </main>
      </GlassSurface>
    </div>
  );
}

const App = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
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