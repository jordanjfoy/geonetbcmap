import { useContext, useEffect, useRef } from 'react';
import MapContext from '../context/MapContext';
import { UIContext } from '../context/UIContext';
import { Overlay } from 'ol';
import '../../../styles/popup.scss';

export default function PopupComponent() {
  const mapCtx = useContext(MapContext);
  const uiCtx = useContext(UIContext);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);

  if (!mapCtx || !uiCtx || !mapCtx.map) return null;

  useEffect(() => {
    if (!popupRef.current || !mapCtx.map) return;

    // Create overlay if it doesn't exist
    if (!overlayRef.current) {
      overlayRef.current = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: true,
      });
      mapCtx.map.addOverlay(overlayRef.current);
    }

    // Update overlay position and visibility
    if (uiCtx.showPopup && uiCtx.popupData) {
      overlayRef.current.setPosition(uiCtx.popupData.coordinates);
    } else {
      overlayRef.current.setPosition(undefined);
    }

    return () => {
      if (overlayRef.current) {
        mapCtx.map?.removeOverlay(overlayRef.current);
        overlayRef.current = null;
      }
    };
  }, [mapCtx.map, uiCtx.showPopup, uiCtx.popupData?.coordinates]);

  if (!uiCtx.showPopup || !uiCtx.popupData) {
    return (
      <div
        ref={popupRef}
        className="popup"
        style={{ display: 'none' }}
      />
    );
  }

  const { properties } = uiCtx.popupData;

  return (
    <div
      ref={popupRef}
      className="popup"
      style={{
        display: uiCtx.showPopup ? 'block' : 'none',
      }}
    >
      <div className="popup-content">
        <button
          className="popup-close"
          onClick={() => uiCtx.setShowPopup(false)}
          title="Close popup"
        >
          ✕
        </button>
        <div className="popup-body">
          {Object.entries(properties).length > 0 ? (
            <dl className="property-list">
              {Object.entries(properties).map(([key, value]) => {
                // Skip geometry and internal properties
                if (
                  key === 'geometry' ||
                  key.toLowerCase().includes('boundingbox')
                ) {
                  return null;
                }

                return (
                  <div key={key} className="property-item">
                    <dt className="property-key">{key}</dt>
                    <dd className="property-value">
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          ) : (
            <p className="no-properties">No properties available</p>
          )}
        </div>
      </div>
    </div>
  );
}
