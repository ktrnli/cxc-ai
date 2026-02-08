import React from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Running, Feedback } from "./pages";
import './index.css';
import Background from './components/background';



const App = () => {
  return (<div style={{ width: '100%', height: '600px', position: 'relative' }}>
    <Background
      audioIntensity={2.66}
      hue={301}
      backgroundColor="#400194"
      externalEnabled={someState}
    />
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/running" element={<Running />} />
        <Route path="/feedback" element={<Feedback />} />

      </Routes>
    </Router>
  </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;