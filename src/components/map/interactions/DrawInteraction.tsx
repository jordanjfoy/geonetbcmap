import { useContext, useEffect, useRef } from 'react';
import MapContext from '../../../context/MapContext';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

let vectorLayer: VectorLayer | null = null;
let vectorSource: VectorSource | null = null;

export default function DrawInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'draw' || !ctx.drawType || !ctx.map) return;

    // Create vector layer and source only once
    if (!vectorSource) {
      vectorSource = new VectorSource();
      vectorLayer = new VectorLayer({
        source: vectorSource,
        properties: { name: 'Drawn Features' }
      });
      ctx.map.addLayer(vectorLayer);
    }

    const draw = new Draw({
      source: vectorSource,  // ← Add drawn features to this source
      type: ctx.drawType as 'Point' | 'LineString' | 'Polygon' | 'Circle',
    });

    ctx.map.addInteraction(draw);

    return () => {
      if (ctx.map) ctx.map.removeInteraction(draw);
    };
  }, [ctx?.activeTool, ctx?.drawType, ctx?.map]);

  return null;
}
