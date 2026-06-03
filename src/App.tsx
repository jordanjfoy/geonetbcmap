import { Header } from './components/Header';
import RibbonTabs from "./components/ribbon/tabs/RibbonTabs";
import  OpenLayersMap from './components/map/OpenLayersMap';
import './index.scss';
import Sidebar from './components/sidebar/sidebar';
import { UIProvider } from './context/UIContext';
import { MapProvider } from './context/MapProvider';


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
    </>
  );
}
