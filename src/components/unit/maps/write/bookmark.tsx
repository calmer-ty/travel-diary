import { useState } from "react";

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

interface IMapsDialogProps {
  savedBookmark:
    | {
        name: string;
        color: string;
      }
    | undefined;
  selectedBookmarkName: string;
  setSelectedBookmarkName: Dispatch<SetStateAction<string>>;
  selectedBookmarkColor: string;
  setSelectedBookmarkColor: Dispatch<SetStateAction<string>>;
}

export default function WriteBookmark({ savedBookmark, selectedBookmarkName, setSelectedBookmarkName, selectedBookmarkColor, setSelectedBookmarkColor }: IMapsDialogProps) {
  // 유저 ID
  const { uid } = useAuth();

  // ⚠️ 알림창 등
  const { triggerAlert } = useAlert();

  // 🔖 북마크
  const { isOpen, onClickToggle, setIsOpen } = useDialog();
  const { bookmarks, setBookmarks } = useUserBookmarks({ uid });

  const [newBookmarkName, setNewBookmarkName] = useState("");
  const [newBookmarkColor, setNewBookmarkColor] = useState("");

  // bookMarkData 저장
  const handleAddBookmark = async () => {
    // ✅ 입력값 검증 먼저
    if (newBookmarkName === "") {
      triggerAlert("여정의 이름을 입력해주세요!");
      return;
    }

    if (newBookmarkColor === "") {
      triggerAlert("북마크의 색상을 선택해주세요!");
      return;
    }

    // ✅ 중복 이름 검사
    const isDuplicate = bookmarks.some((bookmark) => bookmark.name === newBookmarkName);

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
        name: newBookmarkName,
        color: newBookmarkColor,
      });
      await updateDoc(docRef, {
        _id: docRef.id,
      });

      // ✅ 상태 업데이트
      setBookmarks((prev) => [
        ...prev,
        {
          _id: docRef.id,
          name: newBookmarkName,
          color: newBookmarkColor,
        },
      ]);

      // // ✅ 저장한 북마크를 바로 선택되게 지정
      // setSelectedBookmarkName(newBookmarkName);
      // setSelectedBookmarkColor(newBookmarkColor);

      // ✅ 생성한 북마크 값 초기화
      setNewBookmarkName("");
      setNewBookmarkColor("");
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
  // 생성할 북마크 색깔 정하는 함수
  const onClickNewBookmarkColor = (color: string) => {
    setNewBookmarkColor((prev) => (prev === color ? "" : color));
  };
  // 북마크 생성창 닫기
  const onClickNewBookmarkCancel = () => {
    setNewBookmarkName("");
    setNewBookmarkColor("");
    setIsOpen(false);
  };

  // 선택한 북마크 저장하기
  const onClickSaveBookmark = (name: string, color: string) => {
    setSelectedBookmarkName(name);
    setSelectedBookmarkColor(color);
    // setIsOpen(false);
  };

  const displayName = selectedBookmarkName || savedBookmark?.name || "여정";
  const displayColor = selectedBookmarkColor || savedBookmark?.color;

  return (
    <DropdownMenu>
      {/* 여정 버튼 - 트리거 요소도 버튼이기 때문에 트리거 동작과 버튼 스타일을 갖기 위해선 asChild로 기능을 전달 */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {displayColor ? (
            <img src={`/images/bookmark/icon_bookmarker_${displayColor}.png`} alt="북마크 아이콘" className="w-5 inline-block mr-1" />
          ) : (
            <img className="w-5 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
          )}
          <span className="inline-block align-middle">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>

      {/* 저장했던 여정 리스트 */}
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {bookmarks.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {bookmarks.map((bookmark) => (
                <div key={bookmark._id} className="flex items-center gap-3 cursor-pointer">
                  <DropdownMenuItem onClick={() => onClickSaveBookmark(bookmark.name, bookmark.color)} className="flex items-center gap-1">
                    <img src={`./images/bookmark/icon_bookmarker_${bookmark.color}.png`} alt="북마크 아이콘" className="w-5" />
                    <span>{bookmark.name}</span>
                  </DropdownMenuItem>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 막기
                      handleDeleteBookmark(bookmark._id);
                    }}
                    type="button"
                    className="w-4 h-4 bg-[url(/images/icon_trash.png)] bg-contain bg-no-repeat"
                  ></button>
                </div>
              ))}
            </div>
          ) : (
            <div>여정을 만들어 보세요.</div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* 여정 추가하기 클릭 영역 - 클릭 시 여정 북마크 생성 요소 보임 */}
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
              <Input className="bg-white " placeholder="여정의 이름을 입력해주세요." value={newBookmarkName} onChange={(e) => setNewBookmarkName(e.target.value)} />
              <p className="text-sm">여정 색깔을 정해 주세요.</p>
              <ul className="flex flex-wrap justify-center gap-1 w-full">
                {ColorList.map(({ color }, idx) => (
                  <li
                    onClick={() => onClickNewBookmarkColor(color)}
                    style={{
                      backgroundColor: newBookmarkColor === color ? "#F1F5F9" : "transparent",
                      borderColor: newBookmarkColor === color ? "#ddd" : "transparent",
                    }}
                    className="cursor-pointer border rounded-sm"
                    key={idx}
                  >
                    <img className="w-8" src={`./images/bookmark/icon_bookmarker_${color}.png`} alt="" />
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClickNewBookmarkCancel}>
                  닫기
                </Button>
                <Button variant="primary" type="button" onClick={handleAddBookmark}>
                  추가
                </Button>
              </div>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
