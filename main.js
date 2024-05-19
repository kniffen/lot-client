const searchParams = new URLSearchParams(location.search);
const apiUrl = searchParams.get('api-url');
const vapid = searchParams.get('vapid');

navigator.serviceWorker?.register('/sw.js', { scope: '/' })
  .then(reg  => {
    console.log('registered', reg)

    document.getElementById('subscribe')
      .addEventListener('click', () => {
        Notification.requestPermission()
          .then(() => {
            subscribeUser(reg);
          })
      });
  })
  .catch((e) => console.error(e, 'registration failed'))

const subscribeUser = (sw) => {
  if (!vapid) return;
  const applicationServerKey = urlBase64ToUint8Array(vapid);

  sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
  }).then((subscription) => {
      console.log('User is subscribed:', subscription);
      const subUrl = new URL(`${apiUrl}/subscribe/${location.search.toString()}`);
      fetch(subUrl, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(subscription)})
        .then(console.log)
        .catch(console.error);
  }).catch((err) => {
      console.log('Failed to subscribe the user: ', err);
  });
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const debug = document.getElementById('debug')
const pingUrl = new URL(`${apiUrl}/ping/${location.search.toString()}`);
document.getElementById('ping-btn')?.addEventListener('click', (e) => {
  e.preventDefault()
  debug.innerHTML = 'Pinging!'

  fetch(pingUrl, {
    method: 'POST'
  })
    .then(() => {
      debug.innerHTML = 'Pinged!'
    })
    .catch((err) => {
      debug.innerHTML = 'Error!'
      console.error(err)
    });
})

