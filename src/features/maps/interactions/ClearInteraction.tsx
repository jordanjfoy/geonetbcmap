import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { getOrCreateDrawLayer } from './mapLayers';

export default function ClearInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'clear' || !ctx.map) {
      return;
    }

    const source = getOrCreateDrawLayer(ctx.map);

    source.clear();
  }, [ctx?.activeTool, ctx?.map]);

  return null;
}