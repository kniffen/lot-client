self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.', event.clientId);

  self.clients.get(event.clientId)
    .then(client => {
      console.log(client)
      client.postMessage({
        msg: `\n${new Date()} Service worker active`,
        url: event.request.url,
      });
    }).catch(console.error);
  
  // self.registration.showNotification('Up and running', {
  //   body: 'Test!!!',
  //   vibrate: [200, 100, 200, 100, 200, 100, 200],
  //   tag: 'foo',
  //   renotify: true,
  //   requireInteraction: true
  // }).then(() => console.log('Sent the thing'))

  // setInterval(() => {
  //   self.registration.showNotification('interval', {
  //     body: 'Test!!',
  //     vibrate: [200, 100, 200, 100, 200, 100, 200],
  //     renotify: true,
  //     tag: 'bar',
  //     requireInteraction: true
  //   }).then(() => console.log('Sent the Pingu!'))
  // }, 10_000)
});

self.addEventListener('message', event => {
  console.log('Service worker received message ' + JSON.stringify(event))
})

self.addEventListener('sync', event => {
  console.log('Service Worker syncing.');
})

self.addEventListener('push', event => {
  if (event.data) {
    self.clients.get(event.clientId)
    .then(client => {
      client.postMessage({
        msg: `\n${new Date()} Service worker push`,
        url: event.request.url,
      });
    })
    .catch(console.error);

    const data = event.data.json();
    const options = {
        // body: data.body,
        body: 'Test!!!',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        renotify: true,
        requireInteraction: true,
        tag: 'baz',
    };
    console.log('notification', options);
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
