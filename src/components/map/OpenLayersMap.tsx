
// React
import { useEffect, useRef } from 'react';
// OpenLayers core styling
import 'ol/ol.css';
// Core map
import Map from 'ol/Map';
import View from 'ol/View';
// Controls
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import BaseLayerSwitcher from './BaseLayerSwitcher';
// Layers
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
// Sources
import OSM from 'ol/source/OSM';
import VectorTileSource from 'ol/source/VectorTile';
import { XYZ } from 'ol/source';
// Formats
import MVT from 'ol/format/MVT';
// Styling helpers
import olms from 'ol-mapbox-style';
import MapContext from '../../context/MapContext';
import { applyStyle } from 'ol-mapbox-style';


/* helper function to create BC Vector layer with style applied */
function createBCVectorLayer() {
  const layer = new VectorTileLayer({
    visible: false,
    properties: { name: 'BC Vector' },
    source: new VectorTileSource({
      format: new MVT(),
      url: 'https://tiles.arcgis.com/tiles/ubm4tcTYICKBpist/arcgis/rest/services/BC_BASEMAP_20240307/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    })
  });

  // ✅ Apply style immediately
  applyStyle(
    layer,
    "https://www.arcgis.com/sharing/rest/content/items/b1624fea73bd46c681fab55be53d96ae/resources/styles/root.json"
  ).catch(err => console.error(err));

  return layer;
}


export default function OpenLayersMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const baseLayersRef = useRef<LayerGroup>(null);



  useEffect(() => {
    
    if (!mapRef.current) return;

    const ScaleControl = new ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4,
        text: true,
        minWidth: 140
    });
    
    // --- Base Layers ---
    const baseLayers = new LayerGroup({
      layers: [
        new TileLayer({
          source: new OSM(),
          visible: true, // ✅ default base layer
          properties: { name: 'OSM' }
        }),

        createBCVectorLayer(),

        new TileLayer({
          visible: false,
          properties: { name: 'Imagery' },
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 19
          })
        })
      ]
    })
    baseLayersRef.current = baseLayers; // ✅ store reference to baselayers for context access


    // --- Overlay Layers ---
    const overlays = new LayerGroup({
      layers: [
        // add your data layers here later
      ]
    });


    // --- Map ---
    const map = new Map({
      target: mapRef.current,
      controls: defaultControls().extend([ScaleControl]),
      layers: [
        baseLayers,   
        overlays      
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: [-13800000, 7200000],
        zoom: 6
      })
    });
    
    return () => map.setTarget(undefined);
  }, []);

  /*return <div ref={mapRef} style={{ width: '100%', height: '100%' }} */

  return (
    <MapContext.Provider value={{ baseLayersRef }}>
      <div className="map-container">

        {/* 👇 THIS is where OpenLayers renders */}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* 👇 This sits on top */}
        <div className="map-switcher">
          <BaseLayerSwitcher />
        </div>

      </div>
    </MapContext.Provider>
  );

}
