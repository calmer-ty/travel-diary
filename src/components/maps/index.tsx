import { useCallback, useRef, useState } from "react";
import { LoadScript, Marker, InfoWindow, GoogleMap, StandaloneSearchBox } from "@react-google-maps/api";
// import { AnimatePresence } from "framer-motion";
import ModalMaps from "./modal";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/commons/libraries/firebase/firebaseApp";
import { useAuth } from "@/commons/hooks/useAuth";

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
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]); // 마커 ( 생성했던 마커 )
  // const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLngLiteral | null>(null); // 선택된 마커
  const [mapCenter, setMapCenter] = useState(initialCenter); // 지도 중심을 위한 별도 state 추가
  const [address, setAddress] = useState<google.maps.places.PlaceResult>(); // 지도 중심을 위한 별도 state 추가

  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(initialCenter); // 선택한 위치 ( 오른쪽 클릭이든 왼쪽 클릭이든 사용자가 선택한 ) 상태 함수
  const [showModal, setShowModal] = useState(false); // 모달 상태 함수

  // 모달 입력 폼
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState("");
  console.log("user?.uid ", user?.uid);

  // 🔧 Ref 객체
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

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

  const handlePOIClick = (e: google.maps.MapMouseEvent) => {
    const placeId = (e as any).placeId as string | undefined;

    if (!e.latLng || !mapRef.current) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // 🔍 POI를 클릭한 경우 (placeId 존재)
    if (placeId) {
      e.stop(); // infoWindow 기본 동작 막기

      const service = new window.google.maps.places.PlacesService(mapRef.current);

      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setSelectedPosition({ lat, lng });

          setAddress(place);
          setShowModal(true);
          // alert(`이름: ${place.name}\n주소: ${place.formatted_address}`);
        } else {
          console.error("getDetails 실패:", status);
        }
      });
    }
  };

  // ✅ [확인] 위치 값을 저장하고, 데이터도 저장하는 기능 ( 아직 위치값만 저장 중 )
  const handleConfirm = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // 이벤트 기본동작 막기 (페이지 리로드 방지)

      // 🔒 uid 없을 경우 등록 막기
      if (!user?.uid) {
        alert("로그인이 필요합니다. 먼저 로그인해주세요.");
        return;
      }

      if (!address?.formatted_address) return;

      // firebase 등록하기 기능
      try {
        const travelData = collection(getFirestore(firebaseApp), "TravelData ");
        const travelDataResult = await addDoc(travelData, {
          uid: user?.uid,
          place: address.name,
          content,
          date,
          address: address.formatted_address,
        });

        console.log(travelDataResult);
      } catch (error) {
        if (error instanceof Error) alert(error.message);
      }

      if (selectedPosition) {
        setMarkers((prev) => [...prev, selectedPosition]);
        setMapCenter(selectedPosition);
      }
      setShowModal(false);
      setSelectedPosition(null);
    },
    [user?.uid, address, content, date, selectedPosition]
  );

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setSelectedPosition(null);
  }, [setShowModal, setSelectedPosition]);

  // 지도 로드 시 참조 저장
  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""} libraries={LIBRARIES}>
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13} options={mapOptions} onLoad={onLoadMap} onClick={handlePOIClick}>
        {/* 생성된 마커 */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            // onClick={() => setSelectedMarker(marker)}
            icon={{
              url: "/images/icon_marker.png",
              scaledSize: new window.google.maps.Size(40, 64),
              anchor: new window.google.maps.Point(20, 40),
            }}
          />
        ))}
        {/* 마커 정보창  */}
        {/* {selectedMarker && (
          <InfoWindow position={selectedMarker} onCloseClick={() => setSelectedMarker(null)}>
            <div>
              <h3>여기에 정보 넣기</h3>
              <p>위치 설명 또는 상세 주소</p>
            </div>
          </InfoWindow>
        )} */}
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
        {/* <AnimatePresence>{showModal && <Modal01 key="slide-modal" handleCancel={handleCancel} handleConfirm={handleConfirm} />}</AnimatePresence> */}
        {showModal && (
          <ModalMaps
            name={address?.name ?? "이름 없음"}
            address={address?.formatted_address ?? "주소 정보 없음"}
            date={date}
            setDate={setDate}
            content={content}
            setContent={setContent}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
          />
        )}
        {/* 모달 간단 구현 */}
      </GoogleMap>
    </LoadScript>
  );
}
