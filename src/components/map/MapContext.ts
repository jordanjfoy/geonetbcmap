/*all AI generated */
import { createContext } from 'react';

// 1. Define the shape of the context (what you are sharing)
type MapContextType = {
  baseLayersRef: React.RefObject<any>;
};

// 2. Create the context
const MapContext = createContext<MapContextType | null>(null);

export default MapContext;
``
