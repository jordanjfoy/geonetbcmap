import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { Draw } from 'ol/interaction';

export default function DrawInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'draw') return;

    // Add Draw interaction to map when tool is active
    const draw = new Draw({
      type: 'Polygon', // or 'LineString', 'Point', etc.
    });

    ctx.map?.addInteraction(draw);

    return () => {
      if (ctx.map) ctx.map.removeInteraction(draw);
    };
  }, [ctx, ctx?.activeTool]);

  return null; // Interactions are managed via the map, not rendered
}
