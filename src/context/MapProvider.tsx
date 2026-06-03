import { createContext, useState, useRef, ReactNode, useEffect } from 'react';
import Map from 'ol/Map';
import MapContext from './MapContext';
import LayerGroup from 'ol/layer/Group';

export function MapProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [drawType, setDrawType] = useState<string | null>(null);  // ← Add this
  const baseLayersRef = useRef<LayerGroup>(null);

  return (
    <MapContext.Provider value={{ baseLayersRef, map: mapInstance, activeTool, setActiveTool, drawType, setDrawType, setMapInstance }}>
      {children}
    </MapContext.Provider>
  );
}