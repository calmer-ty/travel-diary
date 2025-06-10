export interface ILogPlace {
  _id: string;
  uid: string;
  name: string;
  address: string;
  content: string;
  date: Date;
  latLng: {
    lat: number;
    lng: number;
  };
}
export interface IModalMaps {
  _id: string;
  date: Date;
  content: string;
}
