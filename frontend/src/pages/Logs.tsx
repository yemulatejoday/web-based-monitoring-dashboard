import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { reportApi } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

const styles: Record<string, string> = {
  info:    "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warn:    "border-warning/30 bg-warning/10 text-warning",
  error:   "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function Logs() {
  const { activeBotId } = useAuth();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeBotId) { setLogs([]); return; }

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await reportApi.get(activeBotId, 200);
        const rows = data.logs || [];
        const mapped = rows.map((entry: any) => {
          const isError       = entry.status === "Error";
          const isBatteryWarn = typeof entry.battery === "number" && entry.battery < 20;
          const isTankWarn    = typeof entry.tank === "number" && entry.tank < 20;
          const status    = isError ? "error" : isBatteryWarn || isTankWarn ? "warn" : "info";
          const event     = isError ? t("logs.deviceAlert") : isBatteryWarn ? t("logs.batteryWarning") : isTankWarn ? t("logs.tankWarning") : t("logs.telemetryUpdate");
          const eventType = isError ? "device" : isTankWarn ? "tank" : isBatteryWarn ? "device" : "telemetry";
          const detail = [
            entry.distance != null ? t("logs.detailDistance").replace("{value}", Number(entry.distance).toFixed(1)) : null,
            entry.area     != null ? t("logs.detailArea").replace("{value}", Number(entry.area).toFixed(2))         : null,
            entry.tank     != null ? t("logs.detailTank").replace("{value}", Number(entry.tank).toFixed(0))         : null,
            entry.battery  != null ? t("logs.detailBattery").replace("{value}", Number(entry.battery).toFixed(0))  : null,
          ].filter(Boolean).join(" · ");

          return {
            ts: entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "—",
            event,
            eventType,
            detail: detail || t("logs.detailReceived"),
            status,
          };
        });
        setLogs(mapped);
      } catch {
        toast.error(t("logs.fetchError"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [activeBotId]);

  const filtered = logs.filter((log) => {
    const q = query.toLowerCase();
    const matchQ = log.event.toLowerCase().includes(q) || log.detail.toLowerCase().includes(q);
    const matchT = type === "all" || log.eventType === type;
    return matchQ && matchT;
  });

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("logs.searchPlaceholder")}
              className="h-11 pl-9 text-base"
            />
          </div>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11 w-full sm:w-44">
              <SelectValue placeholder={t("logs.eventType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("logs.allEvents")}</SelectItem>
              <SelectItem value="telemetry">{t("logs.telemetry")}</SelectItem>
              <SelectItem value="tank">{t("logs.tank")}</SelectItem>
              <SelectItem value="device">{t("logs.device")}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 w-full sm:w-auto"
            onClick={() => toast.success(t("logs.exportSuccess"))}
          >
            <Download className="mr-2 h-4 w-4" /> {t("button.export")}
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[160px] text-xs">{t("logs.timestamp")}</TableHead>
                <TableHead className="w-[140px] text-xs">{t("logs.event")}</TableHead>
                <TableHead className="text-xs">{t("logs.detail")}</TableHead>
                <TableHead className="w-[90px] text-xs">{t("logs.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log, index) => (
                <TableRow key={`${log.ts}-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{log.ts}</TableCell>
                  <TableCell className="font-semibold text-sm">{log.event}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.detail}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${styles[log.status]} capitalize text-[10px]`}>
                      {log.status === "info"    ? t("logs.statusInfo")    :
                       log.status === "success" ? t("logs.statusSuccess") :
                       log.status === "warn"    ? t("logs.statusWarn")    :
                       t("logs.statusError")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    {isLoading ? t("logs.loading") : activeBotId ? t("logs.noLogs") : t("logs.connectDevice")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
