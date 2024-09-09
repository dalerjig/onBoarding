import "./App.css";
import { MapProvider } from "./providers/map_provider";

function App() {
  return (
    <MapProvider>
      <div style={{ width: "100vw", height: "100vh" }} id="map" />
      <div></div>
    </MapProvider>
  );
}

export default App;
