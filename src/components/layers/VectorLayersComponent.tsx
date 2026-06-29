import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { WFS, GeoJSON } from 'ol/format';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import { styleFunction } from './StyleComponent'; 

export default function VecLayersComponent(): LayerGroup{
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent:number[]) {
      return (
        'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP/ows?' +
        'service=WFS&version=2.0.0&request=GetFeature' +
        '&typeName=WHSE_REFERENCE.SRV_GEODETIC_CONTROL_SP' +
        '&outputFormat=application/json' +
        '&srsName=EPSG:3857' +
        '&bbox=' + extent.join(',') + ',EPSG:3857'
      );
    },
    strategy: bboxStrategy,
  });

  const vecLayers:LayerGroup = new LayerGroup({
    layers: [
      new VectorLayer({
        source: vectorSource,
        style: styleFunction,
        minZoom: 12, 
        maxZoom: 20
      }),
    ],
  });

  return vecLayers;
}




