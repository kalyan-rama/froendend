import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Professional Zero-Touch production routing proxy
const apiBase = (import.meta as any).env.VITE_API_URL;
if (apiBase) {
  const cleanApiBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  
  // 1. Transparent Fetch redirection
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string") {
      if (input.startsWith("/api/")) {
        return originalFetch(`${cleanApiBase}${input}`, init);
      }
      if (input.startsWith("/uploads/")) {
        return originalFetch(`${cleanApiBase}${input}`, init);
      }
    }
    return originalFetch(input, init);
  };

  // 2. Transparent Image Source path redirection
  const originalSetAttribute = HTMLImageElement.prototype.setAttribute;
  HTMLImageElement.prototype.setAttribute = function (name, value) {
    let finalValue = value;
    if (name === "src" && typeof value === "string") {
      if (value.startsWith("/uploads/")) {
        finalValue = `${cleanApiBase}${value}`;
      }
    }
    return originalSetAttribute.call(this, name, finalValue);
  };

  const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (descriptor && descriptor.set) {
    const originalSet = descriptor.set;
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      ...descriptor,
      set: function (value) {
        let finalValue = value;
        if (typeof value === "string" && (value.startsWith("/uploads/") || value.startsWith(window.location.origin + "/uploads/"))) {
          const relativePath = value.startsWith("/uploads/") ? value : value.slice(window.location.origin.length);
          finalValue = `${cleanApiBase}${relativePath}`;
        }
        return originalSet.call(this, finalValue);
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
