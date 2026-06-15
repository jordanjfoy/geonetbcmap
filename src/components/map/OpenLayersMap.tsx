// React
import { useEffect, useRef, useState } from 'react';

// OpenLayers core styling
import 'ol/ol.css';

// Core map
import Map from 'ol/Map';
import View from 'ol/View';

// Context 
import MapContext from '../../context/MapContext';
import MapInteractions from './MapInteractions';
import { useContext } from 'react';

// Controls
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import BaseLayerSwitcher from './BaseLayerSwitcher';

// Layers
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import BaseLayersComponent from '../layers/BaseLayersComponent';

// Sources
import OSM from 'ol/source/OSM';
import VectorTileSource from 'ol/source/VectorTile';
import { XYZ } from 'ol/source';

// Formats
import MVT from 'ol/format/MVT';

// Styling helpers
import olms from 'ol-mapbox-style';

import { applyStyle } from 'ol-mapbox-style';


/* helper function to create BC Vector layer with style applied */


export default function OpenLayersMap() {
  const mapRef = useRef<HTMLDivElement>(null);
    // ← GET  values from context, don't create new state
  const ctx = useContext(MapContext);
  if (!ctx) return null;
  
 const { baseLayersRef, setMapInstance } = ctx;

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

    const baseLayers = BaseLayersComponent(); // ✅ store reference to baselayers for context access
  

    // --- Overlay Layers ---
    const overlays = new LayerGroup({
      layers: [
        // add your data layers here later
      ]
    });

    // -- Original View 
    const initialView = {
      center: [-13800000, 7200000],
      zoom: 6
    };


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
        center: initialView.center,
        zoom: initialView.zoom
      })
    });


    setMapInstance(map);  // ← Pass map up to context
    baseLayersRef.current = baseLayers;
    
    return () => map.setTarget(undefined);
  }, [setMapInstance]);

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div className="map-switcher">
        <BaseLayerSwitcher />
      </div>
      <MapInteractions />
    </div>
  );
};