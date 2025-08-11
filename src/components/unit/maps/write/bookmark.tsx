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
import type { ILogPlace } from "@/types";

interface IMapsDialogProps {
  selectedMarker: ILogPlace | null;
  bookmark: {
    _id: string;
    name: string;
    color: string;
  };
  setBookmark: Dispatch<SetStateAction<{ _id: string; name: string; color: string }>>;
}

export default function WriteBookmark({ bookmark, setBookmark, selectedMarker }: IMapsDialogProps) {
  // 유저 ID
  const { uid } = useAuth();

  // ⚠️ 알림창 등
  const { triggerAlert } = useAlert();

  // 🔖 북마크 관련 훅
  const { isOpen, onClickToggle, setIsOpen } = useDialog();
  const { bookmarks, setBookmarks } = useUserBookmarks({ uid });

  // 새 북마크 이름/색상 상태를 객체로 관리
  const [newBookmark, setNewBookmark] = useState({ name: "", color: "" });

  // 새 북마크 추가 함수
  const handleAddBookmark = async () => {
    if (newBookmark.name.trim() === "") {
      triggerAlert("여정의 이름을 입력해주세요!");
      return;
    }
    if (newBookmark.color === "") {
      triggerAlert("북마크의 색상을 선택해주세요!");
      return;
    }

    // 중복 이름 검사
    const isDuplicate = bookmarks.some((bm) => bm.name === newBookmark.name);
    if (isDuplicate) {
      triggerAlert("이미 존재하는 여정 이름입니다. 다른 이름을 입력해주세요.");
      return;
    }

    try {
      const db = getFirestore(firebaseApp);
      const bookMarkData = collection(db, "bookmarkData");

      // Firestore에 저장
      const docRef = await addDoc(bookMarkData, {
        uid,
        _id: "",
        name: newBookmark.name,
        color: newBookmark.color,
      });
      await updateDoc(docRef, { _id: docRef.id });

      const createdBookmark = {
        _id: docRef.id,
        name: newBookmark.name,
        color: newBookmark.color,
      };

      // 상태 업데이트
      setBookmarks((prev) => [...prev, createdBookmark]);

      // 새로 만든 북마크 바로 선택
      setBookmark(createdBookmark);

      // 입력 초기화 및 닫기
      setNewBookmark({ name: "", color: "" });
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  // 북마크 삭제 함수
  const handleDeleteBookmark = async (_id: string) => {
    const db = getFirestore(firebaseApp);
    const docRef = collection(db, "bookmarkData");

    await deleteDoc(doc(docRef, _id));

    // 상태에서 삭제
    setBookmarks((prev) => prev.filter((bm) => bm._id !== _id));

    // 만약 삭제한 북마크가 현재 선택된 북마크라면 초기화
    if (bookmark._id === _id) {
      setBookmark({ _id: "", name: "", color: "" });
    }
  };

  // 새 북마크 색상 클릭 시 토글
  const onClickNewBookmarkColor = (color: string) => {
    setNewBookmark((prev) => ({ ...prev, color: prev.color === color ? "" : color }));
  };

  // 새 북마크 생성 취소
  const onClickNewBookmarkCancel = () => {
    setNewBookmark({ name: "", color: "" });
    setIsOpen(false);
  };

  // 기존 북마크 선택 시 상태 업데이트
  const onClickSaveBookmark = (_id: string, name: string, color: string) => {
    setBookmark({ _id, name, color });
  };

  const bookmarkColor = bookmark?.color || selectedMarker?.bookmark?.color || "default";
  const bookmarkName = bookmark?.name || selectedMarker?.bookmark?.name || "여정을 선택하세요";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <img src={`/images/bookmark/icon_bookmarker_${bookmarkColor}.png`} alt="북마크 아이콘" className="w-5 inline-block mr-1" />
          <span className="inline-block align-middle">{bookmarkName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          {bookmarks.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {bookmarks.map((bm) => (
                <div key={bm._id} className="flex items-center gap-3 cursor-pointer">
                  <DropdownMenuItem onClick={() => onClickSaveBookmark(bm._id, bm.name, bm.color)} className="flex items-center gap-1">
                    <img src={`./images/bookmark/icon_bookmarker_${bm.color}.png`} alt="북마크 아이콘" className="w-5" />
                    <span>{bm.name}</span>
                  </DropdownMenuItem>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBookmark(bm._id);
                    }}
                    type="button"
                    className="w-4 h-4 bg-[url(/images/icon_trash.png)] bg-contain bg-no-repeat"
                    aria-label="북마크 삭제"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>여정을 만들어 보세요.</div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {!isOpen && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              onClickToggle();
            }}
          >
            <img className="w-5 inline-block" src="./images/icon_plus.png" alt="여정 추가 아이콘" />
            <span>여정 추가하기</span>
          </DropdownMenuItem>
        )}

        {isOpen && (
          <div className="mt-2 px-4 py-2 border rounded-md bg-gray-50">
            <div className="flex flex-col gap-3 w-full py-1">
              <Input className="bg-white" placeholder="여정의 이름을 입력해주세요." value={newBookmark.name} onChange={(e) => setNewBookmark((prev) => ({ ...prev, name: e.target.value }))} />
              <p className="text-sm">여정 색깔을 정해 주세요.</p>
              <ul className="flex flex-wrap justify-center gap-1 w-full">
                {ColorList.map(({ color }, idx) => (
                  <li
                    key={idx}
                    onClick={() => onClickNewBookmarkColor(color)}
                    style={{
                      backgroundColor: newBookmark.color === color ? "#F1F5F9" : "transparent",
                      borderColor: newBookmark.color === color ? "#ddd" : "transparent",
                    }}
                    className="cursor-pointer border rounded-sm"
                  >
                    <img className="w-8" src={`./images/bookmark/icon_bookmarker_${color}.png`} alt="" />
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 justify-end">
                <Button variant="close" onClick={onClickNewBookmarkCancel}>
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
