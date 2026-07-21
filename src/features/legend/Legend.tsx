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
      if (resolution == null) return;
      setLegendUrl(resolveLegendUrl(resolution));
      
      console.log("resolver:", resolveLegendUrl);
      console.log("resolver type:", typeof resolveLegendUrl);

      const url = resolveLegendUrl(resolution);

      console.log("url:", url);
      console.log("url type:", typeof url);

    };

    refresh();
    view.on('change:resolution', refresh);

    return () => {
      view.un('change:resolution', refresh);
    };
  }, [map, resolveLegendUrl]);

  if (!legendUrl) return null;


  return (
    <div className="legend">
      <h4>Geodetic Control</h4>
        <img src={legendUrl} alt="Legend" />
    </div>
  );
}