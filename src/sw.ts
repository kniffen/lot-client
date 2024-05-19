const _self = self as unknown as ServiceWorkerGlobalScope;

_self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  _self.skipWaiting();
});

_self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

_self.addEventListener('message', event => {
  console.log('Service worker received message ' + JSON.stringify(event))
})

_self.addEventListener('sync', event => {
  console.log('Service Worker syncing.');
})

_self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png'
    };
    event.waitUntil(
      _self.registration.showNotification(data.title, options)
    );
  }
});
