import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { Draw } from 'ol/interaction';
import { getOrCreateDrawLayer } from './mapLayers';

export default function DrawInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'draw' || !ctx.drawType || !ctx.map) return;

    const source = getOrCreateDrawLayer(ctx.map);

    const draw = new Draw({
      source,
      type: ctx.drawType as 'Point' | 'LineString' | 'Polygon' | 'Circle',
    });

    ctx.map.addInteraction(draw);

    return () => {
      if (ctx.map) ctx.map.removeInteraction(draw);
    };
  }, [ctx?.activeTool, ctx?.drawType, ctx?.map]);

  return null;
}