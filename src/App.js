import './App.css';

import TripForm from './TripForm';
import { usePersistedState } from './requests'
import Trip from './Trip';

export default function App() {
  const [trips, setTrips] = usePersistedState('trips', []);


  function addTrip(trip) {
    setTrips([...trips, trip])
  }

  return (
    <div className="App">
      <div>
        <p>Your Trips</p>
        <ul>
          {trips.map(t => <Trip key={t.id} t={t}/>)}
          <button onClick={()=>setTrips([])}>Clear Trips</button>
        </ul>
      </div>
      <TripForm addTrip={addTrip} />
    </div>
  );
}
