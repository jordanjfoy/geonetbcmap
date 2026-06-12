/*all AI generated */
import { createContext } from 'react';
import Map from 'ol/Map';

// 1. Define the shape of the context (what you are sharing)
type MapContextType = {
  baseLayersRef: React.RefObject<any>;
  activeTool: string | null;
  map: Map | null;
  setActiveTool: (tool: string | null) => void;
  setMapInstance: (map: Map | null) => void;
  drawType: string | null;  
  setDrawType: (type: string | null) => void;
  setExtent: (extent: number[]) => void;

};

// 2. Create the context
const MapContext = createContext<MapContextType | null>(null);

export default MapContext;
``
