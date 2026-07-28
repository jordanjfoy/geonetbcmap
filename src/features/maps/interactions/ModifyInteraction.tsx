import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { Modify, Snap } from 'ol/interaction';
import { getOrCreateDrawLayer } from './mapLayers';

export default function ModifyInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'edit' || !ctx.map) return;

    const source = getOrCreateDrawLayer(ctx.map);

    const modify = new Modify({ source });
    const snap = new Snap({ source }); // added after modify, same ordering rule as before

    ctx.map.addInteraction(modify);
    ctx.map.addInteraction(snap);

    return () => {
      if (ctx.map) {
        ctx.map.removeInteraction(modify);
        ctx.map.removeInteraction(snap);
      }
    };
  }, [ctx?.activeTool, ctx?.map]);

  return null;
}