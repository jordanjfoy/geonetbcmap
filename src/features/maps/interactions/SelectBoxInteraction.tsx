import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';

import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { getWidth } from 'ol/extent.js';
import DragBox from 'ol/interaction/DragBox.js';
import Select from 'ol/interaction/Select.js';
import { vectorSource } from '../../layers/VectorLayersComponent'; 

import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';

export default function SelectBoxInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'select' || !ctx.map) return;

    const map = ctx.map;
    if (!vectorSource) return;
    const source = vectorSource;

    // Reuse style instances inside the effect to avoid unnecessary instantiations
    const selectedStyle = new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.6)' }),
      stroke: new Stroke({ color: '#ff0000', width: 3 }), // High contrast highlight
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: '#ff0000' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });

    const select = new Select({
      style: function (feature) {
        if (!feature) return selectedStyle;
        
        // Ensure property extraction has a valid fallback
        const rawColor = feature.get('COLOR_BIO');
        const color = rawColor || 'rgba(255, 0, 0, 0.8)';

        // Mutate the existing fill cleanly
        selectedStyle?.getFill()?.setColor(color);
        return selectedStyle;
      },
    });

    map.addInteraction(select);

    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    });

    map.addInteraction(dragBox);

    dragBox.on('boxstart', function () {
      select.getFeatures().clear();
    });

    dragBox.on('boxend', function () {
      const boxExtent = dragBox.getGeometry().getExtent();
      const worldExtent = map.getView().getProjection().getExtent();
      const worldWidth = getWidth(worldExtent);
      const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth);
      const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

      for (let world = startWorld; world <= endWorld; ++world) {
        const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0]);
        const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2]);
        const extent = [left, boxExtent[1], right, boxExtent[3]];

        const boxFeatures = source
          .getFeaturesInExtent(extent)
          .filter((feature) => feature.getGeometry()?.intersectsExtent(extent));

        const rotation = map.getView().getRotation();
        const oblique = rotation % (Math.PI / 2) !== 0;

        if (oblique) {
          const anchor = [0, 0];
          const geometry = dragBox.getGeometry().clone();
          geometry.translate(-world * worldWidth, 0);
          geometry.rotate(-rotation, anchor);
          const rotatedExtent = geometry.getExtent();
          
          boxFeatures.forEach(function (feature) {
            const featureGeometry = feature.getGeometry()?.clone();
            if (featureGeometry) {
              featureGeometry.rotate(-rotation, anchor);
              if (featureGeometry.intersectsExtent(rotatedExtent)) {
                select.getFeatures().push(feature);
              }
            }
          });
        } else {
          // Push to select features collection safely
          const selectedCollection = select.getFeatures();
          boxFeatures.forEach((feature) => {
            if (!selectedCollection.getArray().includes(feature)) {
              selectedCollection.push(feature);
            }
          });
        }
      }
    });

    return () => {
      map.removeInteraction(select);
      map.removeInteraction(dragBox);
    };
  }, [ctx?.activeTool, ctx?.map]);

  return null;
}