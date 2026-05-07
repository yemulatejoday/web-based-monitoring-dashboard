import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar — hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          {/* Main content — extra bottom padding on mobile for bottom nav */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
            <div className="mx-auto w-full max-w-[1600px] animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Bottom navigation — only on mobile */}
      <BottomNav />
    </SidebarProvider>
  );
}
