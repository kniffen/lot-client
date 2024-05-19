self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
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
        body: data.body,
        icon: 'icons/512.png',
        badge: 'icons/512.png'
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
