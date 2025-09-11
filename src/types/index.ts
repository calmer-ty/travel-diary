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
  bookmark: IBookmark;
}

export interface IBookmark {
  _id: string;
  name: string;
  color: string;
}
export interface INewBookmark {
  name: string;
  color: string;
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

export interface ICreateMarkerParams {
  markerToSave: ILogPlace;
}

export interface IUserID {
  uid: string | undefined;
}
