import { ReactNode, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import osmtogeojson from "osmtogeojson";
import myJson from "../../assets/openStreetMap.json";
type TMapProviderProps = { children: ReactNode };
import { useMapStore } from "../../store/mapStore";
import { uniqueId } from "lodash";

//коорды в консоль падали(подписаться на изм зустанд)
// поменялись ли

export const MapProvider: React.FC<TMapProviderProps> = ({ children }) => {
  //{children}: TMapProviderProps
  const { setMarker, markers, center, zoom, setCenter, setZoom } =
    useMapStore();

  const [osmPolygonData, setOsmPolygonData] = useState(null);

  const addMarker = (e: maplibregl.MapMouseEvent) => {
    //const newId = Number(setUniqueId());
    const unique =
      e.lngLat.wrap().lng >= 0 ? e.lngLat.wrap().lng : e.lngLat.wrap().lng * -1;
    //console.log(unique);
    //либо меняем тип
    setMarker({
      id: String(uniqueId(`${unique}_`)),
      color: "#FFFFFFAA",
      lng: e.lngLat.wrap().lng,
      lat: e.lngLat.wrap().lat,
      draggable: true,
    });
    console.log(markers);
    new maplibregl.Marker({
      color: "FFFFFFF",
      draggable: true,
    })
      //lngtat wram-const
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

        setOsmPolygonData(geoJsonData); //тут!
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
      center: center,
      zoom: zoom,
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
        data: osmPolygonData!, // Данные полигона из OSM(не пусто!!)
      });

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
  }, [osmPolygonData]);

  const unsubscribeCenter = useMapStore.subscribe((state) => {
    console.log("Center changed:", state.center);
  });

  const unsubscribeZoom = useMapStore.subscribe((state) => {
    console.log("Zoom changed:", state.zoom);
  });
  useEffect(() => {
    return () => {
      unsubscribeCenter();
      unsubscribeZoom();
    };
  }, []);

  //при пустом массиве юэф 1 раз лишь срабатывает при монтировании

  return children;
};
