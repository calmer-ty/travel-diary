import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { motion } from "framer-motion";

interface IMotionAlertProps {
  alertValue: string;
}

export default function MotionAlert(props: IMotionAlertProps) {
  return (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: [0, -20, 20, -20, 20, 0],
        scale: [1, 0.98, 1.02, 0.98, 1.02, 1],
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 w-80"
    >
      <Alert variant="destructive">
        <CheckCircle2Icon />
        <AlertTitle>{props.alertValue}</AlertTitle>
        {/* <AlertDescription></AlertDescription> */}
      </Alert>
    </motion.div>
  );
}
