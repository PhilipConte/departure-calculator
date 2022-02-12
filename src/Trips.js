import { useState, useCallback } from "react";
import { useEventListener } from "./hooks";
import Trip from './Trip';

export default function Trips(props) {
  const [calculating, setCalculating] = useState(false);

  const handler = useCallback(event => {
      if (event.data && event.data.type === 'NOTIFIED') {
        setCalculating(false);
      }
    },
    [setCalculating]
  );
  useEventListener("message", handler, navigator.serviceWorker);

  return (
    <div>
      <p>Your Trips</p>
      <ul>
        {props.trips.map(t => <Trip
          key={t.id}
          t={t}
          calculating={calculating}
          setCalculating={setCalculating}
        />)}
      </ul>
    </div>
  );
}
