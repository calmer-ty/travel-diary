"use client";

import { useAuth } from "@/commons/hooks/useAuth";
import IntroPage from "./intro";

import Maps from "@/component/maps";
// import MainPage from "@/component/mainpage";

export default function Home() {
  // return <MainPage />;
  const { user } = useAuth();
  return <>{user === null ? <IntroPage /> : <Maps />}</>;
}
