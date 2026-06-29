/* this is a maybe for now */ 
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import RegularShape from 'ol/style/RegularShape';

const styleCache: Record<number, Style> = {};

function createSymbol(symbolId: number) {
  let color = '#999';

  switch (symbolId) {
    case 1: color = '#1f78b4'; break; // blue
    case 2: color = '#33a02c'; break; // green
    case 3: color = '#6a3d9a'; break; // purple
    case 4: color = '#ff7f00'; break; // orange
    case 5: color = '#00bcd4'; break; // cyan
    case 6: color = '#ffd700'; break; // yellow
    case 7: color = '#e31a1c'; break; // red
  }

  // Shape variations (optional but nice)
  switch (symbolId) {

    case 2: // provincial benchmark → diamond
      return new RegularShape({
        points: 4,
        radius: 7,
        angle: Math.PI / 4,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 3: // federal → triangle
      return new RegularShape({
        points: 3,
        radius: 7,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 7: // destroyed → X-like
      return new RegularShape({
        points: 4,
        radius: 8,
        angle: 0,
        stroke: new Stroke({ color: '#e31a1c', width: 2 })
      });

    default: // most = circle
      return new CircleStyle({
        radius: 5,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });
  }
};


export const styleFunction = (feature: any) => {
  const symbolId = feature.get('SYMBOL_TYPE');

  if (!styleCache[symbolId]) {
    styleCache[symbolId] = new Style({
      image: createSymbol(symbolId)
    });
  }

  return styleCache[symbolId];
};
