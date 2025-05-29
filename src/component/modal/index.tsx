import { motion } from "framer-motion";

interface IModal01Props {
  handleCancel: () => void;
  handleConfirm: () => void;
  // selectedMarker: google.maps.LatLngLiteral | null;
}

export default function Modal01(props: IModal01Props) {
  return (
    // <div className="absolute bg-[#F9F9F9] w-full h-71 z-50 bottom-px shadow-[0_-2px_5px_rgba(0,0,0,0.3)] rounded-xl animate-[slideUp_0.2s_ease-out_forwards]">
    //   <form onSubmit={props.handleConfirm} className="">
    //     <button type="submit" className="absolute  bottom-4 right-4 px-4 py-1 bg-[#DFB489] text-white rounded-md shadow-[2px_2px_0px_#CB9B6A]">
    //       저장
    //     </button>
    //     <button className="absolute top-4  right-4 w-8 h-8 bg-[url(/images/btn_close.png)] bg-contain bg-no-repeat" onClick={props.handleCancel}></button>
    //   </form>
    // </div>

    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bg-[#F9F9F9] w-full h-71 z-50 bottom-px shadow-[0_-2px_5px_rgba(0,0,0,0.3)] rounded-xl"
    >
      <form onSubmit={props.handleConfirm}>
        <button type="submit" className="absolute bottom-4 right-4 px-4 py-1 bg-[#DFB489] text-white rounded-md shadow-[2px_2px_0px_#CB9B6A]">
          저장
        </button>
        <button className="absolute top-4 right-4 w-8 h-8 bg-[url(/images/btn_close.png)] bg-contain bg-no-repeat" onClick={props.handleCancel}></button>
      </form>
    </motion.div>
  );
}
