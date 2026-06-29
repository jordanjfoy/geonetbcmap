import { SYMBOLS } from '../components/styles/styles';
import  '.././index.scss'



export default function Legend() {
  return (
    <div className="legend">
      <h4>Geodetic Control</h4>

      {SYMBOLS.map((item) => (
        <div key={item.id} className="legend-row">
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: item.color,
              borderRadius: item.shape === 'circle' ? '50%' : '0',
              marginRight: 6,
              display: 'inline-block'
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
