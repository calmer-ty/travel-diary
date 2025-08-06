import { useRef, useState } from "react";
import { Marker, GoogleMap, StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { useUserMarkers } from "@/hooks/useUserMarkers";
import { useDialog } from "@/hooks/useDialog";

import MapsWrite from "./write";
import AlertMaps from "./alert";

import type { ILogPlace } from "@/types";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const initialCenter = {
  lat: 40.749933,
  lng: -73.98633,
};
const mapOptions = {
  mapTypeControl: false,
  styles: [
    // {
    //   featureType: "poi",
    //   elementType: "labels",
    //   stylers: [{ visibility: "off" }],
    // },
  ],
};

const LIBRARIES: "places"[] = ["places"];

export default function Maps() {
  const { uid } = useAuth();
  // 🔧Edit 상태
  const [isEdit, setIsEdit] = useState(false); // 지도 중심을 위한 별도 state 추가
  // 🗺️ 지도 관련 상태
  const [mapCenter, setMapCenter] = useState(initialCenter); // 지도 중심을 위한 별도 state 추가
  const [mapsAddress, setMapsAddress] = useState<google.maps.places.PlaceResult>(); // 지도 중심을 위한 별도 state 추가
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(initialCenter); // POI 클릭시 위치 값
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null); // 지도의 현재 보이는 영역 정보
  // 북동쪽(NorthEast) 좌표 (오른쪽 위 끝점)
  // 남서쪽(SouthWest) 좌표 (왼쪽 아래 끝점)
  // 을 포함해서 사각형 범위를 나타내는 객체
  const mapRef = useRef<google.maps.Map | null>(null);

  // 🔍 검색 관련
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // 📌 마커 관련
  const [selectedMarker, setSelectedMarker] = useState<ILogPlace | null>(null);
  const { markers, createMarker, updateMarker, fetchMarkers } = useUserMarkers({ uid });

  // 🖊️ 폼 관련
  const { isOpen, setIsOpen } = useDialog();

  // ⚠️ 알림창 등
  const { showAlert, alertValue, triggerAlert } = useAlert();

  // 지도 bounds 변경 시 호출
  const handleBoundsChanged = () => {
    if (mapRef.current) {
      setBounds(mapRef.current.getBounds() ?? null);
    }
  };

  // 🔍 [검색 박스] 장소 검색 후 위치 이동 // 기존에 구글에서 제공한 코드
  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const location = places[0].geometry?.location;

    if (!location) return;
    setSelectedPosition({
      lat: location.lat(),
      lng: location.lng(),
    });

    if (mapRef.current && location) {
      mapRef.current.panTo(location);
    }
  };

  // POI 클릭 시
  const onClickPOI = (e: google.maps.MapMouseEvent) => {
    const placeId = (e as google.maps.IconMouseEvent).placeId;

    if (!e.latLng || !mapRef.current) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // 🔍 POI를 클릭한 경우 (placeId 존재)
    if (placeId) {
      e.stop(); // infoWindow 기본 동작 막기

      // 🔒 uid 없을 경우 등록 막기
      if (!uid) {
        triggerAlert("기록을 저장하려면 로그인이 필요합니다.");
        return;
      }

      // 모달 창 데이터 초기화
      setIsEdit(false);
      setIsOpen(true);
      setSelectedPosition({ lat, lng });
      setSelectedMarker(null); // POI를 누를 때 기존에 마커 데이터가 그대로 남았기 때문에 초기화 시켜야함

      const service = new window.google.maps.places.PlacesService(mapRef.current);
      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setMapsAddress(place);
          // alert(`이름: ${place.name}\n주소: ${place.formatted_address}`);
        } else {
          console.error("getDetails 실패:", status);
        }
      });
    }
  };

  // 마커 클릭
  const onClickMarker = (marker: ILogPlace) => {
    setIsOpen(true);
    setIsEdit(true);
    setSelectedMarker(marker);
  };

  // Google API Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  // 지도 로드 시 참조 저장
  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13} options={mapOptions} onLoad={onLoadMap} onClick={onClickPOI} onBoundsChanged={handleBoundsChanged}>
      {/* 생성된 마커 */}
      {markers
        .filter((marker) => {
          if (!bounds) return true; // bounds 없으면 모두 렌더링 (초기값)
          const position = new window.google.maps.LatLng(marker.latLng.lat, marker.latLng.lng);
          return bounds.contains(position); // ✅ bounds 안에 있는 마커만!
        })
        .map((marker) => (
          <Marker
            key={marker._id}
            position={marker.latLng}
            onClick={() => onClickMarker(marker)} // 마커 데이터 전달
            icon={{
              url: "/images/icon_marker.png",
              scaledSize: new window.google.maps.Size(40, 64),
              anchor: new window.google.maps.Point(20, 74),
            }}
          />
        ))}

      {/* 검색창 */}
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)} // 검색박스 레퍼런스 저장
        onPlacesChanged={handlePlacesChanged} // 검색 후 처리할 함수
      >
        <input
          type="text"
          placeholder="검색"
          className="box-border border border-transparent w-60 h-8 px-3 rounded shadow-md text-sm outline-none truncate absolute left-1/2 -ml-30 mt-20.5 z-10 bg-white"
        />
      </StandaloneSearchBox>

      {/* 모달 */}
      <MapsWrite
        isEdit={isEdit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // 맵
        mapsAddress={mapsAddress}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        setMapCenter={setMapCenter}
        // 마커
        selectedMarker={selectedMarker}
        createMarker={createMarker}
        updateMarker={updateMarker}
        fetchMarkers={fetchMarkers}
      />

      {/* 경고창 */}
      {showAlert && <AlertMaps alertValue={alertValue} />}
    </GoogleMap>
  );
}
