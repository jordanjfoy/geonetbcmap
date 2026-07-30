import { useContext, useState, useEffect } from 'react';
import MapContext from '../../context/MapContext';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';

interface LayerNodeProps {
  layer: BaseLayer;
  depth?: number;
}

function LayerNode({ layer, depth = 0 }: LayerNodeProps) {
  const [, forceUpdate] = useState(0);

  const toggleVisibility = (targetLayer: BaseLayer) => {
    targetLayer.setVisible(!targetLayer.getVisible());
    forceUpdate((n) => n + 1);
  };

  const isGroup = layer instanceof LayerGroup;
  const name = layer.get('title') || layer.get('name') || 'Unnamed Layer';

  if (isGroup) {
    const childLayers = (layer as LayerGroup).getLayers().getArray();

    return (
      <div style={{ marginLeft: `${depth * 16}px`, marginBottom: '4px' }}>
        <label style={{ fontWeight: 'bold', cursor: 'pointer', display: 'block' }}>
          <input
            type="checkbox"
            checked={layer.getVisible()}
            onChange={() => toggleVisibility(layer)}
          />
          {' '}{name}
        </label>
        <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '8px', marginTop: '4px' }}>
          {childLayers.map((child, idx) => (
            <LayerNode key={child.get('name') || idx} layer={child} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: `${depth * 16}px`, padding: '2px 0' }}>
      <label style={{ cursor: 'pointer', display: 'block' }}>
        <input
          type="checkbox"
          checked={layer.getVisible()}
          onChange={() => toggleVisibility(layer)}
        />
        {' '}{name}
      </label>
    </div>
  );
}

export default function LayerControl() {
  const ctx = useContext(MapContext);
  const [rootLayers, setRootLayers] = useState<BaseLayer[]>([]);

  useEffect(() => {
    const group = ctx?.imageLayersRef?.current;
    if (!group) return;

    if (group instanceof LayerGroup) {
      setRootLayers(group.getLayers().getArray());
    } else {
      setRootLayers([group]);
    }
  }, [ctx?.imageLayersRef]);

  if (!rootLayers.length) return <div>No layers available</div>;

  return (
    <div className="layer-control" style={{ fontFamily: 'sans-serif', padding: '8px' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Layers</h4>
      {rootLayers.map((layer, idx) => (
        <LayerNode key={layer.get('name') || idx} layer={layer} />
      ))}
    </div>
  );
}