import { useMemo } from 'react';
import { Header } from '../layout/Header';
import RibbonTabs from '../features/ribbon/RibbonTabs';
import OpenLayersMap from '../features/maps/OpenLayersMap';
import '../styles/index.scss';
import Sidebar from '../layout/sidebar';
import { UIProvider } from '../context/UIContext';
import { MapProvider } from './providers/MapProvider';
import Legend from '../features/legend/Legend';
import { buildImageLayerSet } from '../features/layers/ImageLayerComponent';
import EraseCursor from '../features/drawing/EraseTooltip';
import MapContext from '../context/MapContext';
import { useContext } from 'react';

export default function App() {
  const { layerGroup, resolveLegendUrl } = useMemo(() => buildImageLayerSet(), []);
  const ctx = useContext(MapContext);

  return (
    <>
      <Header />
      <MapProvider>
        <UIProvider>
          <RibbonTabs />
          <div className="layout">
            <Sidebar />
            <main className="map-container">
              <OpenLayersMap imageLayerGroup={layerGroup}/>
              <EraseCursor active={ctx?.activeTool === 'erase'} />
            </main>
          </div>
          <Legend resolveLegendUrl={resolveLegendUrl} />
        </UIProvider>
      </MapProvider>
    </>
  );
}