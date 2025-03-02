
import { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Newspaper, Settings, Rss } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <Rss className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">News Scraper</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={router.pathname === "/"}
                  onClick={() => router.push("/")}
                  tooltip="News"
                >
                  <Newspaper className="h-4 w-4" />
                  <span>News</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={router.pathname === "/settings"}
                  onClick={() => router.push("/settings")}
                  tooltip="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="px-4 py-2">
            <div className="text-xs text-muted-foreground">
              News Scraper v1.0
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-full flex-col">
            <main className="flex-1 overflow-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
