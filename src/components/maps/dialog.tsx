// shadcn
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { DatePicker01 } from "@/components/commons/datePicker/01";
import { Textarea } from "@/components/ui/textarea";
import { ColorList } from "./colorList";
import { useDialog } from "@/commons/hooks/useDialog";

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
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  // handleCancel: () => void;
  markerData: IMarkerDataProps;
  bookmarkState: IBookmarkStateProps;
}

export default function MapsDialog({ isEdit, isDialogOpen, setIsDialogOpen, handleSubmit, handleUpdate, markerData, bookmarkState }: IMapsDialogProps) {
  const { isOpen: isBookmarkOpen, onClickToggle: toggleBookmark } = useDialog();
  const { isOpen: isBookmarkListOpen, onClickToggle: toggleBookmarkList } = useDialog();

  const onClickBookmarkColor = (color: string): void => {
    bookmarkState.setBookmarkColor((prev) => (prev === color ? null : color));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <form onSubmit={isEdit ? handleUpdate : handleSubmit}>
        <DialogContent className="sm:w-140 lg:w-180 bg-[#F9F9F9]">
          <DialogHeader>
            <DialogTitle>{markerData.name}</DialogTitle>
            <DialogDescription>{markerData.address}</DialogDescription>
          </DialogHeader>

          {/* 다이얼로그 */}
          <div className="grid gap-4">
            {/* 리스트 */}
            <div className="relative rounded-md bg-white border px-2 py-1.5  shadow-xs">
              <div className="text-center cursor-pointer" onClick={toggleBookmark}>
                <img className="w-6 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
                <span className="inline-block align-middle">여정</span>
              </div>

              {/* 리스트 박스 */}
              <div style={{ display: isBookmarkOpen ? "block" : "none" }} className="absolute top-10 left-0 w-60 h-80 rounded-md bg-white border px-2 py-1.5  shadow-xs ">
                <div className="p-1 border-b">
                  {/* 리스트 추가하기 */}
                  <div className="cursor-pointer" onClick={toggleBookmarkList}>
                    <img className="w-5 inline-block align-middle mr-1" src="./images/icon_plus.png" alt="" />
                    <span className="inline-block align-middle">여정 추가하기</span>
                  </div>
                  {/* 리스트 아이템 추가 박스 */}
                  <div style={{ display: isBookmarkListOpen ? "flex" : "none" }} className="flex flex-col gap-3 w-full mt-3">
                    <input
                      className="w-full  border p-1 rounded-md placeholder:text-sm placeholder-gray"
                      type="text"
                      placeholder="여정의 이름을 입력해주세요."
                      value={bookmarkState.bookmarkName}
                      onChange={(e) => bookmarkState.setBookmarkName(e.target.value)}
                    />
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

                  {/* 리스트 아이템 */}
                  <div className="w-full overflow-y-auto"></div>
                </div>
              </div>
            </div>

            {/* 내용 */}
            <DatePicker01 date={markerData.date} setDate={markerData.setDate} className="mb-4" />

            {/* 내용 */}
            <Textarea value={markerData.content} onChange={(e) => markerData.setContent(e.target.value)} className="h-full mb-4 bg-white placeholder-gray" placeholder="기록할 내용을 적어보세요." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="primary" type="submit">
              {isEdit ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
