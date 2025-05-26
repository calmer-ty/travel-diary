import { useRef, useState } from "react";
import { LoadScript, Marker, InfoWindow, GoogleMap, StandaloneSearchBox } from "@react-google-maps/api";
import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "@/commons/libraries/firebase/firebaseApp";

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

  // 우클릭한 위치 저장 (기록할 위치)
  const [rightClickPos, setRightClickPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [showModal, setShowModal] = useState(false);
  console.log("우클릭 위치:", rightClickPos);

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

  // 우클릭 이벤트 핸들러
  const onMapRightClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setRightClickPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setShowModal(true); // 모달 띄우기
    }
  };

  const handleConfirm = () => {
    if (rightClickPos) {
      setMarkerPosition(rightClickPos);
      setSelectedMarker(rightClickPos);
    }
    setShowModal(false);
    setRightClickPos(null);
  };
  const handleCancel = () => {
    setShowModal(false);
    setRightClickPos(null);
  };

  // 지도 로드 시 참조 저장
  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // firestore
  // 등록
  const handleFormSubmit = async (data: ITravelLog) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        // userId,
        // itemType,
        // price: Number(data.price) * Number(currency),
        createdAt, // 테이블 생성 시간
      });
      // reset();
      // readData();
      console.log("문서 ID:", docRef.id); // Firestore에서 생성된 고유한 문서 ID
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 조회
  const [incomeItemArray, setIncomeItemArray] = useState<ITravelLog[]>([]);

  const readData = async () => {
    const q = query(
      collection(db, "income")
      // where("userId", "==", userId),
      // orderBy("createdAt", "desc") // createdAt 기준 내림차순 정렬
    );

    // 위에서 데이터를 정렬하고 조회
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id, // 문서의 ID
      ...doc.data(), // 문서의 데이터
    }));
    setIncomeItemArray(dataArray as ITravelLog[]);
  };

  // 삭제
  const handleFormDelete = async (selectionItem: string[]) => {
    // map / forEach를 쓰지 않는 이유는 비동기적으로 한번에 처리되면 순차적으로 삭제가 되지 않을 수도 있기 때문에 for로 함
    for (const id of selectionItem) {
      try {
        await deleteDoc(doc(db, "income", id));
        console.log(`ID ${id} 삭제 성공`);
        // readData();
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""} libraries={["places"]}>
      <GoogleMap mapContainerStyle={containerStyle} center={markerPosition} zoom={13} options={{ mapTypeControl: false }} onLoad={onLoadMap} onRightClick={onMapRightClick}>
        {/* 마커 */}
        <Marker position={markerPosition} onClick={() => setSelectedMarker(markerPosition)} />

        {/* 지도 정보창 */}
        {selectedMarker && (
          <InfoWindow position={selectedMarker} onCloseClick={() => setSelectedMarker(null)}>
            <div>
              <h3>여기에 정보 넣기</h3>
              <p>위치 설명 또는 상세 주소</p>
            </div>
          </InfoWindow>
        )}

        {/* 검색창 */}
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)} // 검색박스 레퍼런스 저장
          onPlacesChanged={handlePlacesChanged} // 검색 후 처리할 함수
        >
          <input
            type="text"
            placeholder="검색"
            className="box-border border border-transparent w-60 h-8 px-3 rounded shadow-md text-sm outline-none truncate absolute left-1/2 -ml-30 mt-2.5 z-10 bg-white"
          />
        </StandaloneSearchBox>

        {/* 모달 간단 구현 */}
        {showModal && (
          <form onSubmit={handleFormSubmit} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border p-4 rounded shadow-lg z-50">
            <h2 className="text-lg font-semibold mb-4">위치 기록 추가</h2>
            {/* <label className="block mb-2 text-sm">
              제목
              <input type="text" className="w-full border rounded px-2 py-1 mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="block mb-2 text-sm">
              메모
              <textarea className="w-full border rounded px-2 py-1 mt-1" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </label> */}
            <div className="mt-4 flex justify-end gap-2">
              <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded">
                저장
              </button>
              <button className="px-4 py-1 bg-gray-300 rounded" onClick={handleCancel}>
                취소
              </button>
            </div>
          </form>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
