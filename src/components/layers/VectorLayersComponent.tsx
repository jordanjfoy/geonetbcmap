import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import { WFS, GeoJSON } from 'ol/format';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';

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


  const vecLayers = new LayerGroup({
    layers: [
      new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new CircleStyle({
          radius: 4,
          fill: new Fill({ color: 'red' }),
            })
        }),
      }),
    ],
  });

  return vecLayers;
}

