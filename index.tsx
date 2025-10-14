import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// PWA Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // In sandboxed environments, relative paths like '/sw.js' can be incorrectly
    // resolved against the parent origin ('https://ai.studio') instead of the
    // sandboxed origin. To fix this, we construct an absolute URL using
    // `window.location.origin` as the base, ensuring the service worker is
    // loaded from the correct, same-origin location.
    const swUrl = new URL('/sw.js', window.location.origin).href;
    navigator.serviceWorker.register(swUrl).then(registration => {
      // SW registration successful
    }).catch(registrationError => {
      console.error('SW registration failed: ', registrationError);
    });
  }
};

// Register the service worker after the page has fully loaded,
// or immediately if it's already complete. This prevents a race condition
// where the 'load' event fires before the listener is attached.
if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);