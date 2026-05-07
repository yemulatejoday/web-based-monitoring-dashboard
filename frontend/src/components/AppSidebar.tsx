import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, LayoutDashboard, Leaf, MonitorSmartphone, ScrollText, UserRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useLanguage } from "@/context/LanguageContext";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useLanguage();

  const items = [
    { titleKey: "nav.dashboard", url: "/",        icon: LayoutDashboard  },
    { titleKey: "nav.devices",   url: "/devices",  icon: MonitorSmartphone },
    { titleKey: "nav.demo",      url: "/demo",     icon: BarChart3         },
    { titleKey: "nav.reports",   url: "/reports",  icon: ScrollText        },
    { titleKey: "nav.profile",   url: "/profile",  icon: UserRound         },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-iot shadow-glow">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight animate-fade-in">
              <span className="font-display text-base font-bold">{t("app.brandName")}</span>
              <span className="text-[11px] text-muted-foreground">{t("app.brandTagline")}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              {t("nav.analytics")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.url;
                const label = t(item.titleKey);
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      tooltip={label}
                      className={
                        active
                          ? "bg-gradient-primary text-primary-foreground hover:bg-gradient-primary hover:text-primary-foreground shadow-md-soft h-11"
                          : "hover:bg-sidebar-accent h-11"
                      }
                    >
                      <NavLink to={item.url} end>
                        <item.icon className="h-[18px] w-[18px]" />
                        <span className="font-medium">{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Language selector in sidebar footer */}
      {!collapsed && (
        <SidebarFooter className="border-t px-3 py-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              {t("language.label")}
            </p>
            <LanguageSelect className="w-full" />
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
