
import { useEffect, useRef } from 'react';
import 'ol/ol.css';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';

export default function OpenLayersMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url:
              'https://tiles.arcgis.com/tiles/ubm4tcTYICKBpist/arcgis/rest/services/BC_BASEMAP_20240307/VectorTileServer'
          })
        })
      ],
      view: new View({
        center: [-13700000, 6600000], // BC (EPSG:3857)
        zoom: 6
      })
    });

    return () => map.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
