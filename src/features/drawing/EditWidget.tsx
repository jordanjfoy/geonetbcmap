import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import VectorSource from 'ol/source/Vector';

function MapComponent() {
  const mapRef = useRef<Map | null>(null);
  const sourceRef = useRef(new VectorSource());
  const drawRef = useRef<Draw | null>(null);
  const modifyRef = useRef<Modify | null>(null);
  const snapRef = useRef<Snap | null>(null);

  const [drawType, setDrawType] = useState('Point');
  const [isEditMode, setIsEditMode] = useState(false);

  // Re-run whenever mode or draw type changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up old interactions
    if (drawRef.current) map.removeInteraction(drawRef.current);
    if (modifyRef.current) map.removeInteraction(modifyRef.current);
    if (snapRef.current) map.removeInteraction(snapRef.current);

    if (isEditMode) {
      const modify = new Modify({ source: sourceRef.current });
      map.addInteraction(modify);
      modifyRef.current = modify;
    } else {
      const draw = new Draw({ source: sourceRef.current, type: drawType as any });
      map.addInteraction(draw);
      drawRef.current = draw;
    }

    // Snap always added last, in both modes
    const snap = new Snap({ source: sourceRef.current });
    map.addInteraction(snap);
    snapRef.current = snap;

    // Cleanup on unmount / before next effect run
    return () => {
      if (drawRef.current) map.removeInteraction(drawRef.current);
      if (modifyRef.current) map.removeInteraction(modifyRef.current);
      if (snapRef.current) map.removeInteraction(snapRef.current);
    };
  }, [drawType, isEditMode]);

  return //unknown??//
}

  
