import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelect } from "@/components/LanguageSelect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const titleKeys: Record<string, string> = {
  "/": "nav.dashboard",
  "/devices": "nav.devices",
  "/demo": "nav.demo",
  "/reports": "nav.reports",
  "/profile": "nav.profile",
  "/connect-bot": "connect.devicePairing",
};

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const title = t(titleKeys[pathname] ?? "app.brandName");

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-3 border-b bg-background/90 px-3 sm:px-4 backdrop-blur-xl md:px-6">
      {/* Sidebar trigger — only on desktop */}
      <div className="hidden md:block">
        <SidebarTrigger className="shrink-0" />
      </div>

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-base sm:text-lg font-bold leading-none truncate">{title}</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Language selector — compact on mobile, full on desktop */}
        <LanguageSelect className="hidden sm:flex" />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1.5 rounded-full px-2 h-9 hover:bg-primary/10"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-iot text-xs font-semibold text-primary-foreground">
                  {user?.name?.substring(0, 2).toUpperCase() || "FM"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                {user?.name || "Farmer"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="gap-2 font-medium"
            >
              <UserRound className="h-4 w-4" /> {t("nav.profile")}
            </DropdownMenuItem>
            {/* Language selector inside dropdown on mobile */}
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 sm:hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                {t("language.label")}
              </p>
              <LanguageSelect className="w-full" />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { logout(); navigate("/login"); }}
              className="gap-2 font-bold text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" /> {t("topbar.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
