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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Remove loading screen after a short delay to ensure everything is rendered
setTimeout(removeLoadingScreen, 100);
