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


// Survey Monuments - Monument Status

// Published GCM - GPS or GPS + Terrestrial (diamond)
// Rural: 1892
// Urban: 1895

// Published GCM - Terrestrial (blue triangle)
// Rural: 1891
// Urban: 1894

// Published Federal Benchmarks (red square)
// Rural: 4159
// Urban: 4163

// Published BC Benchmarks (red border square)
// Rural: 4160
// Urban: 4164

// Non-Published GCM (Low Horizontal Accuracy) (purple triangle)
// Rural: 4161
// Urban: 4165

// Non-Published GCM (Preliminary) (blue circle)
// Rural: 4162
// Urban: 4166

// Destroyed GCM
// Rural: 1893
// Urban: 1896

export type LegendEntry = { label: string; url: string };

export function buildImageLayerSet() {
  const monumentUrl =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows';

  // Keep a handle on every monument source AND its human-readable label,
  // keyed by the same descriptive key, so legends can show labeled rows.
  const monumentSources: Record<string, ImageWMS> = {};
  const monumentLabels: Record<string, string> = {};
  const monumentStyles: Record<string, string> = {};



  const buildMonumentLayer = (
    key: string,
    styleId: string,
    legendLabel?: string // only pass this for the representative style in each group
  ) => {
    const source = new ImageWMS({
      url: monumentUrl,
      params: {
        LAYERS: 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL',
        VERSION: '1.3.0',
        FORMAT: 'image/png',
        STYLES: styleId,
      },
      projection: '4326',
    });

    if (legendLabel) {
      monumentSources[key] = source;
      monumentLabels[key] = legendLabel;
      monumentStyles[key] = styleId;
    }

    return new ImageLayer({ source });
  };

  // Published GCM - GPS or GPS + Terrestrial (diamond)
  const gpsGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('gpsRural', '1892', 'Published GCM - GPS'), // representative
      buildMonumentLayer('gpsUrban', '1895'), // no legendLabel = no legend row
    ],
  });

  // Published GCM - Terrestrial (blue triangle)
  const terrestrialGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('terrestrialRural', '1891', 'Published GCM - Terrestrial'),
      buildMonumentLayer('terrestrialUrban', '1894'),
    ],
  });

  // Published Federal Benchmarks (red square)
  const federalBenchmarksGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('federalRural', '4159', 'Published Federal Benchmark'),
      buildMonumentLayer('federalUrban', '4163'),
    ],
  });

  // Published BC Benchmarks (red border square)
  const provincialBenchmarksGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('provincialRural', '4160', 'Published BC Benchmark'),
      buildMonumentLayer('provincialUrban', '4164'),
    ],
  });

  // Non-Published GCM (Low Horizontal Accuracy) (purple triangle)
  const lowAccuracyGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('lowAccuracyRural', '4161', 'Non-Published GCM - Low Accuracy'),
      buildMonumentLayer('lowAccuracyUrban', '4165'),
    ],
  });

  // Non-Published GCM (Preliminary) (blue circle)
  const preliminaryGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('preliminaryRural', '4162', 'Non-Published GCM - Preliminary'),
      buildMonumentLayer('preliminaryUrban', '4166'),
    ],
  });

  // Destroyed GCM
  const destroyedGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('destroyedRural', '1893', 'Destroyed GCM'),
      buildMonumentLayer('destroyedUrban', '1896'),
    ],
  });

  // Leave networkClassSource as-is
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
      terrestrialGroup,
      gpsGroup,
      federalBenchmarksGroup,
      provincialBenchmarksGroup,
      lowAccuracyGroup,
      preliminaryGroup,
      destroyedGroup,
      new ImageLayer({
        source: networkClassSource,
      }),
    ],
  });

  const resolveLegendUrl = (resolution: number): LegendEntry[] => {
    const entries: LegendEntry[] = [];

    for (const [key, source] of Object.entries(monumentSources)) {
      if (!monumentLabels[key]) continue; // skip non-representative styles if you merged groups

      const url = source.getLegendUrl(resolution, {
        STYLE: monumentStyles[key], // <-- the missing piece
        WIDTH: 20,
        HEIGHT: 20,
      });

      if (url) entries.push({ label: monumentLabels[key], url });
    }

    const networkUrl = networkClassSource.getLegendUrl(resolution, {
      STYLE: '10519',
    });
    if (networkUrl) entries.push({ label: 'Network Class', url: networkUrl });

    return entries;
  };

  return {
    layerGroup: superLayerGroup,
    resolveLegendUrl,
  };
}

export default function ImageLayersComponent() {
  return buildImageLayerSet().layerGroup;
}