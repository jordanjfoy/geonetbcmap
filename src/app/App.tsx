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

export default function App() {
  const { layerGroup, resolveLegendUrl } = useMemo(() => buildImageLayerSet(), []);

  return (
    <>
      <Header />
      <MapProvider>
        <UIProvider>
          <RibbonTabs />
          <div className="layout">
            <Sidebar />
            <main className="map-container">
              <OpenLayersMap />
            </main>
          </div>
          <Legend resolveLegendUrl={resolveLegendUrl} />
        </UIProvider>
      </MapProvider>
    </>
  );
}