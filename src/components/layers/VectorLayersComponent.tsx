import LayerGroup from 'ol/layer/Group';

export default function VectorLayersComponent(): LayerGroup {
  return new LayerGroup({
    layers: []
  });
}