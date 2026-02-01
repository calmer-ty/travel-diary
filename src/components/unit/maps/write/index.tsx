import { useEffect, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { useAuth } from "@/contexts/authContext";
import { useAlert } from "@/hooks/useAlert";

import DatePicker from "@/components/commons/DatePicker";
import MotionAlert from "@/components/commons/MotionAlert";
import WriteBookmark from "./WriteBookmark";

// shadcn
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
import type { ILogPlace, IUpdateMarker } from "@/types";

interface IMapsDialogProps {
  isEdit: boolean;
  // 다이얼로그 창 스테이트
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  // 맵 데이터
  mapsAddress: google.maps.places.PlaceResult | undefined;
  selectedPosition: google.maps.LatLngLiteral | null;
  setSelectedPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
  setMapCenter: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  // 마커
  selectedMarker: ILogPlace | null;
  setMarkers: Dispatch<SetStateAction<ILogPlace[]>>;
  createMarker: (markerToSave: ILogPlace) => Promise<{ _id: string }>;
  updateMarker: ({ markerId, date, content, bookmark }: IUpdateMarker) => Promise<void>;
  fetchMarkers: () => Promise<void>;
}

export default function MapsWrite({
  isEdit,
  isOpen,
  mapsAddress,
  selectedPosition,
  selectedMarker,
  setIsOpen,
  setMapCenter,
  setSelectedPosition,
  setMarkers,
  createMarker,
  updateMarker,
  fetchMarkers,
}: IMapsDialogProps) {
  const { user } = useAuth();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string>("");

  // 알림창 등
  const { showAlert, alertValue, triggerAlert } = useAlert();

  // 현재 선택하는 북마크
  const [bookmark, setBookmark] = useState({
    name: "",
    color: "",
    _id: "",
  });

  // selectedMarker가 바뀔 때마다 폼 초기화
  useEffect(() => {
    if (isEdit && selectedMarker) {
      setDate(selectedMarker.date);
      setBookmark(selectedMarker.bookmark);
      setContent(selectedMarker.content);
    } else {
      setDate(undefined);
      setBookmark({ name: "", color: "", _id: "" });
      setContent("");
    }
  }, [isEdit, selectedMarker]);

  // [등록]
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 이벤트 기본동작 막기 (페이지 리로드 방지)

    // uid 없을 경우 등록 막기
    if (!user) {
      triggerAlert("기록을 저장하려면 로그인이 필요합니다.");
      return;
    }

    if (!mapsAddress?.name) {
      triggerAlert("주소명이 없습니다.");
      return;
    }

    if (!mapsAddress?.formatted_address) {
      triggerAlert("상세주소가 없습니다.");
      return;
    }

    if (!date) {
      triggerAlert("기록할 날짜를 선택해 주세요.");
      return;
    }

    if (!content) {
      triggerAlert("기록할 내용을 입력해 주세요.");
      return;
    }

    if (!selectedPosition) {
      triggerAlert("마커를 선택해주세요.");
      return;
    }

    // 저장할 마커 정보 준비
    const markerToSave: ILogPlace = {
      _id: "",
      name: mapsAddress?.name,
      address: mapsAddress?.formatted_address,
      latLng: selectedPosition,
      uid: user.uid,
      date,
      content,
      bookmark,
    };

    try {
      // 한 번만 호출하여 ID를 받아옵니다.
      const { _id } = await createMarker(markerToSave);
      const newMarker = { ...markerToSave, _id };

      // 상태 업데이트
      setMarkers((prev) => [...prev, newMarker]);

      // 등록 후 입력 폼 맵 센터, 다이얼로그, 포지션 초기화
      setMapCenter(selectedPosition);
      setSelectedPosition(null);

      setIsOpen(false);
      setDate(undefined);
      setContent("");
      setBookmark({ name: "", color: "", _id: "" });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }
    }
  };

  // [수정]
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 이벤트 기본동작 막기

    const markerId = selectedMarker?._id;
    if (!user) {
      triggerAlert("로그인이 필요합니다. 먼저 로그인해주세요!");
      return;
    }
    if (!markerId) {
      triggerAlert("마커 ID가 없습니다");
      return;
    }

    try {
      await updateMarker({
        markerId,
        date,
        content,
        bookmark,
      });

      // 폼 초기화
      setIsOpen(false);
      setDate(undefined);
      setContent("");
      setBookmark({ name: "", color: "", _id: "" });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // 삭제 함수
  const handleDelete = async (selectedMarkerId: string) => {
    try {
      await deleteDoc(doc(db, "travelData", selectedMarkerId));
      // console.log(`ID ${selectedMarkerId} 삭제 성공`);
      fetchMarkers();
      setIsOpen(false);
    } catch (error) {
      console.error(`ID ${selectedMarkerId} 삭제 실패`, error);
    }
    // }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:w-140 lg:w-180">
        <form onSubmit={isEdit ? handleUpdate : handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? (selectedMarker?.name ?? "이름 없음") : (mapsAddress?.name ?? "이름 없음")}</DialogTitle>
            <DialogDescription>{isEdit ? (selectedMarker?.name ?? "주소 정보 없음") : (mapsAddress?.formatted_address ?? "주소 정보 없음")}</DialogDescription>
          </DialogHeader>

          {/* 다이얼로그 */}
          <div className="grid gap-3 mt-4 ">
            <WriteBookmark selectedMarker={selectedMarker} bookmark={bookmark} setBookmark={setBookmark} />
            {/* 날짜 선택 */}
            <DatePicker date={date} setDate={setDate} />
            {/* 내용 작성 */}
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-full mb-4 bg-white placeholder-gray" placeholder="기록할 내용을 적어보세요." />
            {/* 버튼 */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="close">닫기</Button>
              </DialogClose>
              <Button
                variant="remove"
                type="button"
                onClick={() => {
                  handleDelete(selectedMarker?._id ?? "");
                }}
              >
                삭제
              </Button>
              <Button variant="submit" type="submit">
                {isEdit ? "수정" : "등록"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>

      {/* 경고창 */}

      {showAlert && <MotionAlert alertValue={alertValue} />}
    </Dialog>
  );
}
