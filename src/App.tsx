import { Header } from './components/Header';
import  OpenLayersMap from './components/map/OpenLayersMap';

export default function App() {
  return (
    <>
      <Header />
      <main style={{ height: 'calc(100vh - 60px)' }}>
        <OpenLayersMap />
      </main>
    </>
  );
}
