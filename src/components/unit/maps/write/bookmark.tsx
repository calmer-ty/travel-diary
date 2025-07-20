import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
import { useUserBookmarks } from "@/hooks/useUserBookmarks";
import { useDialog } from "@/hooks/useDialog";

// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// firebase - 추후 리팩토링 필요
import { addDoc, collection, deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebaseApp";

import { ColorList } from "../colorList";
import type { Dispatch, SetStateAction } from "react";
import type { ILogPlace } from "@/types";

interface IMapsDialogProps {
  selectedMarker: ILogPlace | null;
  bookmarkName: string;
  setBookmarkName: Dispatch<SetStateAction<string>>;
  bookmarkColor: string;
  setBookmarkColor: Dispatch<SetStateAction<string>>;
}

export default function WriteBookmark({ selectedMarker, bookmarkName, setBookmarkName, bookmarkColor, setBookmarkColor }: IMapsDialogProps) {
  // 유저 ID
  const { uid } = useAuth();

  // ⚠️ 알림창 등
  const { triggerAlert } = useAlert();

  // 🔖 북마크
  const { isOpen, onClickToggle, setIsOpen } = useDialog();
  const { bookmarks, setBookmarks } = useUserBookmarks({ uid });

  // bookMarkData 저장
  const handleAddBookmark = async () => {
    const name = bookmarkName.trim();
    const color = bookmarkColor.trim();

    // ✅ 입력값 검증 먼저
    if (!name) {
      triggerAlert("여정의 이름을 입력해주세요!");
      return;
    }

    if (!bookmarkColor) {
      triggerAlert("북마크의 색상을 선택해주세요!");
      return;
    }

    // ✅ 중복 이름 검사
    const isDuplicate = bookmarks.some((bookmark) => bookmark.name === name);

    if (isDuplicate) {
      triggerAlert("이미 존재하는 여정 이름입니다. 다른 이름을 입력해주세요.");
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      const bookMarkData = collection(db, "bookmarkData");

      // ✅ Firestore 저장
      const docRef = await addDoc(bookMarkData, {
        uid,
        _id: "",
        name,
        color,
      });
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      // ✅ 상태 업데이트
      setBookmarks((prev) => [
        ...prev,
        {
          _id: docRef.id,
          name,
          color,
        },
      ]);

      // ✅ 저장한 북마크를 바로 선택되게 지정
      // bookmarkState.setBookmarkName(name);
      // bookmarkState.setBookmarkColor(bookmarkColor);

      // ✅ 초기화
      setBookmarkName("");
      setBookmarkColor("");
      // setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // bookMarkData 삭제
  const handleDeleteBookmark = async (_id: string) => {
    const db = getFirestore(firebaseApp);

    const docRef = collection(db, "bookmarkData");
    await deleteDoc(doc(docRef, _id));

    // 상태에서 제거
    setBookmarks((prev) => prev.filter((bm) => bm._id !== _id));

    // 선택 중인 북마크가 삭제된 거라면 초기화
    // const deleted = bookmarks.find((bm) => bm._id === _id);
    // if (bookmarkState.bookmarkName === deleted?.bookmarkName) {
    //   bookmarkState.setBookmarkName("");
    //   bookmarkState.setBookmarkColor("");
    // }
  };
  // DropdownMenu 색깔 정하는 함수
  const onClickBookmarkColor = (color: string) => {
    setBookmarkColor((prev) => (prev === color ? "" : color));
  };
  // DropdownMenu 닫기
  const onClickDropMenuCancel = () => {
    setIsOpen(false);
    setBookmarkColor("");
  };

  // travelData에 저장될 값을 담기
  const onClickMatchingMark = (name: string, color: string) => {
    console.log(name, color);
    // const isSameName = bookmarkState.bookmarkName === name;
    // const isSameColor = bookmarkState.bookmarkColor === color;

    // if (isSameName && isSameColor) {
    //   // 이름, 색상 모두 같으면 선택 해제
    //   bookmarkState.setBookmarkName("");
    //   bookmarkState.setBookmarkColor("");
    // } else {
    //   // 변경된 항목이 있으면 무조건 반영
    //   bookmarkState.setBookmarkName(name);
    //   bookmarkState.setBookmarkColor(color);
    // }
  };

  return (
    <DropdownMenu>
      {/* 여정 버튼 - 트리거 요소도 버튼이기 때문에 트리거 동작과 버튼 스타일을 갖기 위해선 asChild로 기능을 전달 */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {/* 여정 로고 */}
          {selectedMarker?.bookmark.name ? (
            <img src={`./images/bookmark/icon_bookmarker_${selectedMarker?.bookmark.color}.png`} alt="북마크 아이콘" className="w-5 inline-block mr-1" />
          ) : (
            <img className="w-5 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
          )}
          {/* 여정 텍스트 */}
          <span className="inline-block align-middle">{selectedMarker?.bookmark.name || "여정"}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {/* 여정 리스트 */}
        <DropdownMenuLabel>
          {bookmarks.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {bookmarks.map((bookmark) => (
                <div key={bookmark._id} className="flex items-center gap-3 cursor-pointer ">
                  <div className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded" onClick={() => onClickMatchingMark(bookmark.name, bookmark.color)}>
                    <img src={`./images/bookmark/icon_bookmarker_${bookmark.color}.png`} alt="북마크 아이콘" className="w-5" />
                    <span>{bookmark.name}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 막기
                      handleDeleteBookmark(bookmark._id);
                    }}
                    type="button"
                    className="w-4 h-4 bg-[url(/images/icon_trash.png)] bg-contain bg-no-repeat "
                  ></button>
                </div>
              ))}
            </div>
          ) : (
            <div>여정을 만들어 보세요.</div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* 여정 추가하기 클릭 영역 */}
        {!isOpen && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // 메뉴 닫히는 기본 동작 방지
              onClickToggle();
            }}
          >
            <img className="w-5 inline-block" src="./images/icon_plus.png" alt="여정 추가 아이콘" />
            <span>여정 추가하기</span>
          </DropdownMenuItem>
        )}

        {/* 여정 북마크 생성 요소 */}
        {isOpen && (
          <div className="mt-2 px-4 py-2 border rounded-md bg-gray-50">
            <div style={{ display: isOpen ? "flex" : "none" }} className="flex flex-col gap-3 w-full py-1">
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
  );
}
