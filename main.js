const searchParams = new URLSearchParams(location.search);
const apiUrl = searchParams.get('api-url');
const vapid = searchParams.get('vapid');

const debug = document.getElementById('debug')

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
      debug.innerText = debug.innerText + `\n${new Date()} User is subscribed: ${subscription?.endpoint || ''}`
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

const pingUrl = new URL(`${apiUrl}/ping/${location.search.toString()}`);
document.getElementById('ping-btn')?.addEventListener('click', (e) => {
  e.preventDefault()
  debug.innerHTML = debug.innerText + `\n${new Date()} Pinging!`

  fetch(pingUrl, {
    method: 'POST'
  })
    .then(() => {
      debug.innerHTML = debug.innerText + `\n${new Date()} Pinged!`
    })
    .catch((err) => {
      debug.innerHTML = debug.innerText + `\n${new Date()} Error!`
      console.error(err)
    });
})

navigator.serviceWorker.addEventListener("message", (event) => {
  console.log(event.data.msg, event.data.url);
  debug.innerText = debug.innerText + event.data.msg
});

