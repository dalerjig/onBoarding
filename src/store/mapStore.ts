import { create  } from 'zustand';
import { persist,subscribeWithSelector  } from 'zustand/middleware';

import { IMarker, IMapStore } from '../types/marker';

export const useMapStore = create(
  persist(
    subscribeWithSelector <IMapStore> (((set, get) => ({//!!!!
      markers: [], 
      center: [0, 0],
      zoom: 1,
      setMarker: (newMarker: IMarker) => set({
        markers: [...get().markers, newMarker] 
      }),

      setCenter: (newCenter: [number, number]) => set({
        center: newCenter
      }),
      setZoom: (newZoom: number) => set({
        zoom: newZoom
      }),
      
    })
  
  )),

    {
      name: 'map-storage', 
    },
  ),
);

