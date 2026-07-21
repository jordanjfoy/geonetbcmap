import { useEffect, useRef, useContext } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import { Select } from "ol/interaction";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import BaseLayerSwitcher from '../layers/BaseLayerSwitcher';

import { useState } from "react";
import MapInteractions from './MapInteractions';
import MapContext from "../../context/MapContext";
import BaseLayersComponent from "../layers/BaseLayersComponent";
import ImageLayerComponents from "../layers/ImageLayerComponent";
import VectorLayersComponent from "../layers/VectorLayersComponent";
import VectorLayer from "ol/layer/Vector";
import FeaturePopup from "./interactions/FeaturePopup";


function flattenVectorLayers(layers: any): VectorLayer<any>[] {
  const out: VectorLayer<any>[] = [];

  const visit = (layer: any) => {
    if (!layer) return;

    if (typeof layer.getLayers === "function") {
      layer.getLayers().getArray().forEach(visit);
      return;
    }

    if (typeof layer.getSource === "function" && layer.getSource()) {
      out.push(layer as VectorLayer<any>);
    }
  };

  visit(layers);
  return out;
}

export default function OpenLayersMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<any>(null);

  const ctx = useContext(MapContext);
  if (!ctx) return null;
  const { baseLayersRef, setMapInstance } = ctx;

  useEffect(() => {
    if (!mapDivRef.current) return;

    const ScaleControl = new ScaleLine({
      units: "metric",
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140,
    });

    const baseLayers = BaseLayersComponent();
    const overlays = VectorLayersComponent();
    const wms = ImageLayerComponents();
    const vectors = flattenVectorLayers(overlays);


    /*this portion here sets initial view of the map to apporx cover all of BC*/
    const initialView = {
      center: [-13800000, 7200000],
      zoom: 6,
    };

    const map = new Map({
      target: mapDivRef.current,
      controls: defaultControls().extend([ScaleControl]),
      layers: [baseLayers, overlays, wms],
      view: new View({
        projection: "EPSG:3857",
        center: initialView.center,
        zoom: initialView.zoom,
      }),
    });


    /*this is to track history for next/previous extent*/
    const view = map.getView();
    (view as any).extentHistory = [];
    (view as any).currentIndex = -1;
    (view as any).navigationTimestamp = 0;

    map.on("moveend", () => {
      // Skip if this moveend was triggered by our navigation (within 100ms)
      const now = Date.now();
      if (now - (view as any).navigationTimestamp < 100) {
        return;
      }

      const history = (view as any).extentHistory;
      const center = view.getCenter();
      if (!center) return;
      
      const currentState = {
        center: center.slice(),
        zoom: view.getZoom(),
      };

      // Don't save duplicates
      const last = history[(view as any).currentIndex];
      if (last && JSON.stringify(last) === JSON.stringify(currentState)) {
        return;
      }

      // Remove any history after current index (when navigating back then moving)
      if ((view as any).currentIndex < history.length - 1) {
        history.length = (view as any).currentIndex + 1;
      }

      history.push(currentState);
      (view as any).currentIndex = history.length - 1;
    });

    mapInstanceRef.current = map;
    setMapInstance(map);
    baseLayersRef.current = baseLayers;

    
    
    const select = new Select({
      layers: vectors,
      hitTolerance: 5,
    });

    const onSelect = (e: any) => {
      const feature = e.selected?.[0] ?? null;

      if (!feature) {
        setSelectedFeature(null);
        setSelectedCoordinate(null);
        return;
      }

      setSelectedFeature(feature);

      const geom = feature.getGeometry?.();
      const coord = geom?.getCoordinates?.();
      setSelectedCoordinate(coord);
    }

    select.on("select", onSelect);
    map.addInteraction(select);

    return () => {
      select.un("select", onSelect);
      map.removeInteraction(select);
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, [setMapInstance]);

  return (
    <div className="map-container">
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
      <FeaturePopup
        map={mapInstanceRef.current}
        selectedFeature={selectedFeature}
        coordinate={selectedCoordinate}
      />
      <div className="map-switcher">
        <BaseLayerSwitcher />
      </div>
      <MapInteractions />
    </div>
  );
}