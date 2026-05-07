import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { App } from './App';
import './index.css';

document.documentElement.classList.add("dark");

// Register servi
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    console.log("Service worker registered", reg);
  });
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster />
  </>,
)
