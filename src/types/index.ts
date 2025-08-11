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
  bookmark: {
    _id: string;
    name: string;
    color: string;
  };
}

export interface IUpdateMarker {
  markerId: string;
  date: Date | undefined;
  content: string;
  bookmark: {
    _id: string;
    name: string;
    color: string;
  };
}

export interface IUserID {
  uid: string | undefined;
}
