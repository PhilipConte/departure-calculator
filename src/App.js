import './App.css';

import { usePersistedState } from './hooks'

import Debug from './Debug';
import TripForm from './TripForm';
import Trips from './Trips';

export default function App() {
  const [trips, setTrips] = usePersistedState('trips', []);

  return (
    <div className="App">
      <Trips trips={trips} />
      <TripForm addTrip={trip => setTrips([...trips, trip])} />
      <Debug/>
    </div>
  );
}
