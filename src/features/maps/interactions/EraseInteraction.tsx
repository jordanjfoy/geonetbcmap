import { useContext, useEffect, useRef } from 'react';
import MapContext from '../../../context/MapContext';
import { getOrCreateDrawLayer } from './mapLayers';
import Feature from 'ol/Feature';

export default function EraseInteraction() {
  const ctx = useContext(MapContext);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ctx?.map || ctx.activeTool !== 'erase') return;

    const mapTarget = ctx.map.getTargetElement();
    const source = getOrCreateDrawLayer(ctx.map);

    // Hide standard cursor
    if (mapTarget) {
      mapTarget.style.cursor = 'none';
    }

    // Track mouse movement to move the red div
    const handlePointerMove = (event: any) => {
      if (!cursorRef.current) return;
      const [x, y] = event.pixel;
      cursorRef.current.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0)`;
      cursorRef.current.style.display = 'block';
    };

    const handlePointerLeave = () => {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
    };

    const handleClick = (event: any) => {
      const feature = ctx.map?.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature) {
        source.removeFeature(feature as Feature);
      }
    };

    ctx.map.on('pointermove', handlePointerMove);
    ctx.map.on('click', handleClick);
    mapTarget?.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      ctx.map?.un('pointermove', handlePointerMove);
      ctx.map?.un('click', handleClick);
      mapTarget?.removeEventListener('mouseleave', handlePointerLeave);

      if (mapTarget) {
        mapTarget.style.cursor = '';
      }
    };
  }, [ctx?.map, ctx?.activeTool]);

  if (ctx?.activeTool !== 'erase') return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '16px',
        height: '16px',
        backgroundColor: 'red',
        border: '1px solid white',
        pointerEvents: 'none', // Critical so clicks pass straight through to OpenLayers
        zIndex: 1000,
        display: 'none',
      }}
    />
  );
}