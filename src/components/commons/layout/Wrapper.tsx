"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    //   <div
    //     id="wrapper"
    //     className={`
    //   ${pathname === "/" ? "h-auto pt-0" : "h-auto sm:h-screen pt-0 sm:pt-12"}
    // `}
    //   >
    <div id="wrapper" className={`${pathname !== "/" ? "h-auto sm:h-screen" : "h-full"} ${pathname !== "/" ? "pt-12" : "pt-0"}`}>
      {children}
    </div>
  );
}
