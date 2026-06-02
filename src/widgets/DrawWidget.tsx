
import { useContext } from 'react';
import MapContext from '../context/MapContext';

export default function DrawWidget() {
  const ctx = useContext(MapContext);

  if (!ctx) return null;

  return (
    <button onClick={() => ctx.setActiveTool('draw')}>
      Draw
    </button>
  )}
