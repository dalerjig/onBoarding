import { ReactNode, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import osmtogeojson from "osmtogeojson";
import { useMapStore } from "../../store/mapStore";

type TMapProviderProps = { children: ReactNode };

interface IMarker {
  id: number;
  color?: string;
  lng: number;
  lat: number;
  className?: string;
  draggable: boolean;
  scale?: number;
}

export const MapProvider = ({ children }: TMapProviderProps) => {
  const { center, zoom, setCenter, setZoom } = useMapStore();

  const [markers, setMarker] = useState<IMarker[]>([
    {
      id: 0,
      color: "#FFFFFFAA",
      lng: 0,
      lat: 0,
      draggable: true,
    },
  ]);

  const [osmPolygonData, setOsmPolygonData] = useState(null);

  const addMarker = (e: maplibregl.MapMouseEvent & Object) => {
    setMarker([
      ...markers,
      {
        id: markers[markers.length - 1].id + 1,
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
      .addTo(e.target);
  };

  useEffect(() => {
    const overpassUrl =
      "https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9C%D0%BF%D0%BE%D0%BB%D0%B8%D0%B3%D0%BE%D0%BD%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20way%5B%22area%22%3D%22yes%22%5D%2861.27137950843908%2C73.39161553088094%2C61.27380317643637%2C73.39973189535999%29%3B%0A%20%20relation%5B%22area%22%3D%22yes%22%5D%2861.27137950843908%2C73.39161553088094%2C61.27380317643637%2C73.39973189535999%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20geom%3B";
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        //setOsmPolygonData(data); // Преобразуем данные OSM в формат GeoJSON
        const geoJsonData = osmtogeojson(data); // Преобразуем данные OSM в формат GeoJSON
        setOsmPolygonData(geoJsonData);
        console.log(geoJsonData);
      });
  }, []);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map", // container id
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center,
      zoom,
    });

    map.on("moveend", () => {
      const newCenter = map.getCenter().toArray(); // Получаем новый центр
      setCenter(newCenter); // Обновляем в store
    });

    map.on("zoomend", () => {
      const newZoom = map.getZoom(); // Получаем новый уровень зума
      setZoom(newZoom); // Обновляем в store
    });

    map.on("load", () => {
      // Добавление слоя с полигоном
      map.addSource("osm-polygon-source", {
        type: "geojson",
        data: osmPolygonData, // Данные полигона из OSM
      });

      // map.on("moveeon", () => {
      //   setZoom(zoom);
      // }); // хзззззз бляяяя

      map.addLayer({
        id: "osm-polygon-layer",
        type: "fill",
        source: "osm-polygon-source",
        paint: {
          "fill-color": "yellow", // Цвет полигона
          "fill-opacity": 0.5, // Прозрачность полигона
        },
      });

      map.addLayer({
        id: "osm-polygon-outline",
        type: "line",
        source: "osm-polygon-source",
        paint: {
          "line-color": "#000", // Цвет границы полигона
          "line-width": 2,
          "line-dasharray": [2, 2], // Пунктирная линия (2px линия, 2px пробел)
        },
      });
    });

    markers.forEach((mark) => {
      new maplibregl.Marker({
        color: mark.color,
        draggable: mark.draggable,
      })
        .setLngLat([mark.lng, mark.lat])
        .addTo(map);
    });
    map.on("click", addMarker);

    return () => {
      map.remove();
    };
  }, []);

  return <>{children}</>;
};

// const apiKey = "bdnDr4eItzUHU3M-rwPuZNFVjSSnHfiuzbXyLvEfAEA";
// const apiUrl = `https://api.openstreetmap.org/api/0.6/map?bbox=left,bottom,right,top&key=${apiKey}`;

// async function fetchOSMData() {
//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Ошибка при выполнении запроса к OSM API");
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Ошибка:", error);
//   }
// }

// fetchOSMData();
