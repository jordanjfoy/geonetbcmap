import { useContext } from 'react';
import MapContext from '../context/MapContext';

export default function ResetExtentWidget() {
  const ctx = useContext(MapContext);

  if (!ctx || !ctx.map) return null;

  const handleResetExtent = () => {
    // Use BC extent as the default/full extent
    ctx.setExtent([-13800000, 7200000, -13800000, 7200000]);
  };

  return (
    <button onClick={handleResetExtent}>
      Full Extent
    </button>
  )}
