import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, LayoutDashboard, MonitorSmartphone, ScrollText, UserRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { titleKey: "nav.dashboard", url: "/",       icon: LayoutDashboard   },
    { titleKey: "nav.devices",   url: "/devices", icon: MonitorSmartphone },
    { titleKey: "nav.demo",      url: "/demo",    icon: BarChart3         },
    { titleKey: "nav.reports",   url: "/reports", icon: ScrollText        },
    { titleKey: "nav.profile",   url: "/profile", icon: UserRound         },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t bg-background/95 backdrop-blur-xl safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url;
        const label = t(item.titleKey);
        return (
          <NavLink
            key={item.titleKey}
            to={item.url}
            end
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 px-1 transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon
              className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`}
            />
            <span className={`text-[10px] font-semibold leading-none ${isActive ? "font-bold" : ""}`}>
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
