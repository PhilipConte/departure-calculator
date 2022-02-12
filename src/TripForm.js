import { useState } from 'react';
import { wmataRequest } from './requests';
import { usePersistedAPICall } from './hooks'

import TripFormSelect from './TripFormSelect';

export default function TripForm(props) {
  const lines = usePersistedAPICall('lines', [], requestLines);
  const stations = usePersistedAPICall('stations', [], requestStations);
  const [line, setLine] = useState(undefined);
  const [originStation, setOriginStation] = useState(undefined);
  const [towardsStation, setTowardsStation] = useState(undefined);
  const [minutesFromStation, setMinutesFromStation] = useState(undefined)

  return (
    <div className="tripForm">
      <p>Add a Trip</p>
      <div>
        <TripFormSelect
          placeholder="Line"
          options={Object.values(lines)}
          valueK="LineCode"
          displayK="DisplayName"
          doOnChange={setLine}
        />
        <TripFormSelect
          placeholder="Origin Station"
          options={filterStations(stations, line)}
          valueK="Code"
          displayK="Name"
          doOnChange={setOriginStation}
        />
        <TripFormSelect
          placeholder="Towards Station"
          options={getPossibleDestinations(stations, line)}
          valueK="Code"
          displayK="Name"
          doOnChange={setTowardsStation}
        />
        <TripFormSelect
          placeholder="Minutes From Station"
          options={[...Array(30).keys()].map(i => ({ v: i }))}
          valueK="v"
          displayK="v"
          doOnChange={setMinutesFromStation}
        />
      </div>
      <br/>
      <button onClick={() => trySubmit(props.addTrip, line, originStation, towardsStation, minutesFromStation)}>Add Trip</button>
    </div>
  );
}

// https://developer.wmata.com/docs/services/5476364f031f590f38092507/operations/5476364f031f5909e4fe330c?
async function requestLines() {
  const resp = await wmataRequest('https://api.wmata.com/Rail.svc/json/jLines');
  return resp.Lines.reduce((d, line) => {
    d[line.LineCode] = line;
    return d
  }, {});
}

// https://developer.wmata.com/docs/services/5476364f031f590f38092507/operations/5476364f031f5909e4fe3311?
async function requestStations() {
  const resp = await wmataRequest('https://api.wmata.com/Rail.svc/json/jStations');
  return resp.Stations.reduce((d, s) => {
    d[s.Code] = s;
    return d
  }, {});
}

function filterStations(stations, l) {
  return l ? Object.values(stations).filter(s => l.LineCode === s.LineCode1
    || l.LineCode === s.LineCode2
    || l.LineCode === s.LineCode3
    || l.LineCode === s.LineCode4
  ) : [];
}

function getPossibleDestinations(stations, line) {
  return line ? [stations[line.StartStationCode], stations[line.EndStationCode]] : [];
}

function trySubmit(addTrip, line, originStation, towardsStation, minutesFromStation) {
  if ([line, originStation, towardsStation, minutesFromStation].some(i => i === undefined)) {
    alert("Please fill all values");
    return;
  }
  addTrip({
    line: line,
    origin: originStation,
    towards: towardsStation,
    mfs: minutesFromStation.v,
    id: [line.LineCode, originStation.Code, towardsStation.Code, minutesFromStation.v].join('_')
  });
}
