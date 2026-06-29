/* this is a maybe for now */ 
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import RegularShape from 'ol/style/RegularShape';
import { SYMBOLS } from '.././styles/styles'

const styleCache: Record<number, Style> = {};


function createSymbol(symbolId: number) {
  const symbol = SYMBOLS.find(s => s.id === symbolId);

  if (!symbol) {
    // fallback style
    return new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#999' }),
      stroke: new Stroke({ color: '#000', width: 1 })
    });
  }

  const { color, shape } = symbol;

  switch (shape) {

    case 'diamond':
      return new RegularShape({
        points: 4,
        radius: 7,
        angle: Math.PI / 4,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 'triangle':
      return new RegularShape({
        points: 3,
        radius: 7,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 'cross':
      return new RegularShape({
        points: 4,
        radius: 8,
        angle: 0,
        stroke: new Stroke({ color, width: 2 })
      });

    default:
      return new CircleStyle({
        radius: 5,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });
  }
}



export const styleFunction = (feature: any) => {
  const symbolId = feature.get('SYMBOL_TYPE');

  if (!styleCache[symbolId]) {
    styleCache[symbolId] = new Style({
      image: createSymbol(symbolId)
    });
  }

  return styleCache[symbolId];
};
