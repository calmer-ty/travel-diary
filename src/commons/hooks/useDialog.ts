import { useState } from "react";

// useAuth 훅을 만들어 Firebase 인증 상태를 관리
export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickToggle = (): void => {
    setIsOpen((prev) => !prev);
  };

  console.log("isOpen: ", isOpen);
  return { isOpen, setIsOpen, onClickToggle };
};
