import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { App } from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

document.documentElement.classList.add("dark");

// Register servi
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    console.log("Service worker registered", reg);
  });
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster />
  </QueryClientProvider>,
)
