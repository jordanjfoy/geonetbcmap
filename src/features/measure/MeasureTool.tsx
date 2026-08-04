import { useContext, useState } from "react";
import MapContext from "../../context/MapContext";

//establish types 
type MeasureDropdownProps = {
  onSelect?: (type: string) => void;
  measureTypes?: string[];
};

//establishing variables to help us - this will calculate polygon area and line length :D 



export const MeasureDropdown = ({ 
  onSelect, 
  measureTypes = ['Length (m)', 'Area (m2)'] 
}: MeasureDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  //Wire this into the map through map context so tha
  const mapCtx = useContext(MapContext);
  
  const { setActiveTool, setMeasureType } = mapCtx || {};

  const handleMeasureTypeClick = (type: string) => {
    setActiveTool?.('measure');
    setMeasureType?.(type);
    onSelect?.(type);
    setShowMenu(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="ribbon-button"
        style={{ position: 'relative' }}
      >
        Measure ▼
      </button>
      
      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          zIndex: 1000,
          minWidth: '150px'
        }}>
          {measureTypes.map(type => (
            <button
              key={type}
              onClick={() => handleMeasureTypeClick(type)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};