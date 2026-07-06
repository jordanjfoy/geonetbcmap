import { SYMBOLS } from '../../styles/styles';
import  '../../styles/index.scss';
import { styleFunction } from '../layers/Style';


export default function Legend() {
  return (
    <div className="legend">
      <h4>Geodetic Control</h4>

      {SYMBOLS.map((item) => (
        <div key={item.id} className="legend-row">
          <span
            style={styleFunction: ({ get: () => item.id }).getImage().getFill().getColor()}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
