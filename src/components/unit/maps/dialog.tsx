import { useState } from "react";
import { firebaseApp } from "@/lib/firebase/firebaseApp";
import { addDoc, collection, getFirestore } from "firebase/firestore";

import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";
import { useDialog } from "@/hooks/useDialog";

import DatePicker01 from "@/components/commons/datePicker/01";
import AlertMaps from "./alert";

import { ColorList } from "./colorList";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface IMarkerDataProps {
  name: string;
  address: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}
interface IBookmarkStateProps {
  bookmarkName: string;
  setBookmarkName: React.Dispatch<React.SetStateAction<string>>;
  bookmarkColor: string;
  setBookmarkColor: React.Dispatch<React.SetStateAction<string>>;
}

interface IMapsDialogProps {
  isEdit: boolean;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  markerData: IMarkerDataProps;
  bookmarkState: IBookmarkStateProps;
}

export default function MapsDialog({ isEdit, showDialog, setShowDialog, handleSubmit, handleUpdate, markerData, bookmarkState }: IMapsDialogProps) {
  // 유저 ID
  const { user } = useAuth();

  // ⚠️ 알림창 등
  const { showAlert, alertValue, triggerAlert } = useAlert();

  const { isOpen: isBookmarkListOpen, onClickToggle: toggleBookmarkList, setIsOpen } = useDialog();

  // 북마크 관련
  const { bookmarks, setBookmarks } = useUserBookmarks({ uid: user?.uid });
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkColor, setBookmarkColor] = useState("");

  // DropdownMenu 색깔 정하는 함수
  const onClickBookmarkColor = (color: string) => {
    setBookmarkColor((prev) => (prev === color ? "" : color));
  };

  // DropdownMenu 닫기
  const onClickDropMenuCancel = () => {
    setIsOpen(false);
    setBookmarkColor("");
  };

  // bookMarkData 저장
  const handleAddBookmark = async () => {
    const isDuplicate = bookmarks.some((bm) => bm.bookmarkName === bookmarkName.trim());

    if (isDuplicate) {
      triggerAlert("이미 존재하는 여정 이름입니다. 다른 이름을 입력해주세요.");
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      const bookMarkData = collection(db, "bookmarkData");

      await addDoc(bookMarkData, {
        uid: user?.uid,
        bookmarkName,
        bookmarkColor,
      });

      // DropdownMenu 이름, 색깔 선택된 값을 담기
      setBookmarks((prev) => [
        ...prev,
        {
          bookmarkName,
          bookmarkColor,
        },
      ]);

      setBookmarkName("");
      setBookmarkColor("");
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // Dialog 닫기
  const onClickCancel = () => {
    markerData.setDate(undefined);
    markerData.setContent("");
  };

  // travelData에 저장될 값을 담기
  const onChangeName = (name: string, color: string) => {
    bookmarkState.setBookmarkName((prev) => (prev === name ? "" : name));
    bookmarkState.setBookmarkColor((prev) => (prev === color ? "" : color));
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:w-140 lg:w-180 bg-[#F9F9F9]">
        <form onSubmit={isEdit ? handleUpdate : handleSubmit}>
          <DialogHeader>
            <DialogTitle>{markerData.name}</DialogTitle>
            <DialogDescription>{markerData.address}</DialogDescription>
          </DialogHeader>

          {/* 다이얼로그 */}
          <div className="grid gap-3 mt-4">
            {/* 북마크 */}
            <DropdownMenu>
              {/* 여정 버튼 - 트리거 요소도 버튼이기 때문에 트리거 동작과 버튼 스타일을 갖기 위해선 asChild로 기능을 전달 */}
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {bookmarkState.bookmarkName ? (
                    <img src={`./images/bookmark/icon_bookmarker_${bookmarkState.bookmarkColor}.png`} alt="북마크 아이콘" className="w-5 inline-block mr-1" />
                  ) : (
                    <img className="w-5 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
                  )}

                  <span className="inline-block align-middle">{bookmarkState.bookmarkName || "여정"}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {/* 여정 리스트 */}
                <DropdownMenuLabel>
                  {bookmarks.length > 0 ? (
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                      {bookmarks.map((el) => (
                        <div key={el.bookmarkName} onClick={() => onChangeName(el.bookmarkName, el.bookmarkColor)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                          <img src={`./images/bookmark/icon_bookmarker_${el.bookmarkColor}.png`} alt="북마크 아이콘" className="w-5" />
                          <span>{el.bookmarkName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>여정을 만들어 보세요.</div>
                  )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* 여정 추가하기 클릭 영역 */}
                {!isBookmarkListOpen && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault(); // 메뉴 닫히는 기본 동작 방지
                      toggleBookmarkList();
                    }}
                  >
                    <img className="w-5 inline-block" src="./images/icon_plus.png" alt="여정 추가 아이콘" />
                    <span>여정 추가하기</span>
                  </DropdownMenuItem>
                )}

                {/* 여정 북마크 생성 요소 */}
                {isBookmarkListOpen && (
                  <div className="mt-2 px-4 py-2 border rounded-md bg-gray-50">
                    <div style={{ display: isBookmarkListOpen ? "flex" : "none" }} className="flex flex-col gap-3 w-full py-1">
                      <Input className="bg-white " placeholder="여정의 이름을 입력해주세요." value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
                      <p className="text-sm">여정 색깔을 정해 주세요.</p>
                      <ul className="flex flex-wrap justify-center gap-1 w-full">
                        {ColorList.map(({ color }, idx) => (
                          <li
                            onClick={() => onClickBookmarkColor(color)}
                            style={{
                              backgroundColor: bookmarkColor === color ? "#F1F5F9" : "transparent",
                              borderColor: bookmarkColor === color ? "#ddd" : "transparent",
                            }}
                            className="cursor-pointer border rounded-sm"
                            key={idx}
                          >
                            <img className="w-8" src={`./images/bookmark/icon_bookmarker_${color}.png`} alt="" />
                          </li>
                        ))}
                      </ul>

                      <div className="flex  gap-2  justify-end">
                        <Button variant="outline" onClick={onClickDropMenuCancel}>
                          닫기
                        </Button>
                        <Button variant="primary" type="button" onClick={handleAddBookmark}>
                          저장
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 날짜 선택 */}
            <DatePicker01 date={markerData.date} setDate={markerData.setDate} className="" />
            {/* 내용 작성 */}
            <Textarea value={markerData.content} onChange={(e) => markerData.setContent(e.target.value)} className="h-full mb-4 bg-white placeholder-gray" placeholder="기록할 내용을 적어보세요." />
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
