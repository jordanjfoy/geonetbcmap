import { useState, useRef, ReactNode } from 'react';
import Map from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import MapContext from '../../context/MapContext';
import { buildImageLayerSet } from '../../features/layers/ImageLayerComponent';

export function MapProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [drawType, setDrawType] = useState<string | null>(null);
  const [overlayElement, setOverlayElement] = useState<HTMLElement | null>(null);
  const [MeasureType, setMeasureType] = useState<string | null>(null);

  const baseLayersRef = useRef<LayerGroup | null>(null);

  // Initialize imageLayersRef with the actual LayerGroup
  const imageLayersRef = useRef<LayerGroup | null>(null);

  if (!imageLayersRef.current) {
    const { layerGroup, resolveLegendUrl } = buildImageLayerSet();
    // Attach resolver directly to the LayerGroup properties
    layerGroup.set('resolveLegendUrl', resolveLegendUrl);
    imageLayersRef.current = layerGroup;
  }

  const setExtent = (extent: number[]) => {
    if (mapInstance) {
      mapInstance.getView().fit(extent, { duration: 1000 });
    }
  };

  const zoomIn = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const zoom = view.getZoom() || 0;
      view.setZoom(zoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const zoom = view.getZoom() || 0;
      view.setZoom(zoom - 1);
    }
  };

  const pan = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const center = view.getCenter();
      if (center) {
        view.setCenter([center[0] + 10000, center[1]]); // Pan right by 10,000 units
      }
    }
  };

  const previousExtent = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const extentHistory = (view as any).extentHistory || [];
      const currentIndex = (view as any).currentIndex;

      if (currentIndex > 0) {
        const nextIndex = currentIndex - 1;
        (view as any).currentIndex = nextIndex;
        (view as any).navigationTimestamp = Date.now();

        const state = extentHistory[nextIndex];
        if (state && state.center) {
          view.setCenter(state.center);
          view.setZoom(state.zoom);
        }
      }
    }
  };

  const nextExtent = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const extentHistory = (view as any).extentHistory || [];
      const currentIndex = (view as any).currentIndex;

      if (currentIndex < extentHistory.length - 1) {
        const nextIndex = currentIndex + 1;
        (view as any).currentIndex = nextIndex;
        (view as any).navigationTimestamp = Date.now();

        const state = extentHistory[nextIndex];
        if (state && state.center) {
          view.setCenter(state.center);
          view.setZoom(state.zoom);
        }
      }
    }
  };

  return (
    <MapContext.Provider
      value={{
        baseLayersRef,
        map: mapInstance,
        activeTool,
        setActiveTool,
        drawType,
        overlayElement,
        setOverlayElement,
        setDrawType,
        setMapInstance,
        setExtent,
        zoomIn,
        zoomOut,
        pan,
        previousExtent,
        nextExtent,
        imageLayersRef,
        MeasureType,
        setMeasureType
      }}
    >
      {children}
    </MapContext.Provider>
  );
}