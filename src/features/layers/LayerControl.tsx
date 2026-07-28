import { useContext, useState, useEffect } from 'react';
import MapContext from '../../context/MapContext';
import BaseLayer from 'ol/layer/Base';

export default function LayerControl() {
  const ctx = useContext(MapContext);
  const [layers, setLayers] = useState<BaseLayer[]>([]);
  const [, forceUpdate] = useState(0); // re-render on checkbox toggle

  useEffect(() => {
    const group = ctx?.imageLayersRef?.current;
    if (!group) return;
    setLayers(group.getLayers().getArray());
  }, [ctx?.baseLayersRef]);

  const toggleLayer = (layer: BaseLayer) => {
    layer.setVisible(!layer.getVisible());
    forceUpdate((n) => n + 1); // re-render so checkbox reflects new state
  };

  if (!layers.length) return <div>No layers available</div>;

  return (
    <div className="layer-control">
      <h4>Layers</h4>
      {layers.map((layer, i) => {
        const name = layer.get('name') ?? `Layer ${i + 1}`;
        return (
          <label key={name} style={{ display: 'block', padding: '4px 0' }}>
            <input
              type="checkbox"
              checked={layer.getVisible()}
              onChange={() => toggleLayer(layer)}
            />
            {' '}{name}
          </label>
        );
      })}
    </div>
  );
}