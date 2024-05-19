const searchParams = new URLSearchParams(location.search);
const apiUrl = searchParams.get('api-url');
const vapid = searchParams.get('vapid');

navigator.serviceWorker?.register('/sw.ts')
  .then(reg  => {
    console.log('registered', reg)
    subscribeUser(reg);
  })
  .catch((e) => console.error(e, 'registration failed'))

const subscribeUser = (sw: ServiceWorkerRegistration) => {
  if (!vapid) return;
  const applicationServerKey = urlBase64ToUint8Array(vapid);

  sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
  }).then((subscription) => {
      console.log('User is subscribed:', subscription);
  }).catch((err) => {
      console.log('Failed to subscribe the user: ', err);
  });
}

const urlBase64ToUint8Array = (base64String: string) => {
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

  fetch(pingUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(console.log)
    .catch(console.error);
})

