import { useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';

import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { getWidth } from 'ol/extent.js';
import DragBox from 'ol/interaction/DragBox.js';
import Select from 'ol/interaction/Select.js';
import { vectorSource } from '../../layers/VectorLayersComponent'; // adjust path to match your actual file location

//Import Styling from ol
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';

import { vectorLayer } from '../../layers/VectorLayersComponent';

export default function SelectBoxInteraction() {
  const ctx = useContext(MapContext);
  const selectedStyle: any = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
        }),
    });

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'select' || !ctx.map) return;

    const map = ctx.map; // narrow once so TS knows it's non-null inside closures below

    if (!vectorSource) return; // vector layer hasn't been created/added to the map yet
    const source = vectorSource;

    // a normal select interaction to handle click
    const select = new Select({
    style: function (feature) {
        const color = feature.get('COLOR_BIO') || '#eeeeee';
        selectedStyle.getFill().setColor(color);
        return selectedStyle;
    },
    });
    map.addInteraction(select);

    // a DragBox interaction used to select features by drawing boxes
    const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
    });

    //Adds the draw box interaction to the map 
    map.addInteraction(dragBox);

    // Clear the previous selection at the start of each new drag
    dragBox.on('boxstart', function () {
      select.getFeatures().clear();
    });

    //Function for the drag box that actually captures features 
    dragBox.on('boxend', function () {
        const boxExtent = dragBox.getGeometry().getExtent();

        // if the extent crosses the antimeridian process each world separately
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
            .filter((feature) => feature.getGeometry()!.intersectsExtent(extent));

            // features that intersect the box geometry are added to the
            // collection of selected features

            // if the view is not obliquely rotated the box geometry and
            // its extent are equalivalent so intersecting features can
            // be added directly to the collection
            const rotation = map.getView().getRotation();
            const oblique = rotation % (Math.PI / 2) !== 0;

            // when the view is obliquely rotated the box extent will
            // exceed its geometry so both the box and the candidate
            // feature geometries are rotated around a common anchor
            // to confirm that, with the box geometry aligned with its
            // extent, the geometries intersect
            if (oblique) {
            const anchor = [0, 0];
            const geometry = dragBox.getGeometry().clone();
            geometry.translate(-world * worldWidth, 0);
            geometry.rotate(-rotation, anchor);
            const rotatedExtent = geometry.getExtent();
            boxFeatures.forEach(function (feature: any) {
                const featureGeometry = feature.getGeometry().clone();
                featureGeometry.rotate(-rotation, anchor);
                if (featureGeometry.intersectsExtent(rotatedExtent)) {
                select.getFeatures().push(feature);
                }
            });
            } else {
            boxFeatures.forEach((feature) => select.getFeatures().push(feature));
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