import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChart3, CalendarDays, Download, Droplets, MapPinned, Route, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { reportApi } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  fontSize: "12px",
};

// ── Demo data ────────────────────────────────────────────────────────────────
const DEMO_BOT_ID = "DEMO-BOT-01";

const demoChartData = [
  { time: "08:00", distance: 200,  pesticide: 0.4, area: 0.3 },
  { time: "08:30", distance: 580,  pesticide: 0.7, area: 0.8 },
  { time: "09:00", distance: 1050, pesticide: 0.9, area: 1.3 },
  { time: "09:30", distance: 1620, pesticide: 0.6, area: 1.9 },
  { time: "10:00", distance: 2100, pesticide: 0.8, area: 2.4 },
  { time: "10:30", distance: 2400, pesticide: 0.6, area: 2.7 },
];

const demoTotals = {
  distance: 2400,
  area: 2.7,
  pesticide: 4.0,
  lastActive: "2026-05-07",
};
// ─────────────────────────────────────────────────────────────────────────────

export default function Reports() {
  const { activeBotId } = useAuth();
  const { t } = useLanguage();
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"live" | "demo">(activeBotId ? "live" : "demo");

  useEffect(() => {
    // Switch to live automatically when a bot connects
    if (activeBotId) setViewMode("live");
  }, [activeBotId]);

  useEffect(() => {
    if (viewMode !== "live" || !activeBotId) return;
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await reportApi.get(activeBotId);
        setReportData(data.logs || []);
      } catch {
        toast.error(t("reports.fetchError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [activeBotId, viewMode]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const isDemo = viewMode === "demo";

  const totalDistance  = isDemo ? demoTotals.distance  : reportData.reduce((a, c) => a + (c.distance  || 0), 0);
  const totalArea      = isDemo ? demoTotals.area       : reportData.reduce((a, c) => a + (c.area      || 0), 0);
  const totalPesticide = isDemo ? demoTotals.pesticide  : reportData.reduce((a, c) => a + (c.pesticide || 0), 0);
  const lastActive     = isDemo
    ? demoTotals.lastActive
    : reportData[0]?.createdAt
      ? new Date(reportData[0].createdAt).toLocaleDateString()
      : "—";

  const chartData = isDemo
    ? demoChartData
    : [...reportData].reverse().slice(0, 20).map((log) => ({
        time: log.createdAt
          ? new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "—",
        distance:  log.distance  || 0,
        pesticide: log.pesticide || 0,
        area:      log.area      || 0,
      }));

  const displayBotId = isDemo ? DEMO_BOT_ID : activeBotId!;

  const summaries = [
    { label: t("reports.totalDistance"), value: totalDistance.toFixed(0),  unit: t("unit.meters"), icon: Route        },
    { label: t("reports.totalArea"),     value: totalArea.toFixed(2),      unit: t("unit.acres"),  icon: MapPinned    },
    { label: t("reports.pesticideUsed"), value: totalPesticide.toFixed(2), unit: t("unit.liters"), icon: Droplets     },
    { label: t("reports.lastActive"),    value: lastActive,                unit: "",               icon: CalendarDays },
  ];

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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 rounded-2xl border bg-gradient-surface p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] font-bold uppercase text-primary">
                {t("reports.performanceReports")}
              </Badge>
              {isDemo && (
                <Badge variant="secondary" className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <FlaskConical className="mr-1 h-3 w-3" /> {t("status.readOnly")} Demo
                </Badge>
              )}
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">{t("reports.operationAnalytics")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("reports.connectedBot", { botId: displayBotId })}
            </p>
          </div>
          <Button
            onClick={() => toast.info(t("reports.exportSoon"))}
            variant="outline"
            className="rounded-xl h-11 border-dashed font-bold"
          >
            <Download className="mr-2 h-4 w-4" /> {t("button.export")}
          </Button>
        </div>

        {/* Live / Demo toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("nav.reports")}:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("demo")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isDemo
                  ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <FlaskConical className="inline h-3 w-3 mr-1" /> {t("demo.demoMode")}
            </button>
            <button
              onClick={() => {
                if (!activeBotId) {
                  toast.info("Connect a bot first to see live reports.");
                  return;
                }
                setViewMode("live");
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                !isDemo
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {activeBotId ? `📡 ${activeBotId}` : `📡 ${t("status.disconnected")}`}
            </button>
          </div>
        </div>
      </section>

      {/* No live data notice */}
      {!isDemo && reportData.length === 0 && (
        <div className="rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/5 p-6 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-muted-foreground">{t("reports.noReportsTitle")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("reports.noReportsDesc")}</p>
          <button
            onClick={() => setViewMode("demo")}
            className="mt-3 text-xs font-bold text-primary underline"
          >
            View demo reports instead →
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {(isDemo || reportData.length > 0) && (
        <>
          <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {summaries.map((item, idx) => (
              <Card key={item.label} className="premium-card animate-scale-in p-4 sm:p-6" style={{ animationDelay: `${idx * 75}ms` }}>
                <div className="absolute inset-0 bg-gradient-glow opacity-40" />
                <div className="relative">
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </span>
                  <p className="stat-label text-[9px] sm:text-[10px]">{item.label}</p>
                  <p className="mt-1 font-display text-lg sm:text-2xl font-extrabold tracking-tight">
                    {item.value}{" "}
                    {item.unit && <span className="text-xs font-bold text-muted-foreground">{item.unit}</span>}
                  </p>
                </div>
              </Card>
            ))}
          </section>

          {/* Charts */}
          <section className="grid gap-4 lg:grid-cols-2">
            <Card className="premium-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-sm sm:text-base font-bold">{t("reports.historicalPerformance")}</h2>
                <Route className="h-4 w-4 text-primary" />
              </div>
              <div className="h-[220px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="distance" name={`${t("metric.distanceTraveled")} (m)`} stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="premium-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-sm sm:text-base font-bold">{t("reports.resourceUtilization")}</h2>
                <Droplets className="h-4 w-4 text-primary" />
              </div>
              <div className="h-[220px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="pesticide" name={`${t("metric.pesticideSprayed")} (L)`} fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* Insights */}
          <Card className="premium-card p-4 sm:p-6">
            <div className="flex items-center gap-2 font-display font-bold mb-4">
              <BarChart3 className="h-4 w-4 text-primary" /> {t("reports.performanceInsights")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-secondary/30 p-4 text-sm text-muted-foreground leading-relaxed">
                {t("reports.insightData", { botId: displayBotId })}
              </div>
              <div className="rounded-2xl border bg-secondary/30 p-4 text-sm text-muted-foreground leading-relaxed">
                {t("reports.insightEfficiency", { percent: ((totalPesticide / (totalArea || 1)) * 10).toFixed(1) })}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
