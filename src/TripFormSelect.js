/* eslint eqeqeq: 0 */
export default function TripFormSelect(props) {
  return (
    <select onChange={({target}) => doOnChange(target, props)} defaultValue="placeholder">
      <option value="placeholder" disabled>{props.placeholder}</option>
      {props.options.map(o => <option value={o[props.valueK]} key={o[props.valueK]}>{o[props.displayK]}</option>)}
    </select>
  );
}

function doOnChange(target, props) {
  return props.doOnChange(props.options.find(o => o[props.valueK] == target.value))
}
