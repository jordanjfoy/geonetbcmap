import { Header } from '../layout/Header';
import RibbonTabs from "./components/ribbon/tabs/RibbonTabs"; /*revist this!! */
import  OpenLayersMap from '../features/maps/OpenLayersMap';
import '../styles/index.scss';
import Sidebar from '../layout/sidebar';
import { UIProvider } from '../context/UIContext';
import { MapProvider } from './providers/MapProvider';
import Legend from '../features/legend/Legend';


export default function App() {
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
        </UIProvider>
      </MapProvider>
      <Legend />       
    </>
  );
}
