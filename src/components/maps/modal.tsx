import { motion } from "framer-motion";
import { DatePicker01 } from "@/components/commons/datePicker/01";
import { Textarea } from "@/components/ui/textarea";
import { ColorList } from "./colorList";

interface IModalMapsProps {
  isEdit: boolean;
  name: string;
  address: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleCancel: () => void;
  // 북마크
  bookmarkColor: string | null;
  bookmarkName: string;
  setBookmarkName: React.Dispatch<React.SetStateAction<string>>;
  bookmarkShow: boolean;
  bookmarkListShow: boolean;
  onClickBookMarker: () => void;
  onClickBookMarkerColor: (color: string) => void;
  onClickBookMarkerList: () => void;
}

export default function ModalMaps({
  bookmarkListShow,
  onClickBookMarkerList,
  onClickBookMarker,
  bookmarkShow,
  bookmarkName,
  setBookmarkName,
  onClickBookMarkerColor,
  bookmarkColor,
  isEdit,
  name,
  address,
  date,
  setDate,
  content,
  setContent,
  handleSubmit,
  handleUpdate,
  handleCancel,
}: IModalMapsProps) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 h-120 p-8 pb-5 bg-[#F9F9F9] rounded-xl shadow-md sm:w-140 lg:w-180"
    >
      <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="flex flex-col h-full">
        {/* 장소 정보 */}
        <h4 className="mb-1 text-xl">{name}</h4>
        <p className="mb-2 text-sm">{address}</p>

        {/* 리스트 */}
        <div className="relative rounded-md mb-2 bg-white border px-2 py-1.5  shadow-xs  ">
          <div className="text-center cursor-pointer" onClick={onClickBookMarker}>
            <img className="w-6 inline-block align-middle mr-1" src="./images/bookmark/icon_bookmarker_default.png" alt="" />
            <span className="inline-block align-middle">여정</span>
          </div>

          {/* 리스트 박스 */}
          <div style={{ display: bookmarkShow ? "block" : "none" }} className="absolute top-10 left-0 w-60 h-80 rounded-md bg-white border px-2 py-1.5  shadow-xs ">
            <div className="p-1 border-b ">
              {/* 리스트 추가하기 */}
              <div className="cursor-pointer" onClick={onClickBookMarkerList}>
                <img className="w-5 inline-block align-middle mr-1" src="./images/icon_plus.png" alt="" />
                <span className="inline-block align-middle">여정 추가하기</span>
              </div>
              {/* 리스트 아이템 추가 박스 */}
              <div style={{ display: bookmarkListShow ? "flex" : "none" }} className="flex flex-col gap-3 w-full mt-3">
                <input
                  className="w-full  border p-1 rounded-md placeholder:text-sm placeholder-gray"
                  type="text"
                  placeholder="여정의 이름을 입력해주세요."
                  value={bookmarkName}
                  onChange={(e) => setBookmarkName(e.target.value)}
                />
                <p className="text-sm">여정 색깔을 정해 주세요.</p>
                <ul className="flex flex-wrap justify-center gap-1 w-full">
                  {ColorList.map(({ color }, idx) => (
                    <li onClick={() => onClickBookMarkerColor(color)} style={{ borderColor: bookmarkColor === color ? "#000" : "transparent" }} className="cursor-pointer border rounded-sm" key={idx}>
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

        {/* 날짜 */}
        <DatePicker01 date={date} setDate={setDate} className="mb-4" />

        {/* 컨텐츠 */}
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-full mb-4 bg-white placeholder-gray" placeholder="기록할 내용을 적어보세요." />

        {/* 수정/등록 */}
        <button type="submit" className="self-end w-16 px-4 py-1 bg-[#DFB489] text-white rounded-md shadow-[2px_2px_0px_#CB9B6A]">
          {isEdit ? "수정" : "등록"}
        </button>

        {/* 닫기버튼 */}
        <button className="absolute top-4 right-4 w-8 h-8 bg-[url(/images/btn_close.png)] bg-contain bg-no-repeat" onClick={handleCancel}></button>
      </form>
    </motion.div>
  );
}
