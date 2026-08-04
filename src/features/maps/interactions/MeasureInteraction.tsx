
import {unByKey} from 'ol/Observable.js';
import Overlay from 'ol/Overlay.js';
import LineString from 'ol/geom/LineString.js';
import Polygon from 'ol/geom/Polygon.js';
import {getArea, getLength} from 'ol/sphere.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import { Context, useContext, useEffect } from 'react';
import MapContext from '../../../context/MapContext';
import { Draw } from 'ol/interaction';
import { getOrCreateDrawLayer } from './mapLayers';
import { Feature, MapBrowserEvent } from 'ol';
import { FeatureLike } from 'ol/Feature';
import type { Coordinate } from 'ol/coordinate';
import type { EventsKey } from 'ol/events';


let sketch: Feature | null = null; 
let helpToolTipElement!: HTMLElement;
let helpToolTip!:Overlay;
let measureToolTipElement: HTMLElement | null = null;
let measureToolTip:Overlay;

let continuePolygonMsg = 'Click to continue drawing the polygon';
let continueLineMsg = 'Click to continue drawing the line';

const pointerMoveHandler = function (evt: MapBrowserEvent) {
  if (evt.dragging) {
    return;
  }

  let helpMsg = 'Click to start drawing';

  if (sketch) {
    const geom = sketch.getGeometry();
    if (geom instanceof Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpToolTipElement.innerHTML = helpMsg;
  helpToolTip.setPosition(evt.coordinate);

  helpToolTipElement.classList.remove('hidden');
};


let draw;

//
// @param {LineString} line The line.
// @return {string} The formatted length.
//

//consts for calculation of values :D 
const formatLength = function (line: LineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return output;
};

// 
// Format area output.
// @param {Polygon} polygon The polygon.
// @return {string} Formatted area.
//  
const formatArea = function (polygon: Polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return output;
};

///Style for created shapes! 
const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

///part we need to export! 

export default function MeasureInteraction() {
  const ctx = useContext(MapContext);

  useEffect(() => {
    if (!ctx || ctx.activeTool !== 'measure' || !ctx.MeasureType || !ctx.map) return;

    const source = getOrCreateDrawLayer(ctx.map);
     const type = ctx.MeasureType.toLowerCase().startsWith('area') ? 'Polygon' : 'LineString';

    const draw = new Draw({
      source,
      type: type,
        style: function (feature: FeatureLike) {
        const geometry = feature.getGeometry();
        if (!geometry) {
            return; // or return undefined, or some fallback style
        }
        const geometryType = geometry.getType();
        if (geometryType === type || geometryType === 'Point') {
            return style;
            }
        }
    });

    ctx.map.addInteraction(draw);

    //these functions are created below! 
    //in typescript function declarations are hoisted, so we can call them before they are defined
    createMeasureTooltip();
    createHelpTooltip();

    //we want the listner to be an EventsKey BECAUSE 
    let listener: EventsKey;
        draw.on('drawstart', function (evt) {
            // set sketch
            sketch = evt.feature;

            let tooltipCoord: Coordinate | undefined;

            const geometry = sketch.getGeometry();
            if (!geometry) {
                return
            }
            
            listener = geometry.on('change', function (evt) {
            const geom = evt.target;
            let output: string = '';
            if (geom instanceof Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            if (measureToolTipElement) {
                measureToolTipElement.innerHTML = output;
            }
            measureToolTip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', function () {
            if (measureToolTipElement) {
                measureToolTipElement.className = 'ol-tooltip ol-tooltip-static';
            }
            measureToolTip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureToolTipElement = null;
            createMeasureTooltip();
            unByKey(listener);
        });

    function createHelpTooltip() {
        if (helpToolTipElement) {
            helpToolTipElement.remove();
        }
        helpToolTipElement = document.createElement('div');
        helpToolTipElement.className = 'ol-tooltip hidden';
        helpToolTip = new Overlay({
            element: helpToolTipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        ctx?.map?.addOverlay(helpToolTip);
        }

        /**
         * Creates a new measure tooltip
         */
        function createMeasureTooltip() {
        if (measureToolTipElement) {
            measureToolTipElement.remove();
        }
        measureToolTipElement = document.createElement('div');
        measureToolTipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureToolTip = new Overlay({
            element: measureToolTipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        ctx?.map?.addOverlay(measureToolTip);
        }



    return () => {
      if (ctx.map) ctx.map.removeInteraction(draw);
    };
  }, [ctx?.activeTool, ctx?.MeasureType, ctx?.map]);

  return null;
}




// function addInteraction() {
//   const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
//   draw = new Draw({
//     source: source,
//     type: type,
//     style: function (feature) {
//       const geometryType = feature.getGeometry().getType();
//       if (geometryType === type || geometryType === 'Point') {
//         return style;
//       }
//     },
//   });
//   map.addInteraction(draw);

//   createMeasureTooltip();
//   createHelpTooltip();

//   let listener;
//   draw.on('drawstart', function (evt) {
//     // set sketch
//     sketch = evt.feature;

//     let tooltipCoord;

//     listener = sketch.getGeometry().on('change', function (evt) {
//       const geom = evt.target;
//       let output;
//       if (geom instanceof Polygon) {
//         output = formatArea(geom);
//         tooltipCoord = geom.getInteriorPoint().getCoordinates();
//       } else if (geom instanceof LineString) {
//         output = formatLength(geom);
//         tooltipCoord = geom.getLastCoordinate();
//       }
//       measureTooltipElement.innerHTML = output;
//       measureTooltip.setPosition(tooltipCoord);
//     });
//   });

//   draw.on('drawend', function () {
//     measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//     measureTooltip.setOffset([0, -7]);
//     // unset sketch
//     sketch = null;
//     // unset tooltip so that a new one can be created
//     measureTooltipElement = null;
//     createMeasureTooltip();
//     unByKey(listener);
//   });
// }

// /**
//  * Creates a new help tooltip
//  */
// function createHelpTooltip() {
//   if (helpTooltipElement) {
//     helpTooltipElement.remove();
//   }
//   helpTooltipElement = document.createElement('div');
//   helpTooltipElement.className = 'ol-tooltip hidden';
//   helpTooltip = new Overlay({
//     element: helpTooltipElement,
//     offset: [15, 0],
//     positioning: 'center-left',
//   });
//   map.addOverlay(helpTooltip);
// }

// /**
//  * Creates a new measure tooltip
//  */
// function createMeasureTooltip() {
//   if (measureTooltipElement) {
//     measureTooltipElement.remove();
//   }
//   measureTooltipElement = document.createElement('div');
//   measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//   measureTooltip = new Overlay({
//     element: measureTooltipElement,
//     offset: [0, -15],
//     positioning: 'bottom-center',
//     stopEvent: false,
//     insertFirst: false,
//   });
//   map.addOverlay(measureTooltip);
// }

// /**
//  * Let user change the geometry type.
//  */
// typeSelect.onchange = function () {
//   map.removeInteraction(draw);
//   addInteraction();
// };

// addInteraction();