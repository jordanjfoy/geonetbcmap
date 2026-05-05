import { Header } from './components/Header';
import RibbonTabs from "./components/ribbon/tabs/RibbonTabs";
import  OpenLayersMap from './components/map/OpenLayersMap';
import './index.scss';


export default function App() {
  return (
    <>
      <Header />
      <RibbonTabs />
      <main style={{ height: 'calc(100vh - 60px)' }}>
        <OpenLayersMap />
      </main>
    </>
  );
}
