import { SYMBOLS } from '../../styles/styles';
import  '../../styles/index.scss';


/*export default function Legend() {
  return (
    <div className="legend">
      <h4>Geodetic Control</h4>

      {SYMBOLS.map((item) => (
        <div key={item.id} className="legend-row">
          <span
            style={styleFunction(item.id).getStyle()}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
*/

export default function Legend() {
  return (
    <div className="legend">
      <h4>Geodetic Control</h4>

      {SYMBOLS.map((item) => (
        <div key={item.id} className="legend-row">

          <span
            style={{
              backgroundColor: item.color,
              width: `${item.size}px`,
              height: `${item.size}px`
            }}
          />

          {item.label}

        </div>
      ))}
    </div>
  );
}
