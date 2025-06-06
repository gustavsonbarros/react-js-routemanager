import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <div style={{ height: '100%', width: '100%' }}>
      <App />
    </div>
  </StrictMode>
);