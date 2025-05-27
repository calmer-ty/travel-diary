import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/commons/libraries/firebase/firebaseApp";
import { signInWithPopup } from "firebase/auth";

// 🔒 로그인 하는 페이지
export default function IntroPage() {
  // Google 로그인 처리
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-blue-100">
      <div className="flex flex-col">
        <span>환영합니다!</span>
        <motion.button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 border border-gray-300 rounded bg-white px-4 py-2 cursor-pointer"
          whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FcGoogle /> Google로 로그인
        </motion.button>
      </div>
    </div>
  );
}
