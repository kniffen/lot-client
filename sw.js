self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.', event.clientId);

  event.waitUntil(async () => {
    try {
      if (!event.clientId) {
        console.error('Missing client Id')
        return
      }
      const client = self.clients.get(event.clientId)

      console.log(client)
      client.postMessage({
        msg: `\n${new Date()} Service worker active`,
        url: event.request.url,
      });
    } catch (err) {
      console.error(err)
    }
  })

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
    event.waitUntil(async () => {
      try {
        if (!event.clientId) {
          console.error('Missing client Id')
          return
        }
        const client = self.clients.get(event.clientId)
  
        console.log(client)
        client.postMessage({
          msg: `\n${new Date()} Service worker push`,
          url: event.request.url,
        });
      } catch (err) {
        console.error(err)
      }
    })

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
