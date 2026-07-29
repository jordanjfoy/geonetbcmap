import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { getOrCreateDrawLayer } from './mapLayers';
import Feature from 'ol/Feature';

export default function EraseInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx?.map || ctx.activeTool !== 'erase') return;

    const source = getOrCreateDrawLayer(ctx.map);

    const handleClick = (event: any) => {
      const feature = ctx.map?.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature) {
        source.removeFeature(feature as Feature);
      }
    };

    ctx.map.on('click', handleClick);

    return () => {
      ctx.map?.un('click', handleClick);
    };
  }, [ctx?.map, ctx?.activeTool]);

  return null;
}