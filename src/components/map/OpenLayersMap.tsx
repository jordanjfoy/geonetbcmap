import { useEffect, useRef, useContext } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import { Select } from "ol/interaction";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import BaseLayerSwitcher from './BaseLayerSwitcher';

import { useState } from "react";
import MapInteractions from './MapInteractions';
import MapContext from "../../context/MapContext";
import BaseLayersComponent from "../layers/BaseLayersComponent";
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
    const vectors = flattenVectorLayers(overlays);

    const initialView = {
      center: [-13800000, 7200000],
      zoom: 6,
    };

    const map = new Map({
      target: mapDivRef.current,
      controls: defaultControls().extend([ScaleControl]),
      layers: [baseLayers, overlays],
      view: new View({
        projection: "EPSG:3857",
        center: initialView.center,
        zoom: initialView.zoom,
      }),
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