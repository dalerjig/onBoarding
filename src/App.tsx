import "./App.css";
import { MapProvider } from "./providers/map_provider/map_provider";

function App() {
  return (
    <MapProvider
      children={<div style={{ width: "100vw", height: "100vh" }} id="map" />}
    />
    // <MapProvider>
    //   <div style={{ width: "100vw", height: "100vh" }} id="map" />
    //   <div></div>
    // </MapProvider>
  );
}

export default App;
