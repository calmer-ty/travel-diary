import { DatePicker01 } from "@/components/commons/datePicker/01";
import { Textarea } from "@/components/ui/textarea";
import { ColorList } from "./colorList";
import { useDialog } from "@/hooks/useDialog";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
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
  bookmarkColor: string | null;
  setBookmarkColor: React.Dispatch<React.SetStateAction<string | null>>;
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
  const { isOpen: isBookmarkListOpen, onClickToggle: toggleBookmarkList } = useDialog();

  const onClickBookmarkColor = (color: string): void => {
    bookmarkState.setBookmarkColor((prev) => (prev === color ? null : color));
  };

  const onClickCancel = () => {
    markerData.setDate(undefined);
    markerData.setContent("");
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
                  <img className="w-5 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
                  <span className="inline-block align-middle">여정</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault(); // 메뉴 닫히는 기본 동작 방지
                    toggleBookmarkList();
                  }}
                >
                  <img className="w-5 inline-block" src="./images/icon_plus.png" alt="" />
                  <span>여정 추가하기</span>
                </DropdownMenuItem>

                {/* 여정 북마크 생성 요소 */}
                {isBookmarkListOpen && (
                  <div className="mt-2 px-4 py-2 border rounded-md bg-gray-50">
                    {/* 이 부분은 자유롭게 마크업 가능 */}
                    <div style={{ display: isBookmarkListOpen ? "flex" : "none" }} className="flex flex-col gap-3 w-full mt-3">
                      <Input className="bg-white" placeholder="여정의 이름을 입력해주세요." value={bookmarkState.bookmarkName} onChange={(e) => bookmarkState.setBookmarkName(e.target.value)} />
                      <p className="text-sm">여정 색깔을 정해 주세요.</p>
                      <ul className="flex flex-wrap justify-center gap-1 w-full">
                        {ColorList.map(({ color }, idx) => (
                          <li
                            onClick={() => onClickBookmarkColor(color)}
                            style={{ borderColor: bookmarkState.bookmarkColor === color ? "#000" : "transparent" }}
                            className="cursor-pointer border rounded-sm"
                            key={idx}
                          >
                            <img className="w-8" src={`./images/bookmark/icon_bookmarker_${color}.png`} alt="" />
                          </li>
                        ))}
                      </ul>
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
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="primary" type="submit">
                {isEdit ? "수정" : "등록"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
