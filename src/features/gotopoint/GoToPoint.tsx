import React, { useContext, useEffect, useRef, useState } from 'react';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import MapContext from '../../context/MapContext';


export default function GoToPoint() {
  const context = useContext(MapContext);
  const map = context?.map ?? null;

  // 1. React refs to attach OpenLayers overlay to actual DOM node
  const popupRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  // 2. React state for form inputs and tooltip text
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [tooltipText, setTooltipText] = useState<string>('');

  // 3. Initialize and attach the OpenLayers Overlay inside useEffect
  useEffect(() => {
    if (!map || !popupRef.current) return;

    const overlay = new Overlay({
      element: popupRef.current,
      offset: [0, -15],
      positioning: 'bottom-center',
      className: 'ol-tooltip-measure ol-tooltip ol-tooltip-static',
    });

    map.addOverlay(overlay);
    overlayRef.current = overlay;

    // Cleanup overlay when component unmounts
    return () => {
      map.removeOverlay(overlay);
    };
  }, [map]);

  // 4. Clean React event handler for form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!map || !overlayRef.current) return;

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) return;

    // Convert [Longitude, Latitude] to EPSG:3857 (Web Mercator)
    const projectedCoords = fromLonLat([parsedLon, parsedLat]);

    // Update map view smoothly
    map.getView().animate({
      center: projectedCoords,
      zoom: 17,
      duration: 500,
    });

    // Update overlay position and text content
    setTooltipText(`Lat: ${parsedLat}<br/> Lon: ${parsedLon}`);
    overlayRef.current.setPosition(projectedCoords);
  };

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
      {/* Search Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '12px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
        <button type="submit">Go to Point</button>
      </form>

      {/* The DOM node OpenLayers uses for the floating tooltip */}
      <div
        ref={popupRef}
        style={{
          backgroundColor: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
        }}
        dangerouslySetInnerHTML={{ __html: tooltipText }}
      />
    </div>
  );
}