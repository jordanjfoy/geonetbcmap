import { Header } from './components/Header';
import RibbonTabs from "./components/ribbon/tabs/RibbonTabs";
import  OpenLayersMap from './components/map/OpenLayersMap';
import './index.scss';
import Sidebar from './components/sidebar/sidebar';
import { UIProvider } from './context/UIContext';


export default function App() {
  return (
    <>
      <Header />
      <UIProvider>
        <RibbonTabs />
        <div className="layout"> 
          <Sidebar />
          <main className="map-container">
            <OpenLayersMap />
          </main> 
        </div>
      </UIProvider>         
    </>
  );
}
