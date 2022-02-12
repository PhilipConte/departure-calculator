import { reg } from './serviceWorkerRegistration';
import { set } from "idb-keyval";


export default function Debug() {
  return (
    <div>
      <button onClick={testNotifications}>Test Notifications</button>
      <button onClick={clearData}>Clear Data</button>
    </div>
  );
}

async function testNotifications() {
  if ((await Notification.requestPermission()) !== 'granted') {
    alert("You must grant this page notification permissions");
    return;
  }
  alert('Try minimizing the app. You should recieve a push notification regardless in 10 seconds');
  reg.active.postMessage({
    type: 'TEST_NOTIFICATION',
  });
}

async function clearData() {
  await Promise.all(['lines', 'stations', 'trips'].map(k => set(k, undefined)));
  window.location.reload();
}
