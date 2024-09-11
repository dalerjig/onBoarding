import { create } from 'zustand';
import { persist } from 'zustand/middleware';



export const useMapStore = create(
  persist(
    (set, get) => ({
      markers: [], 
      center:[0,0],
      zoom:1,
    
      addNewMarker: (newMarker) => set({
        markers: [...get().markers, newMarker] 
      }),

      setCenter: (newCenter) => set({
        center: newCenter
      }),

      
      setZoom: (newZoom) => set({
        zoom: newZoom
      }),

    }),
    {
      name: 'map-storage', 
    },
  ),
);