import { useEffect, useState, useContext } from 'react';
import MapContext from '../../context/MapContext';
import type { LegendEntry } from '../layers/ImageLayerComponent'; // adjust path to match your file

type LegendResolver = (resolution: number) => LegendEntry[];

export default function Legend({
  resolveLegendUrl,
}: {
  resolveLegendUrl?: LegendResolver | null;
}) {
  const context = useContext(MapContext);
  const map = context?.map ?? null;

  const [legendEntries, setLegendEntries] = useState<LegendEntry[]>([]);

  useEffect(() => {
    if (!map || !resolveLegendUrl) return;

    const view = map.getView();
    const layerGroup = map.getLayerGroup();

    const refresh = () => {
      const resolution = view.getResolution();
      if (resolution == null) return;

      setLegendEntries(resolveLegendUrl(resolution));
    };

    refresh();

    view.on('change:resolution', refresh);
    layerGroup.on('change', refresh); // catches visibility toggles anywhere in the tree

    return () => {
      view.un('change:resolution', refresh);
      layerGroup.un('change', refresh);
    };
  }, [map, resolveLegendUrl]);

  if (legendEntries.length === 0) return null;

  return (
    <div className="legend">
      <h4>Legend</h4>

      {legendEntries.map(({ label, url }, index) => (
        <div key={index} className="legend-row">
          <img src={url} alt={label} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}