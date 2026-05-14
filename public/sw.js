self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "You have a new update",
      icon: "/icons.svg",
    }).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'PLAY_SOUND' }));
      });
    })
  );
});