import { MonitorSmartphone, Wifi, WifiOff, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { botApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function Devices() {
  const { activeBotId, connectBot } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bots, setBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBots = async () => {
      setIsLoading(true);
      try {
        const data = await botApi.getAll();
        setBots(data.bots || []);
      } catch {
        toast.error(t("devices.fetchError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBots();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("status.loading")}...</p>
        </div>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary animate-pulse">
          <MonitorSmartphone className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight">{t("devices.emptyTitle")}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("devices.emptyDesc")}</p>
        <Button
          onClick={() => navigate("/connect-bot")}
          size="lg"
          className="mt-8 h-14 w-full max-w-xs rounded-2xl text-base font-bold shadow-glow"
        >
          <Plus className="mr-2 h-5 w-5" /> {t("button.connectDevice")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="flex flex-col gap-3 rounded-2xl border bg-gradient-surface p-4 sm:p-5">
        <div>
          <Badge variant="outline" className="mb-2 border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase">
            {t("devices.readOnlyList")}
          </Badge>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold">{t("devices.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bots.length} {bots.length !== 1 ? t("demo.demoBots").toLowerCase() : "bot"} {t("status.connected").toLowerCase()}
          </p>
        </div>
        <Button onClick={() => navigate("/connect-bot")} size="sm" className="w-full sm:w-auto rounded-xl h-11 font-bold">
          <Plus className="mr-2 h-4 w-4" /> {t("button.connectMore")}
        </Button>
      </section>

      <section className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bots.map((bot) => {
          const isActive = bot.botId === activeBotId;
          return (
            <Card key={bot._id || bot.botId} className="rounded-2xl p-4 sm:p-5 border-primary/10 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <MonitorSmartphone className="h-5 w-5 text-primary" />
                </span>
                <Badge
                  variant="outline"
                  className={isActive
                    ? "border-success/30 bg-success/10 text-success text-[10px]"
                    : "border-muted-foreground/30 bg-muted text-muted-foreground text-[10px]"}
                >
                  {isActive ? (
                    <><Wifi className="mr-1 h-3 w-3" /> {t("devices.active")}</>
                  ) : (
                    <><WifiOff className="mr-1 h-3 w-3" /> {t("devices.offline")}</>
                  )}
                </Badge>
              </div>

              <h2 className="mt-3 font-display text-base sm:text-lg font-bold">{bot.botId}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{bot.name}</p>

              <div className="mt-4 flex flex-col gap-2">
                {!isActive ? (
                  <Button
                    size="sm"
                    className="w-full rounded-xl h-10 font-bold text-sm"
                    onClick={() => { connectBot(bot.botId); toast.success(`${bot.botId} ${t("status.active")}`); }}
                  >
                    <Wifi className="mr-2 h-4 w-4" /> {t("devices.multipleMonitoring")}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full rounded-xl h-10 font-bold text-sm" onClick={() => navigate("/")}>
                    {t("button.viewDashboard")}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
