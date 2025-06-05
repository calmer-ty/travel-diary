"use client";

import { useAuth } from "@/commons/hooks/useAuth";
import IntroPage from "./intro";

import Maps from "@/component/maps";
// import MainPage from "@/component/mainpage";

export default function Home() {
  const { user } = useAuth();
  console.log(user);
  return <><IntroPage />}</>;
}
