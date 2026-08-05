import ImageLayer from 'ol/layer/Image';
import LayerGroup from 'ol/layer/Group';
import { ImageWMS } from 'ol/source';

export type LegendEntry = { label: string; url: string };

export type ImageLayerSet = {
  layerGroup: LayerGroup;
  resolveLegendUrl: (resolution?: number) => LegendEntry[];
};

export function buildImageLayerSet(): ImageLayerSet {
  const monumentUrl =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL/ows';
  const networkUrl =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP/ows';

  const monumentSources: Record<string, ImageWMS> = {};
  const monumentStyles: Record<string, string> = {};
  const monumentLabels: Record<string, string> = {};
  const monumentLayers: Record<string, ImageLayer<ImageWMS>> = {};

  const createLayer = (
    baseUrl: string,
    layerName: string,
    key: string,
    styleId: string,
    legendLabel: string
  ) => {
    const source = new ImageWMS({
      url: baseUrl,
      params: {
        LAYERS: layerName,
        VERSION: '1.3.0',
        FORMAT: 'image/png',
        STYLES: styleId,
      },
      projection: '4326',
    });

    const layer = new ImageLayer({
      source,
      properties: { name: legendLabel, title: legendLabel },
    });

    monumentSources[key] = source;
    monumentStyles[key] = styleId;
    monumentLayers[key] = layer;
    monumentLabels[key] = legendLabel;

    return layer;
  };

  // Monument Status Master Group (10502 - 10508)
  const monumentStatusMasterGroup = new LayerGroup({
    properties: { name: 'Monument Status', title: 'Monument Status' },
    layers: [
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'terrestrial', '10503', 'Published GCM - Terrestrial Only'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'gps', '10502', 'Published GCM - GPS or GPS and Terrestrial'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'federal', '10504', 'Published Federal Benchmarks Except GPS'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'provincial', '10505', 'Published Provincial Benchmarks Except GPS'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'lowAccuracy', '10506', 'Non Published GCM Low Horizontal Accuracy'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'preliminary', '10507', 'Non Published GCM Preliminary'),
      createLayer(monumentUrl, 'pub:WHSE_REFERENCE.MASCOT_GEODETIC_CONTROL', 'destroyedStatus', '10508', 'Destroyed GCM (Monument Status)'),
    ],
  });

  // Network Class Master Group (10509 - 10516)
  const networkClassMasterGroup = new LayerGroup({
    properties: { name: 'Network Class', title: 'Network Class' },
    layers: [
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'activeControl', '10509', 'Active Control Point'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'canadianBase', '10510', 'Canadian Base Network'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'highPrecision', '10511', 'High Precision Network'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'nonHpn', '10512', 'Non HPN Integrated Survey Area'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'otherGcm', '10513', 'Other GCM'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'firstOrderLevelling', '10514', 'First Order Levelling'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'otherBenchmark', '10515', 'Other Benchmark'),
      createLayer(networkUrl, 'pub:WHSE_REFERENCE.SRV_GEODETIC_CONTROL_HP_PUB_SP', 'destroyedNetwork', '10516', 'Destroyed GCM (Network Class)'),
    ],
  });

  // Root Layer Group
  const superLayerGroup = new LayerGroup({
    properties: { name: 'Geodetic Control', title: 'Geodetic Control' },
    layers: [monumentStatusMasterGroup, networkClassMasterGroup],
  });

  /**
   * Always resolves legend graphic URLs regardless of scale
   */
  const resolveLegendUrl = (_resolution?: number): LegendEntry[] => {
    const entries: LegendEntry[] = [];

    for (const key of Object.keys(monumentLabels)) {
      const layer = monumentLayers[key];
      if (!layer || !layer.getVisible()) continue;

      const url = monumentSources[key].getLegendUrl(undefined, {
        STYLE: monumentStyles[key],
        WIDTH: 20,
        HEIGHT: 20
      });

      if (url) entries.push({ label: monumentLabels[key], url });
    }

    return entries;
  };

  // Store function directly inside OpenLayers custom properties
  superLayerGroup.set('resolveLegendUrl', resolveLegendUrl);

  return {
    layerGroup: superLayerGroup,
    resolveLegendUrl,
  };
}