import { useContext, useState } from "react";
import MapContext from "../../../context/MapContext";

type DrawDropdownProps = {
  onSelect?: (type: string) => void;
  drawTypes?: string[];
};

export const DrawDropdown = ({ 
  onSelect, 
  drawTypes = ['Polygon', 'LineString', 'Point'] 
}: DrawDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const mapCtx = useContext(MapContext);
  const { setActiveTool, setDrawType } = mapCtx || {};

  const handleDrawTypeClick = (type: string) => {
    setActiveTool?.('draw');
    setDrawType?.(type);
    onSelect?.(type);
    setShowMenu(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setShowMenu(!showMenu)}
        style={{ position: 'relative' }}
      >
        Draw ▼
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