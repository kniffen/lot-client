self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  self.registration.showNotification('Up and running', {
    body: 'Test!!!',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    renotify: true,
    requireInteraction: true
  }).then(() => console.log('Sent the thing'))
});

self.addEventListener('message', event => {
  console.log('Service worker received message ' + JSON.stringify(event))
})

self.addEventListener('sync', event => {
  console.log('Service Worker syncing.');
})

self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
        // body: data.body,
        body: 'Test!!!',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        renotify: true,
        requireInteraction: true
    };
    console.log('notification', options);
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
