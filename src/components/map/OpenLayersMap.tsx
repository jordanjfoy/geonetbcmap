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


// Layers etc. 
import BaseLayersComponent from '../layers/BaseLayersComponent';
import VectorLayersComponent from '../layers/VectorLayersComponent';
import VectorLayer from 'ol/layer/Vector';

/* helper function to create BC Vector layer with style applied */

function flattenVectorLayers(layers: any): VectorLayer<any>[] {
  // layers might be a LayerGroup
  const out: VectorLayer<any>[] = [];

  const visit = (layer: any) => {
    if (!layer) return;

    // LayerGroup in OL has getLayers()
    if (typeof layer.getLayers === "function") {
      const groupLayers = layer.getLayers().getArray();
      groupLayers.forEach(visit);
      return;
    }

    // VectorLayer has getSource() and usually is instance of VectorLayer
    // Safer check: presence of a vector-like source
    if (typeof layer.getSource === "function" && layer.getSource()) {
      out.push(layer as VectorLayer<any>);
    }
  };

  visit(layers);
  return out;
}

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

    const vectors = flattenVectorLayers(overlays)

    // -- Original View 
    const initialView = {
      center: [-13800000, 7200000],
      zoom: 6
    };

    // --- click -> select feature(s) ---
    useEffect(() => {
    if (!overlays) return;
    const map = mapRef.current;
    if (!map) return;

    const select = new Select({
      layers: vectors, // only select from this layer
      hitTolerance: 5,
    });

    const onSelect = (e: any) => {
      const feature = e.selected?.[0];
      if (!feature) return;

      const props = feature.getProperties();
      delete props.geometry;
      console.log("clicked properties:", props);
    };

    select.on("select", onSelect);
    map.addInteraction(select);

    return () => {
      select.un("select", onSelect);
      map.removeInteraction(select);
    };
  }, [overlays]);


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