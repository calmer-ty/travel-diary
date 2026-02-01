"use client";

import { MapPinned, Home, Inbox, NotebookText } from "lucide-react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "홈",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "여행 일기쓰기",
    url: "/maps",
    icon: MapPinned,
  },
  {
    title: "나의 여행기록",
    url: "/list",
    icon: NotebookText,
  },
  {
    title: "게임하기",
    url: "/game",
    icon: Inbox,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      {pathname !== "/" && (
        <>
          <Sidebar side="left">
            <SidebarContent className="dark:shadow-[0px_10px_15px_3px_rgba(255,255,255,0.35)]">
              <SidebarGroup>
                <SidebarGroupLabel>Travel Diary</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={`${item.url}`}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {/* <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => setAiOpen(true)}>
                        <Brain />
                        <span>AI</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem> */}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </>
      )}
    </>
  );
}
