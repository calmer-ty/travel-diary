"use client";

import { useAuth } from "@/commons/hooks/useAuth";
import IntroPage from "./intro";

import Maps from "@/component/maps";

export default function Home() {
  const { user } = useAuth();
  return <>{user === null ? <IntroPage /> : <Maps />}</>;
}
