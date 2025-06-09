import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { DatePicker01 } from "@/components/commons/datePicker/01";
import { Textarea } from "@/components/ui/textarea";

import { IModalMaps } from "@/commons/types";

interface IModalMapsProps {
  name: string;
  address: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  content: string;
  setContent: (value: string) => void;
  handleCancel: () => void;
  // handleConfirm: (e: React.FormEvent<HTMLFormElement>) => void;
  handleConfirm: (data: IModalMaps) => Promise<void>;
  // selectedMarker: google.maps.LatLngLiteral | null;
}

export default function ModalMaps(props: IModalMapsProps) {
  const { register, handleSubmit } = useForm<IModalMaps>();

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 h-120 pt-8 pr-8 pb-14 pl-8 bg-[#F9F9F9] rounded-xl shadow-md sm:w-140 lg:w-180"
    >
      <form onSubmit={handleSubmit(props.handleConfirm)} className="flex flex-col h-full">
        <h4 className="mb-1 text-xl">{props.name}</h4>
        <p className="mb-2 text-sm">{props.address}</p>
        <DatePicker01 date={props.date} setDate={props.setDate} className="mb-4" />
        {/* onChange={(e) => props.setContent(e.target.value)} */}
        <Textarea {...register("content")} className="h-full bg-white" placeholder="기록할 내용을 적어보세요." content={props.content} />
        <button type="submit" className="absolute bottom-4 right-4 px-4 py-1 bg-[#DFB489] text-white rounded-md shadow-[2px_2px_0px_#CB9B6A]">
          저장
        </button>
        <button className="absolute top-4 right-4 w-8 h-8 bg-[url(/images/btn_close.png)] bg-contain bg-no-repeat" onClick={props.handleCancel}></button>
      </form>
    </motion.div>
  );
}
