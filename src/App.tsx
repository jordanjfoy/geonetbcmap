import { Header } from './components/Header';
import RibbonTabs from "./components/ribbon/tabs/RibbonTabs";
import  OpenLayersMap from './components/map/OpenLayersMap';
import './index.scss';
import Sidebar from './components/sidebar/sidebar';


export default function App() {
  return (
    <>
      <Header />
      <RibbonTabs />
      <div className="layout">  
          <Sidebar />
          <main className="map-container">
            <OpenLayersMap />
          </main>
      </div>     
    </>
  );
}
