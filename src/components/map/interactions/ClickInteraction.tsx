

import { useEffect, useContext } from 'react';
import MapContext from '../../../context/MapContext';
import { UIContext } from '../../../context/UIContext';

import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { transform } from 'ol/proj';


export default function ClickInteraction() {
  const mapCtx = useContext(MapContext);
  const uiCtx = useContext(UIContext);

  useEffect(() => {
    if (!mapCtx?.map || !uiCtx) return;

    const map = mapCtx.map;

    const handleMapClick = (evt: MapBrowserEvent) => {
      const clickedCoordinates = evt.coordinate;

      const clickedFeature =
        map.forEachFeatureAtPixel(evt.pixel, (feature) => {
          return feature as Feature<Geometry>;
        }) || null;

      if (clickedFeature) {
        const properties = clickedFeature.getProperties();

        const wgs84Coords = transform(
          clickedCoordinates,
          'EPSG:3857',
          'EPSG:4326'
        );

        uiCtx.setPopupData({
          properties,
          coordinates: wgs84Coords as [number, number],
          featureId: clickedFeature.getId() ?? undefined,
        });

        uiCtx.setShowPopup(true);
      } else {
        uiCtx.setShowPopup(false);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.un('click', handleMapClick);
    };
  }, [mapCtx?.map, uiCtx?.setPopupData, uiCtx?.setShowPopup]);

  return null;
}

