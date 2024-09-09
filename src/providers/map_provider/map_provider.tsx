import { ReactNode, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type TMapProviderProps = { children: ReactNode };

interface IMarker {
  color?: string;
  lng: number;
  lat: number;
  className?: string;
  draggable: boolean;
  scale?: number;
}

export const MapProvider = ({ children }: TMapProviderProps) => {
  const [markers, setMarker] = useState<IMarker[]>([
    {
      color: "#FFFFFFAA",
      lng: 10,
      lat: 50,
      draggable: true,
    },
  ]);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map", // container id
      style: "https://demotiles.maplibre.org/style.json", // style URL
      //   style: "../../assets/openStreetMap.json",
      //   center: [0, 0], // starting position [lng, lat]
      //   zoom: 1, // starting zoom
      // }

      center: [0, 0], // начальная позиция [lng, lat]
      zoom: 1, // начальный зум
    });
    markers.forEach((mark) => {
      new maplibregl.Marker({
        color: mark.color,
        draggable: mark.draggable,
      })
        .setLngLat([mark.lng, mark.lat])
        .addTo(map);
    });
    map.on("click", (e) => {
      setMarker([
        ...markers,
        {
          color: "#FFFFFFAA",
          lng: e.lngLat.wrap().lng,
          lat: e.lngLat.wrap().lat,
          draggable: true,
        },
      ]);
      new maplibregl.Marker({
        color: "FFFFFFF",
        draggable: true,
      })
        .setLngLat([e.lngLat.wrap().lng, e.lngLat.wrap().lat])
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <>{children}</>;
};

const apiKey = "bdnDr4eItzUHU3M-rwPuZNFVjSSnHfiuzbXyLvEfAEA"; // Замените на ваш OSM API токен
const apiUrl = `https://api.openstreetmap.org/api/0.6/map?bbox=left,bottom,right,top&key=${apiKey}`;
async function fetchOSMData() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при выполнении запроса к OSM API");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

fetchOSMData();
