/* this is a maybe for now */ 
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import RegularShape from 'ol/style/RegularShape';
import { SYMBOLS } from '../../styles/styles'

const styleCache: Record<number, Style> = {};


export const createSymbol = (symbolId: number) => {
  const symbol = SYMBOLS.find(s => s.id === symbolId);

  if (!symbol) {
    // fallback style
    return new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#999' }),
      stroke: new Stroke({ color: '#000', width: 1 })
    });
  }

  const { color, shape, size } = symbol;

  switch (shape) {

    case 'diamond':
      return new RegularShape({
        points: 4,
        radius: size / 2,
        angle: Math.PI / 4,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 'triangle':
      return new RegularShape({
        points: 3,
        radius: size / 2,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000', width: 1 })
      });

    case 'cross':
      return new RegularShape({
        points: 4,
        radius: size / 2,
        angle: 0,
        stroke: new Stroke({ color, width: 2 })
      });

    default:
      return new CircleStyle({
        radius: size / 2,
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


/*
xport function createSymbol(symbol: { color: string; shape: string; size: number }) {
  switch (symbol.shape) {
    case 'circle':
      return new CircleStyle({
        radius: symbol.size / 2,
        fill: new Fill({ color: symbol.color }),
      });

    case 'square':
      return new RegularShape({
        points: 4,
        radius: symbol.size / 2,
        angle: Math.PI / 4,
        fill: new Fill({ color: symbol.color }),
      });

    case 'diamond':
      return new RegularShape({
        points: 4,
        radius: symbol.size / 2,
        angle: 0,
        fill: new Fill({ color: symbol.color }),
      });

    case 'triangle':
      return new RegularShape({
        points: 3,
        radius: symbol.size / 2,
        fill: new Fill({ color: symbol.color }),
      });

    case 'pentagon':
      return new RegularShape({
        points: 5,
        radius: symbol.size / 2,
        fill: new Fill({ color: symbol.color }),
      });

    case 'hexagon':
      return new RegularShape({
        points: 6,
        radius: symbol.size / 2,
        fill: new Fill({ color: symbol.color }),
      });

    case 'star':
      return new RegularShape({
        points: 5,
        radius: symbol.size / 2,
        radius2: symbol.size / 4,
        fill: new Fill({ color: symbol.color }),
      });

    default:
      return new CircleStyle({
        radius: symbol.size / 2,
        fill: new Fill({ color: symbol.color }),
      });
  }
}*/