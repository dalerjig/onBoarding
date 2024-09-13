



export interface IMarker {
  id?: string|number;
  color?: string;
  lng: number;
  lat: number;
  className?: string;
  draggable: boolean;
  scale?: number;
}

export interface IMapStore {
  markers: IMarker[];
  center:[number,number],
  zoom:number,

  setUniqueId?:() => number | string;
  setMarker: (newMarker: IMarker) => void;
  setCenter: (newCenter: [number, number]) => void;
  setZoom: (newZoom: number) => void;// void-не имеет ретурна
  

}
