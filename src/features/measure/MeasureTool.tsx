import { useContext, useState } from "react";
import MapContext from "../../context/MapContext";

//establish types 
type MeasureDropdownProps = {
  onSelect?: (type: string) => void;
  drawTypes?: string[];
};


export const MeasureDropdown = ({ 
  onSelect, 
  drawTypes = ['Length (LineString)', 'Area (Polygon)'] 
}: MeasureDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  //Wire this into the map through map context so tha
  const mapCtx = useContext(MapContext);
  
  const { setActiveTool, setMeasureType } = mapCtx || {};

  const handleDrawTypeClick = (type: string) => {
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
          {drawTypes.map(type => (
            <button
              key={type}
              onClick={() => handleDrawTypeClick(type)}
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