import './App.css';

import { wmataRequest } from './requests'
import { useState } from 'react';

export default function Trip(props) {
  const [calculating, setCalculating] = useState(false)
  return (
    <div>
      {props.t.origin.Name} to {props.t.towards.Name} {props.t.mfs}
      {calculating ? undefined : <button onClick={() => StartCalculation(props.t, setCalculating)}>Calculate</button>}
    </div>
  );
}

// https://developer.wmata.com/docs/services/547636a6f9182302184cda78/operations/547636a6f918230da855363f
async function StartCalculation(trip, setCalculating) {
  const result = await Notification.requestPermission();
  if (result !== 'granted') {
    alert("You must grant this page notification permissions");
    return;
  }

  const resp = await wmataRequest(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${trip.origin.Code}`)
  const time = resp.Trains
    .filter(tn => tn.DestinationCode === trip.towards.Code)
    .map(tn => parseInt(tn.Min, 10) - trip.mfs)
    .find(i => i >= 0);

  if (time === undefined) {
    alert("No train found");
    return;
  };

  alert(`sending notification in ${time} minutes`);
  setCalculating(true);
  await delay(1000 * 60 * time);
  setCalculating(false);
  showNotification("Go Go Go!");
}

async function showNotification(msg) {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification('Departure Calculator', {
      body: msg,
      timestamp: Date.now(),
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    });
  });
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
