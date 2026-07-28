import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export let vectorSource: VectorSource | null = null;
export let vectorLayer: VectorLayer | null = null;

export function getOrCreateDrawLayer(map: import('ol/Map').default) {
  if (!vectorSource) {
    vectorSource = new VectorSource();
    vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: { name: 'Drawn Features' },
    });
    map.addLayer(vectorLayer);
  }
  return vectorSource;
}

