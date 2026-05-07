import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Clock3,
  Droplets,
  MapPinned,
  Plus,
  Route,
  SprayCan,
  Tractor,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useThingSpeak, asNumber } from "@/context/ThingSpeakContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  fontSize: "12px",
};

export default function Dashboard() {
  const { activeBotId, disconnectBot } = useAuth();
  const navigate = useNavigate();
  const { feeds, latest, status, connect, config, lastFetched } = useThingSpeak();
  const { t } = useLanguage();

  if (!activeBotId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary animate-pulse">
          <Plus className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
          {t("dashboard.noDevicesTitle")}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("dashboard.noDevicesDesc")}
        </p>
        <Button
          onClick={() => navigate("/connect-bot")}
          size="lg"
          className="mt-8 h-14 w-full max-w-xs rounded-2xl text-base font-bold shadow-glow"
        >
          {t("button.connectDevice")}
        </Button>
      </div>
    );
  }

  // Derive live values from ThingSpeak latest feed
  const tank      = asNumber(latest?.field1, 100);
  const distance  = asNumber(latest?.field2, 0);
  const area      = asNumber(latest?.field3, 0);
  const pesticide = asNumber(latest?.field4, 0);
  const opTime    = asNumber(latest?.field5, 0);
  const battery   = 100; // ESP32 doesn't report battery via ThingSpeak by default

  const botStatus =
    status === "connected" ? t("status.active")
    : status === "loading"  ? t("status.connecting")
    : status === "error"    ? t("status.error")
    : t("status.offline");

  const statusDot =
    status === "connected" ? "bg-success"
    : status === "error"   ? "bg-destructive"
    : "bg-muted-foreground";

  const alerts: string[] = [];
  if (tank < 15)          alerts.push(`⚠️ ${t("alerts.lowBattery").replace("Battery", "Tank")}`);
  if (status === "error") alerts.push(`⚠️ ${t("connect.invalidChannel")}`);

  // Build trend arrays from feed history (last 10 entries)
  const recentFeeds = feeds.slice(-10);

  const distanceTrend = recentFeeds.map((f) => ({
    time: new Date(f.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    distance: asNumber(f.field2),
  }));

  const pesticideTrend = recentFeeds.map((f) => ({
    time: new Date(f.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    liters: asNumber(f.field4),
  }));

  const activityLogs = recentFeeds
    .slice()
    .reverse()
    .slice(0, 6)
    .map((f) => ({
      ts: new Date(f.created_at).toLocaleString(),
      event: t("logs.telemetryUpdate"),
      detail: `${t("logs.detailTank").replace("{value}", String(asNumber(f.field1)))}  |  ${t("logs.detailDistance").replace("{value}", String(asNumber(f.field2)))}  |  ${t("logs.detailArea").replace("{value}", String(asNumber(f.field3)))}`,
      status: asNumber(f.field1) < 15 ? "warning" : "info",
    }));

  const metrics = [
    { label: t("metric.distanceTraveled"), value: distance.toFixed(0), unit: t("unit.meters"),  sub: t("metric.totalDistance", { botId: activeBotId }), icon: Route     },
    { label: t("metric.areaCovered"),      value: area.toFixed(2),     unit: t("unit.acres"),   sub: t("metric.fieldCoverage"),                          icon: MapPinned },
    { label: t("metric.pesticideSprayed"), value: pesticide.toFixed(2),unit: t("unit.liters"),  sub: t("metric.measuredTankOutput"),                     icon: SprayCan  },
    { label: t("metric.operatingTime"),    value: `${opTime}`,         unit: "min",             sub: t("metric.recordedActiveDuration"),                 icon: Clock3    },
  ];

  const getLogDot = (s: string) =>
    s === "warning" ? "bg-warning" : s === "error" ? "bg-destructive" : "bg-primary";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 rounded-[2rem] border bg-gradient-surface p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow shrink-0 animate-float">
            <Tractor className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                {t("dashboard.liveMonitoring")}
              </Badge>
              {config?.channelId && (
                <Badge variant="secondary" className="text-[10px] font-bold uppercase text-muted-foreground">
                  Ch {config.channelId}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-lg sm:text-2xl font-extrabold truncate">
              {t("dashboard.botInsights")}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-bold">
            <span className={`pulse-dot ${statusDot}`} />
            <span className="truncate">{activeBotId}: {botStatus}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => connect()}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-xl border-primary/20 bg-primary/5 font-bold text-primary h-10"
            >
              <RefreshCw className="mr-1 h-4 w-4" /> Refresh
            </Button>
            <Button
              onClick={() => navigate("/connect-bot")}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-xl border-primary/20 bg-primary/5 font-bold text-primary h-10"
            >
              <Plus className="mr-1 h-4 w-4" /> {t("button.connectMore")}
            </Button>
            <Button
              onClick={() => { disconnectBot(); toast.info(t("dashboard.deviceDisconnectedTitle"), { description: t("dashboard.deviceDisconnectedDesc") }); }}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-xl border-destructive/20 bg-destructive/5 font-bold text-destructive h-10"
            >
              <WifiOff className="mr-1 h-4 w-4" /> {t("button.disconnect")}
            </Button>
          </div>
        </div>

        {lastFetched && (
          <p className="text-[10px] text-muted-foreground">
            {t("status.connected")}: {lastFetched.toLocaleTimeString()}
          </p>
        )}
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm font-medium text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {alert}
            </div>
          ))}
        </section>
      )}

      {/* Metric Cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={metric.label} className="premium-card animate-scale-in p-4 sm:p-6" style={{ animationDelay: `${index * 55}ms` }}>
            <div className="absolute inset-0 bg-gradient-glow opacity-40" />
            <div className="relative flex flex-col justify-between h-full gap-4">
              <div className="flex items-center justify-between">
                <span className="stat-label text-[9px] sm:text-[10px]">{metric.label}</span>
                <span className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <metric.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </span>
              </div>
              <div>
                <p className="font-display text-xl sm:text-3xl font-extrabold tracking-tighter">
                  {metric.value}{" "}
                  {metric.unit && <span className="text-xs sm:text-sm font-bold text-muted-foreground">{metric.unit}</span>}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{metric.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Bot Status + Distance Chart */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="premium-card lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">{t("dashboard.botStatus")}</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-secondary/70 p-4">
              <span className="text-xs font-bold uppercase tracking-tight">{t("dashboard.currentState")}</span>
              <Badge className={
                status === "error"     ? "bg-destructive text-destructive-foreground" :
                status === "connected" ? "bg-success text-success-foreground" :
                "bg-muted text-muted-foreground"
              }>
                {botStatus}
              </Badge>
            </div>
            <StatusMeter label={t("dashboard.batteryLevel")} value={battery} icon={BatteryCharging} />
            <StatusMeter label={t("dashboard.tankLevel")} value={tank} icon={Droplets} />
          </div>
        </Card>

        <Card className="premium-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold">{t("dashboard.liveProgress")}</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {t("dashboard.distanceTrend")}
              </p>
            </div>
            <Route className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-6 h-[260px]">
            {distanceTrend.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="distance" name={`${t("metric.distanceTraveled")} (m)`} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center border border-dashed rounded-2xl bg-muted/5">
                <Route className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                <p className="text-sm font-bold text-muted-foreground">{t("dashboard.collectingPathData", { botId: activeBotId })}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("dashboard.noLogsDesc")}</p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Pesticide Bar Chart */}
      <Card className="premium-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold">{t("dashboard.resourceAllocation")}</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              {t("dashboard.litersPerSession")}
            </p>
          </div>
          <SprayCan className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-6 h-[260px]">
          {pesticideTrend.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pesticideTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="liters" name={`${t("metric.pesticideSprayed")} (L)`} fill="hsl(var(--accent))" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center border border-dashed rounded-2xl bg-muted/5">
              <SprayCan className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
              <p className="text-sm font-bold text-muted-foreground">{t("dashboard.measuringDistribution")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("dashboard.noLogsDesc")}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Activity Log */}
      <Card className="rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm sm:text-base font-bold">{t("dashboard.activityLogs")}</h2>
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
            {t("dashboard.latestRecords")}
          </Badge>
        </div>
        {activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-2xl bg-muted/5">
            <Clock3 className="h-7 w-7 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm font-bold text-muted-foreground">
              {t("dashboard.noLogsTitle", { botId: activeBotId })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("dashboard.noLogsDesc")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/10 p-4">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getLogDot(log.status)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{log.event}</p>
                    <span className="text-[10px] text-muted-foreground">{log.ts}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatusMeter({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BatteryCharging;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
          <Icon className="h-4 w-4 text-primary" /> {label}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-3" />
    </div>
  );
}
