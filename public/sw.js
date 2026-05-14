// public/sw.js
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
      icon: "/icon.png",
    })
  );
});

// In your main JS (when tab is open)
navigator.serviceWorker.addEventListener('message', () => {
  const audio = new Audio('/sound.wav');
  audio.play();
});