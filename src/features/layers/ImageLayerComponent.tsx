import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';
import { ImageWMS } from 'ol/source';

// Survey Monuments - Network Class 

// ACtive Control Point 
// Canadian Base 
// High Precision Network 
// Non - HPC Integrated 
// Other GCM 
// First Order Levelling 
// Other Benchmark 
// Destroyed GCM 


// Survey Monuments - Monumnet Status 

// Published GCM - GPS or GPS + Terrestrial (diamond)- 1892, 1895
// Publisehd GCM - Terrestrial (blue traingle) - 1891, 1894
// Publisehd Federal Benchmarks - Red Square - 4159, 4163
// Published BC - red border square - 4164, 4160
// Non - Published GCM (lOW HORIZONTAL accuracy) - purple triangle 4165, 4161
// Non Published - (prelimin) - Blue Circle 4166, 4162
// Destroyed GCM - 1893, 1896

export function buildImageLayerSet() {
  const ruralTerrestrial = new ImageLayer({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
      STYLES: '1892'
    },
    projection: '4326',
  });


  const urbanTerrestrial = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
      STYLES: '1895'
    },
    projection: '4326',
  });

  const terrestrialGroup = new LayerGroup({
    layers: [
      ruralTerrestrial,
      urbanTerrestrial,
    ],
  });

const gpsGroup = new LayerGroup({
  layers: [
    ruralGps,
    urbanGps,
  ],
});

const monumentsGroup = new LayerGroup({
  layers: [
    terrestrialGroup,
    gpsGroup,
  ],
});

  const monumentStatusSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
    },
    projection: '4326',
  });

  const monumentStatusSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
    },
    projection: '4326',
  });

  const monumentStatusSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
    },
    projection: '4326',
  });

  const monumentStatusSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
    },
    projection: '4326',
  });

  const networkClassSource = new ImageWMS({
    url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP/ows',
    params: {
      LAYERS: 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
      STYLES: '10519',
    },
    projection: '4326',
  });


  
  const superLayerGroup = new LayerGroup({
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