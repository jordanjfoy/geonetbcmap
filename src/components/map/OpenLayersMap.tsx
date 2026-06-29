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
import {Select} from "ol/interaction";

import BaseLayersComponent from '../layers/BaseLayersComponent';
import VectorLayersComponent from '../layers/VectorLayersComponent';

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
    const overlays = VectorLayersComponent();

    // -- Original View 
    const initialView = {
      center: [-13800000, 7200000],
      zoom: 6
    };

    // --- click -> select feature(s) ---
    const select = new Select({
      layers: [overlays],   // only select from this layer
      hitTolerance: 5,
      // optionally: condition: click only (default is click)
    });

    select.on("select", (e) => {
      // e.selected is an array of selected features
      const features = e.selected;
      if (!features.length) return;

      const feature = features[0];
      const props = feature.getProperties(); // includes geometry under "geometry" key

      console.log("clicked properties:", props);

      // common pattern: remove geometry key before displaying
      delete props.geometry;
    })
    

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