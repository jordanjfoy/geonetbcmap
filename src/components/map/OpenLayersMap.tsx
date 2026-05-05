import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls } from 'ol/control';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import olms from 'ol-mapbox-style';

export default function OpenLayersMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls(),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: [-13700000, 6600000], // BC (EPSG:3857)
        zoom: 6
      })
    });

    const baseLayer = new VectorTileLayer({
      visible: true,
      source:  new VectorTileSource({
        format: new MVT(), // Mapbox Vector Tiles format,
        url:
          'https://tiles.arcgis.com/tiles/ubm4tcTYICKBpist/arcgis/rest/services/BC_BASEMAP_20240307/VectorTileServer/tile/{z}/{y}/{x}.pbf',
        attributions: 
          "Tiles © <a target='_blank',href='https://catalogue.data.gov.bc.ca/dataset/78895ec6-c679-4837-a01a-8d65876a3da9'>ESRI &GeoBC</a>",
        }),
        style: null, // Hide all vectors until a style is applied via olms
        //styleKey: "esri", // Key for selecting style rules
        });

    map.addLayer(baseLayer);
    
  // Fetch the Mapbox GL style JSON used by the vector tile basemap
  fetch("https://www.arcgis.com/sharing/rest/content/items/b1624fea73bd46c681fab55be53d96ae/resources/styles/root.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load style: ${response.statusText}`);
      }
      return response.json();
    })
    .then(glStyle => {
      // If the style has metadata, override the font loading path for OpenLayers
      if (glStyle.metadata) {
        glStyle.metadata["ol:webfonts"] =
          "path/to/your/cc/fonts/{fontfamily}/{fontweight}{-fontstyle}.css";
      }

      // Apply the Mapbox GL style to the OpenLayers layer
      olms.apply(baseLayer, glStyle);
    })
    .catch(error => {
      console.error("Error applying vector tile style:", error);
    });

    return () => map.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
