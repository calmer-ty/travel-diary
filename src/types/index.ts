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

export interface ITravelWaringItem {
  id: number; // 인덱스
  continent: string; // 대륙 **
  country_name: string; // 국가명 **
  country_en_name: string; // 영문 국가명 **
  img_url: string; // 국기 이미지 경로 **
  img_url_2: string; // 여행위험지도 경로
  wrt_dt: string; // 등록일 **

  attention: string; // 여행유의
  attention_partial: string; // 여행유의(일부)
  attention_note: string; // 여행유의 내용 **

  control: string; // 여행자제
  control_partial: string; // 여행자제(일부)
  control_note: string; // 여행자제 내용 **

  limita: string; // 철수권고
  limita_partial: string; // 철수권고(일부)
  limita_note: string; // 철수권고 내용 **

  ban_note: string; // 여행금지 **
  ban_yn_partial: string; // 여행금지(일부)
  ban_yna: string; // 여행금지 내용 **
  iso_code: string; // ISO 국가코드
}
