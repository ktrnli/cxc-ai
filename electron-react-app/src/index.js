import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

// Check if the root already exists on the window object (common for HMR)
// or just initialize it simply if you aren't doing complex HMR setups.
if (!window._root) {
  window._root = createRoot(container);
}

window._root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);