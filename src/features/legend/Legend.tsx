import { useEffect, useState, useContext } from 'react';
import MapContext from '../../context/MapContext';

type LegendResolver = (resolution: number) => string;

export default function Legend({
  resolveLegendUrl,
}: {
  resolveLegendUrl?: LegendResolver | null;
}) {
  const context = useContext(MapContext);
  const map = context?.map ?? null;
  const [legendUrl, setLegendUrl] = useState('');

  useEffect(() => {
    if (!map || !resolveLegendUrl) return;

    const view = map.getView();

    const refresh = () => {
      const resolution = view.getResolution();
      if (!resolution) return;
      setLegendUrl(resolveLegendUrl(resolution));
    };

    refresh();
    view.on('change:resolution', refresh);

    return () => {
      view.un('change:resolution', refresh);
    };
  }, [map, resolveLegendUrl]);

  if (!legendUrl) return null;

  return <img src={legendUrl} alt="Legend" />;
}