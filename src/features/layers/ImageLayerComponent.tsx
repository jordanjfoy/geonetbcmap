import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';
import LayerGroup from 'ol/layer/Group';


export default function ImageLayersComponent():LayerGroup {
  const MonumentStatus = new ImageLayer({
    source: new ImageWMS({
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
        params: {
            LAYERS: ['pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL'],
            VERSION: ['1.3.0'],
            FORMAT: ['image/png']
        },
        projection: '4326'
        })
    })
    const NetworkClass = new ImageLayer({
    source: new ImageWMS({
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP/ows',
        params: {
            LAYERS: ['pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP'],
            VERSION: ['1.3.0'],
            FORMAT: ['image/png'],
            STYLE: ['10519']
        },
        projection: '4326'
    })


  })
    const imageLayers:LayerGroup = new LayerGroup({   
    layers: [
        MonumentStatus,
        NetworkClass
    ],
  });

  return imageLayers;
}


