import { useContext } from 'react';
import { Header } from '../layout/Header';
import RibbonTabs from '../features/ribbon/RibbonTabs';
import OpenLayersMap from '../features/maps/OpenLayersMap';
import '../styles/index.scss';
import Sidebar from '../layout/sidebar';
import { UIProvider } from '../context/UIContext';
import { MapProvider } from './providers/MapProvider';
import Legend from '../features/legend/Legend';
import { buildImageLayerSet, type LegendEntry } from '../features/layers/ImageLayerComponent';
import GoToPoint from '../features/gotopoint/GoToPoint';
import LayerGroup from 'ol/layer/Group';
import MapContext from '../context/MapContext';

export default function App() {
  const ctx = useContext(MapContext);

  // 1. Get existing layer group from Context, or fallback to builder
  const layerGroup: LayerGroup =
    ctx?.imageLayersRef?.current ?? buildImageLayerSet().layerGroup;

  // 2. Retrieve the resolver function attached to the LayerGroup
  const getLegendEntries = (resolution?: number): LegendEntry[] => {
    const resolver = layerGroup.get('resolveLegendUrl') as
      | ((res?: number) => LegendEntry[])
      | undefined;
    return resolver ? resolver(resolution) : [];
  };

  return (
    <>
      <Header />
      <MapProvider>
        <UIProvider>
          <RibbonTabs />
          <div className="layout">
            <Sidebar />
            <main className="map-container">
              <GoToPoint />
              <OpenLayersMap imageLayerGroup={layerGroup} />
            </main>
          </div>
          
          {/* Pass getLegendEntries here */}
          <Legend resolveLegendUrl={getLegendEntries} />
        </UIProvider>
      </MapProvider>
    </>
  );
}