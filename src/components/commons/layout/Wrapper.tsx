"use client";

import type { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  // const pathname = usePathname();

  return (
    <div id="wrapper" className="size-full">
      {children}
    </div>
  );
}
