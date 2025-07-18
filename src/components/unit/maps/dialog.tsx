import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";

import DatePicker01 from "@/components/commons/datePicker/01";
import AlertMaps from "./alert";

// shadcn
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ILogPlace } from "@/types";
import { useUserMarkers } from "@/hooks/useUserMarkers";

// interface IMarkerDataProps {
//   setMarkId: React.Dispatch<React.SetStateAction<string>>;
//   _id: string;
//   name: string;
//   address: string;
//   date: Date | undefined;
//   setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
//   content: string;
//   setContent: React.Dispatch<React.SetStateAction<string>>;
//   bookmark: {
//     bookmarkName: string;
//     bookmarkColor: string;
//   };
// }

interface IMapsDialogProps {
  isEdit: boolean;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  // markerData: IMarkerDataProps;

  selectedMarker: ILogPlace | null;
  mapsAddress: google.maps.places.PlaceResult | undefined;
  selectedPosition: google.maps.LatLngLiteral | null;
  setSelectedPosition: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>;
  setMapCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

export default function MapsDialog({ isEdit, showDialog, setShowDialog, mapsAddress, selectedPosition, setSelectedPosition, setMapCenter, selectedMarker }: IMapsDialogProps) {
  // 유저 ID
  const { uid } = useAuth();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string>("");

  // ⚠️ 알림창 등
  const { showAlert, alertValue, triggerAlert } = useAlert();
  const { createMarker, updateMarker } = useUserMarkers({ uid });

  // ✅ [등록]
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 이벤트 기본동작 막기 (페이지 리로드 방지)

    // 🔒 uid 없을 경우 등록 막기
    if (!uid) {
      triggerAlert("로그인이 필요합니다. 먼저 로그인해주세요!");
      return;
    }

    if (!mapsAddress?.name) {
      triggerAlert("주소명이 없습니다!");
      return;
    }

    if (!mapsAddress?.formatted_address) {
      triggerAlert("상세주소가 없습니다!");
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
      triggerAlert("마커를 선택해주세요!");
      return;
    }

    // 저장할 마커 정보 준비
    const markerData: ILogPlace = {
      _id: "",
      name: mapsAddress?.name,
      address: mapsAddress?.formatted_address,
      latLng: selectedPosition,
      uid,
      date,
      content,
    };

    try {
      await createMarker(markerData);
      // 등록 후 입력 폼 맵 센터, 다이얼로그, 포지션 초기화
      setShowDialog(false);

      setMapCenter(selectedPosition);
      setSelectedPosition(null);

      setDate(undefined);
      setContent("");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }
    }
  };

  // ✅ [수정]
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 이벤트 기본동작 막기 (페이지 리로드 방지)

    const markerId = selectedMarker?._id;
    if (!uid) {
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
      });
      // 수정 후 폼/다이얼로그 초기화
      setShowDialog(false);
      setDate(undefined);
      setContent("");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }
    }
  };

  // Dialog 닫기
  const onClickCancel = () => {
    setDate(undefined);
    setContent("");
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:w-140 lg:w-180 bg-[#F9F9F9]">
        <form onSubmit={isEdit ? handleUpdate : handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? selectedMarker?.name ?? "이름 없음" : mapsAddress?.name ?? "이름 없음"}</DialogTitle>
            <DialogDescription>{isEdit ? selectedMarker?.name ?? "주소 정보 없음" : mapsAddress?.formatted_address ?? "주소 정보 없음"}</DialogDescription>
          </DialogHeader>

          {/* 다이얼로그 */}
          <div className="grid gap-3 mt-4">
            {/* 날짜 선택 */}
            <DatePicker01 date={date} setDate={setDate} className="" />
            {/* 내용 작성 */}
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-full mb-4 bg-white placeholder-gray" placeholder="기록할 내용을 적어보세요." />
            {/* 버튼 */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={onClickCancel}>
                  닫기
                </Button>
              </DialogClose>
              <Button variant="primary" type="submit">
                {isEdit ? "수정" : "등록"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>

      {/* 경고창 */}
      {showAlert && <AlertMaps alertValue={alertValue} />}
    </Dialog>
  );
}
