import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';
import { ImageWMS } from 'ol/source';

export function buildImageLayerSet() {
  const monumentStatusSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: ['pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL'],
      VERSION: '1.3.0',
      FORMAT: 'image/png',
    },
    projection: '4326',
  });

  const networkClassSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP/ows',
    params: {
      LAYERS: ['pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP'],
      VERSION: '1.3.0',
      FORMAT: 'image/png',
      STYLE: '10519',
    },
    projection: '4326',
  });

  const layerGroup = new LayerGroup({
    layers: [
      new ImageLayer({ source: monumentStatusSource }),
      new ImageLayer({ source: networkClassSource }),
    ],
  });

  const resolveLegendUrl = (resolution: number) => {
    return (
      monumentStatusSource.getLegendUrl(resolution) ??
      networkClassSource.getLegendUrl(resolution) ??
      ''
    );
  };

  return { layerGroup, resolveLegendUrl };
}

export default function ImageLayersComponent() {
  return buildImageLayerSet().layerGroup;
}