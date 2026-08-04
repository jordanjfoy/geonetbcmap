import React, { useContext, useEffect, useRef, useState } from 'react';
import Overlay from 'ol/Overlay';
import { fromLonLat, transform } from 'ol/proj';
import MapContext from '../../context/MapContext';

type CoordType = 'latlon' | 'utm7n' | 'utm8n' | 'utm9n' | 'utm10n' | 'utm11n';

export default function GoToPoint() {
  const context = useContext(MapContext);
  const map = context?.map ?? null;

  const popupRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  const [coordType, setCoordType] = useState<CoordType>('latlon');
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');
  const [tooltipText, setTooltipText] = useState<string>('');

  useEffect(() => {
    if (!map || !popupRef.current) return;

    const overlay = new Overlay({
      element: popupRef.current,
      offset: [0, -15],
      positioning: 'bottom-center',
      className: 'ol-tooltip-measure ol-tooltip ol-tooltip-static',
      stopEvent: true,
    });

    map.addOverlay(overlay);
    overlayRef.current = overlay;

    return () => {
      map.removeOverlay(overlay);
    };
  }, [map]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!map || !overlayRef.current) return;

    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if (isNaN(num1) || isNaN(num2)) return;

    let projectedCoords: number[] = [];
    let displayInfo = '';

    if (coordType === 'latlon') {
      projectedCoords = fromLonLat([num2, num1]);
      displayInfo = `<b>Lat:</b> ${num1}<br/><b>Lon:</b> ${num2}`;
    } else if (coordType === 'utm7n') {
      projectedCoords = transform([num1, num2], 'EPSG:32607', map.getView().getProjection());
      displayInfo = `<b>Easting:</b> ${num1}<br/><b>Northing:</b> ${num2}`;
    } else if (coordType === 'utm8n') {
      projectedCoords = transform([num1, num2], 'EPSG:32608', map.getView().getProjection());
      displayInfo = `<b>Easting:</b> ${num1}<br/><b>Northing:</b> ${num2}`;
    } else if (coordType === 'utm9n') {
      projectedCoords = transform([num1, num2], 'EPSG:32609', map.getView().getProjection());
      displayInfo = `<b>Easting:</b> ${num1}<br/><b>Northing:</b> ${num2}`;
    } else if (coordType === 'utm10n') {
      projectedCoords = transform([num1, num2], 'EPSG:32610', map.getView().getProjection());
      displayInfo = `<b>Easting:</b> ${num1}<br/><b>Northing:</b> ${num2}`;
    } else if (coordType === 'utm11n') {
      projectedCoords = transform([num1, num2], 'EPSG:32611', map.getView().getProjection());
      displayInfo = `<b>Easting:</b> ${num1}<br/><b>Northing:</b> ${num2}`;
    } 


    map.getView().animate({
      center: projectedCoords,
      zoom: 17,
      duration: 500,
    });

    setTooltipText(displayInfo);
    overlayRef.current.setPosition(projectedCoords);
  };
  
  const handleDismissPopup = () => {
    // 1. Tell OpenLayers to hide the overlay on the map
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }
    // 2. Clear the tooltip content in React state
    setTooltipText('');
  };
  return (
    <>
      {/* 1. Fixed Floating Panel */}
      <div className="goto-panel">
        <form onSubmit={handleSubmit} className="goto-form">
          <div className="goto-field-group">
            <label className="goto-label">Format:</label>
            <select
              value={coordType}
              onChange={(e) => setCoordType(e.target.value as CoordType)}
              className="goto-select"
            >
              <option value="latlon">Lat / Long (WGS 84)</option>
              <option value="utm7n">UTM Zone 7N</option>
              <option value="utm8n">UTM Zone 8N</option>
              <option value="utm9n">UTM Zone 9N</option>
              <option value="utm10n">UTM Zone 10N</option>
              <option value="utm11n">UTM Zone 11N</option>
            </select>
          </div>

          <div className="goto-field-group">
            <input
              type="number"
              step="any"
              placeholder={coordType === 'latlon' ? 'Latitude' : 'Easting'}
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              className="goto-input"
            />
            <input
              type="number"
              step="any"
              placeholder={coordType === 'latlon' ? 'Longitude' : 'Northing'}
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              className="goto-input"
            />
            <button type="submit" className="goto-button">
              Go
            </button>
          </div>
        </form>
      </div>

      {/* 2. Map Popup Overlay */}
      <div
        ref={popupRef}
        className="goto-tooltip"
        onClick={handleDismissPopup} // <-- Add click handler here
        style={{ cursor: 'pointer' }} // Visual hint that it's clickable
        dangerouslySetInnerHTML={{ __html: tooltipText }}
      />
    </>
  );
}