import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove loading screen once React is ready
const removeLoadingScreen = () => {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    loadingElement.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
      loadingElement.remove();
    }, 500);
  }
};

// Wait for both React and Three.js to be ready
const waitForAppReady = () => {
  // Check if Three.js canvas exists (indicates 3D component loaded)
  const checkCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Wait a bit more to ensure rendering is complete
      setTimeout(removeLoadingScreen, 800);
    } else {
      // Keep checking every 100ms
      setTimeout(checkCanvas, 100);
    }
  };
  
  // Start checking after React has mounted
  setTimeout(checkCanvas, 200);
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Wait for the app to be fully ready including 3D components
waitForAppReady();
