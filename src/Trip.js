import { wmataRequest } from './requests'
import { reg } from './serviceWorkerRegistration';

export default function Trip(props) {
  const {calculating, setCalculating, t} = props;
  return (
    <div className='trip box'>
      <div className="toFrom">
        <div>
          <p>from:</p>
          <p>{t.origin.Name} ({t.mfs})</p>
        </div>
        <div>
          <p>to: </p>
          <p>{t.towards.Name}</p>
        </div>
      </div>
      {calculating ? undefined : <button onClick={() => StartCalculation(t, setCalculating)}>Calculate</button>}
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

  // const times = ["1", "2", "3"];
  const resp = await wmataRequest(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${trip.origin.Code}`)
  const times = resp.Trains
    .filter(tn => tn.DestinationCode === trip.towards.Code)
    .map (tn => tn.Min)
  const time = times.map(i => parseInt(i, 10) - trip.mfs).find(i => i >= 0);

  if (time === undefined) {
    alert("No train found");
    return;
  };

  const msgPromt = `Upcoming Departures: ${times.join(', ')}\n` +
    `send notification in ${time} minute${time === 1 ? '': 's'}?`
  if (!window.confirm(msgPromt)) return;

  setCalculating(true);
  reg.active.postMessage({
    type: 'SCHEDULE_NOTIFICATION',
    trip: trip,
    time: time,
  });
}
