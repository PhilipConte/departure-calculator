self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

console.log('SW loaded');
self.addEventListener('message', event => {
  if (!event.data) return;
  console.log(`SW received ${event.data.type}`);
  switch (event.data.type) {
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(event.data);
      break;
    case 'TEST_NOTIFICATION':
      delay(10).then(()=>showNotification('success'));
      break;
  }
});

async function scheduleNotification(data) {
  await delay(60 * data.time);
  showNotification('Time to Go!');
  (await self.clients.matchAll()).forEach(client => {
    client.postMessage({
      type: 'NOTIFIED'
    });
  });
}

async function showNotification(msg) {
  self.registration.showNotification('Departure Calculator', {
    body: msg,
    timestamp: Date.now(),
  });
}


function delay(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 * seconds);
  });
}
