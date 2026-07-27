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

  // Per-style bookkeeping, keyed the same way throughout.
  const monumentSources: Record<string, ImageWMS> = {};
  const monumentStyles: Record<string, string> = {};
  const monumentLabels: Record<string, string> = {}; // only set for the "representative" style in each group
  const monumentLayers: Record<string, ImageLayer<ImageWMS>> = {};
  const monumentGroups: Record<string, LayerGroup> = {}; // parent group for visibility checks

  const buildMonumentLayer = (
    key: string,
    styleId: string,
    legendLabel?: string
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

    const layer = new ImageLayer({ source });

    monumentSources[key] = source;
    monumentStyles[key] = styleId;
    monumentLayers[key] = layer;

    if (legendLabel) {
      monumentLabels[key] = legendLabel;
    }

    return layer;
  };

  // Published GCM - GPS or GPS + Terrestrial (diamond)
  const gpsGroup = new LayerGroup({
    layers: [
      buildMonumentLayer('gpsRural', '1892', 'Published GCM - GPS'),
      buildMonumentLayer('gpsUrban', '1895'),
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

  // Map each representative key to its parent group, for visibility checks.
  monumentGroups['gpsRural'] = gpsGroup;
  monumentGroups['terrestrialRural'] = terrestrialGroup;
  monumentGroups['federalRural'] = federalBenchmarksGroup;
  monumentGroups['provincialRural'] = provincialBenchmarksGroup;
  monumentGroups['lowAccuracyRural'] = lowAccuracyGroup;
  monumentGroups['preliminaryRural'] = preliminaryGroup;
  monumentGroups['destroyedRural'] = destroyedGroup;

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

  const networkClassLayer = new ImageLayer({ source: networkClassSource });

  const superLayerGroup = new LayerGroup({
    layers: [
      terrestrialGroup,
      gpsGroup,
      federalBenchmarksGroup,
      provincialBenchmarksGroup,
      lowAccuracyGroup,
      preliminaryGroup,
      destroyedGroup,
      networkClassLayer,
    ],
  });

  // A monument style counts as "visible" only if both its own layer
  // AND its parent group are visible.
  const isMonumentVisible = (key: string) => {
    const layer = monumentLayers[key];
    const group = monumentGroups[key];
    if (!layer || !layer.getVisible()) return false;
    if (group && !group.getVisible()) return false;
    return true;
  };

  const resolveLegendUrl = (resolution: number): LegendEntry[] => {
    const entries: LegendEntry[] = [];

    for (const key of Object.keys(monumentLabels)) {
      if (!isMonumentVisible(key)) continue;

      const url = monumentSources[key].getLegendUrl(resolution, {
        STYLE: monumentStyles[key],
        WIDTH: 20,
        HEIGHT: 20,
      });

      if (url) entries.push({ label: monumentLabels[key], url });
    }

    if (networkClassLayer.getVisible()) {
      const networkUrl = networkClassSource.getLegendUrl(resolution, {
        STYLE: '10519',
      });
      if (networkUrl) entries.push({ label: 'Network Class', url: networkUrl });
    }

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