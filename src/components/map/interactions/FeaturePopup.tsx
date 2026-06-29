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

    const fieldsToShow = ["name", "type", "id"]; // change keys
    const lines = fieldsToShow
        .filter((k) => props[k] !== undefined)
        .map((k) => `${k}: ${props[k]}`);

    popupEl.innerHTML = lines.length ? lines.join("<br/>") : "Selected feature";
    popupEl.style.display = "block";

    // normalize coordinate to [x,y]
    let pos: any = coordinate;

    // if coordinate is a GeometryCoordinate (nested arrays), attempt to extract a point
    if (Array.isArray(pos) && Array.isArray(pos[0]) && Array.isArray(pos[0][0])) {
        // MultiPolygon-ish: pos = [ [ [ [x,y], ... ] , ... ] , ... ]
        pos = pos[0][0][0];
    } else if (Array.isArray(pos) && Array.isArray(pos[0]) && typeof pos[0][0] === "number") {
        // Polygon-ish: pos = [ [x,y], ... ] (but sometimes extra nesting)
        // take first vertex
        pos = pos[0];
    }

    // final guard: must look like [x,y]
    if (!Array.isArray(pos) || typeof pos[0] !== "number" || typeof pos[1] !== "number") {
        popupEl.style.display = "none";
        return;
    }

    overlay.setPosition(pos);
    }, [selectedFeature, coordinate]);

  return <div ref={popupRef} style={{ display: "none" }} className="ol-popup" />;
}