import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { DatePicker01 } from "@/components/commons/datePicker/01";
import { Textarea } from "@/components/ui/textarea";

import { ILogPlace } from "@/commons/types";
import { useEffect } from "react";

interface IModalMapsProps {
  isEdit: boolean;
  markerData: ILogPlace | undefined;
  name: string;
  address: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleConfirm: (data: ILogPlace) => Promise<void>;
  handleCancel: () => void;
}

export default function ModalMaps({ isEdit, markerData, name, address, date, setDate, handleConfirm, handleCancel }: IModalMapsProps) {
  const { register, handleSubmit, reset } = useForm<ILogPlace>();

  useEffect(() => {
    if (isEdit) {
      reset({
        content: markerData?.content,
      });
    }
  }, [isEdit, markerData, reset]);

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 h-120 pt-8 pr-8 pb-14 pl-8 bg-[#F9F9F9] rounded-xl shadow-md sm:w-140 lg:w-180"
    >
      <form onSubmit={handleSubmit(handleConfirm)} className="flex flex-col h-full">
        <h4 className="mb-1 text-xl">{name}</h4>
        <p className="mb-2 text-sm">{address}</p>
        <DatePicker01 date={date} setDate={setDate} className="mb-4" />
        {/* onChange={(e) => setContent(e.target.value)} */}
        <Textarea {...register("content")} className="h-full bg-white" placeholder="기록할 내용을 적어보세요." />
        <button type="submit" className="absolute bottom-4 right-4 px-4 py-1 bg-[#DFB489] text-white rounded-md shadow-[2px_2px_0px_#CB9B6A]">
          저장
        </button>
        <button className="absolute top-4 right-4 w-8 h-8 bg-[url(/images/btn_close.png)] bg-contain bg-no-repeat" onClick={handleCancel}></button>
      </form>
    </motion.div>
  );
}
