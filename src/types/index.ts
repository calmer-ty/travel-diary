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
  // bookmark: {
  //   bookmarkName: string;
  //   bookmarkColor: string | null;
  // };
}

export interface IUserID {
  uid: string | undefined;
}
