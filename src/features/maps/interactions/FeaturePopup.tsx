// FeaturePopup.tsx
import { useEffect, useRef } from "react";
import Overlay from "ol/Overlay";

type Props = {
  map: any;                 // OpenLayers Map
  selectedFeature: any;    // ol/Feature | null
  coordinate: any;         // coordinate from event (or null)
};

export default function FeaturePopup({ map, selectedFeature, coordinate }: Props) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (!map || !popupRef.current) return;

    const popupEl = popupRef.current;

    const overlay = new Overlay({
      element: popupEl,
      autoPan: { animation: { duration: 250 } },
      offset: [0, -10],
    });

    map.addOverlay(overlay);
    overlayRef.current = overlay;

    return () => {
      if (!overlayRef.current) return;
      map.removeOverlay(overlayRef.current);
      overlayRef.current = null;
    };
  }, [map]);

    
  
    useEffect(() => {
    const overlay = overlayRef.current;
    const popupEl = popupRef.current;
    if (!overlay || !popupEl) return;

    // hide when no selection
    if (!selectedFeature || coordinate == null) {
        popupEl.style.display = "none";
        return;
    }

    const props = selectedFeature.getProperties();
    delete (props as any).geometry;

    const pos = coordinate;
    // final guard: must look like [x,y]
    if (!Array.isArray(pos) || typeof pos[0] !== "number" || typeof pos[1] !== "number") {
        popupEl.style.display = "none";
        return;
    }

    overlay.setPosition(pos);
    }, [selectedFeature, coordinate]);

  
    const featureProps = selectedFeature ? selectedFeature.getProperties() : {};

    return (
      <div
          ref={popupRef}
          style={{ display: selectedFeature ? "block" : "none" }}
          className="ol-popup card shadow"
        >
          <div className="card-body">
            <h5 className="card-title">Hello!</h5>

            <p>
              <strong>GCM_NUMBER:</strong> {featureProps.GCM_NUMBER}
            </p>

            <p>
              <strong>Type:</strong> {featureProps.type}
            </p>

            <p>
              <strong>ID:</strong> {featureProps.id}
            </p>
          </div>
        </div>

    );
}