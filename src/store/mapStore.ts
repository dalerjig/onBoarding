import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IMarker,IMapStore  } from '../types/marker';




export const useMapStore = create(
  persist<IMapStore>(
    (set, get) => ({

     
     map:{
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
      center: [0,0],
      zoom: 1,
    },






      markers: [], 
     
      
      setMarker: (newMarker:IMarker) => set({
        markers: [...get().markers, newMarker] 
      }),

      setCenter: (newCenter:[number,number]) => set({
        center: newCenter
      }),

      
      setZoom: (newZoom:number) => set({
        zoom: newZoom
      }),

      // setUniqueId: () => {
        
      //   return uniqueId(); 
      // }

    }),
    {
      name: 'map-storage', 
    },
  ),
);