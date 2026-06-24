import { useEffect, useContext } from 'react';
import MapContext from '../../../context/MapContext';
import { UIContext } from '../../../context/UIContext';
import { transform } from 'ol/proj';

export default function ClickInteraction() {
  const mapCtx = useContext(MapContext);
  const uiCtx = useContext(UIContext);

  if (!mapCtx || !uiCtx || !mapCtx.map) return null;

  useEffect(() => {
    const map = mapCtx.map;
    if (!map) return;

    const handleMapClick = (evt: any) => {
      let clickedFeature = null;
      let clickedCoordinates = evt.coordinate;

      // Get all features at the clicked pixel
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (!clickedFeature) {
          clickedFeature = feature;
        }
      });

      if (clickedFeature) {
        const properties = clickedFeature.getProperties();
        
        // Convert from map projection to WGS84 for display if needed
        const wgs84Coords = transform(
          clickedCoordinates,
          'EPSG:3857',
          'EPSG:4326'
        );

        uiCtx.setPopupData({
          properties,
          coordinates: clickedCoordinates,
          featureId: clickedFeature.getId(),
        });
        uiCtx.setShowPopup(true);
      } else {
        // Close popup if clicking on empty area
        uiCtx.setShowPopup(false);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.un('click', handleMapClick);
    };
  }, [mapCtx.map, uiCtx]);

  return null;
}
