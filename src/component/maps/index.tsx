import { LoadScript, Marker, InfoWindow, GoogleMap, StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const initialCenter = {
  lat: 40.749933,
  lng: -73.98633,
};

export default function Maps() {
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialCenter);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // 검색 결과 받아서 마커 이동
  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const location = places[0].geometry?.location;

    if (!location) return;
    setMarkerPosition({
      lat: location.lat(),
      lng: location.lng(),
    });

    if (mapRef.current && location) {
      mapRef.current.panTo(location);
    }
  };

  // 지도 로드 시 참조 저장
  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""} libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={markerPosition} zoom={13} options={{ mapTypeControl: false }} onLoad={onLoadMap}>
        {/* <Marker position={center} onClick={() => setSelectedMarker(center)} /> */}
        <Marker position={markerPosition} onClick={() => setSelectedMarker(markerPosition)} />

        {selectedMarker && (
          <InfoWindow position={selectedMarker} onCloseClick={() => setSelectedMarker(null)}>
            <div>
              <h3>여기에 정보 넣기</h3>
              <p>위치 설명 또는 상세 주소</p>
            </div>
          </InfoWindow>
        )}

        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)} // 검색박스 레퍼런스 저장
          onPlacesChanged={handlePlacesChanged} // 검색 후 처리할 함수
        >
          <input type="text" placeholder="검색" className="box-border border border-transparent w-60 h-8 px-3 rounded shadow-md text-sm outline-none truncate absolute left-1/2 -ml-30 mt-2.5 z-10 bg-white" />
        </StandaloneSearchBox>
      </GoogleMap>
    </LoadScript>
  );
}
