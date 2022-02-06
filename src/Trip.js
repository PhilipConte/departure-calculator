import './App.css';

import { wmataRequest } from './requests'

export default function Trip(props) {
  return (
    <div>
      {props.t.origin.Name} to {props.t.towards.Name} {props.t.mfs}
      <button onClick={() => StartEstimation(props.t)}>Estimate</button>
    </div>
  );
}

// https://developer.wmata.com/docs/services/547636a6f9182302184cda78/operations/547636a6f918230da855363f
async function StartEstimation(trip) {
  const resp = await wmataRequest(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${trip.origin.Code}`)
  const times = resp.Trains.filter(tn => tn.DestinationCode === trip.towards.Code)
    .map(tn => parseInt(tn.Min, 10) - trip.mfs);
  showNotification(times.join(" "))
}

function showNotification(msg) {
  Notification.requestPermission(function(result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Departure Calculator', {
          body: msg,
          timestamp: Date.now(),
          vibrate: [200, 100, 200, 100, 200, 100, 200],
        });
      });
    }
  });
}
