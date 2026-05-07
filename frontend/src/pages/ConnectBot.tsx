import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wifi, Search, AlertCircle, Loader2, ChevronLeft, Tractor, Radio, Info, ChevronDown, ChevronUp, KeyRound, Hash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThingSpeak } from "@/context/ThingSpeakContext";
import { botApi } from "@/services/api";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function ConnectDevice() {
  const navigate = useNavigate();
  const { connectBot } = useAuth();
  const { saveConfig, connect: tsConnect } = useThingSpeak();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(true);
  const [nearbyBots, setNearbyBots] = useState<any[]>([]);
  const [manualBotId, setManualBotId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [readApiKey, setReadApiKey] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  useEffect(() => {
    handleStartDiscovery();
  }, []);

  const handleStartDiscovery = async () => {
    setIsScanning(true);
    try {
      const data = await botApi.getAvailable();
      setNearbyBots(data.bots || []);
    } catch {
      setNearbyBots([]);
    } finally {
      setTimeout(() => setIsScanning(false), 1500);
    }
  };

  const handleConnectBot = async (botId: string, botName?: string) => {
    setIsConnecting(botId);
    try {
      await botApi.add(botId, botName || botId);
      connectBot(botId);

      // Save ThingSpeak config if provided
      if (channelId.trim() && readApiKey.trim()) {
        const cfg = { channelId: channelId.trim(), readKey: readApiKey.trim(), label: botName || botId };
        saveConfig(cfg);
        await tsConnect(cfg);
      }

      toast.success(`${botId} connected!`);
      setTimeout(() => navigate("/"), 800);
    } catch (e: any) {
      // If already registered, just activate it
      if (e.message?.includes("already connected")) {
        connectBot(botId);
        if (channelId.trim() && readApiKey.trim()) {
          const cfg = { channelId: channelId.trim(), readKey: readApiKey.trim(), label: botName || botId };
          saveConfig(cfg);
          await tsConnect(cfg);
        }
        toast.info(`${botId} is already in your account. Activating...`);
        setTimeout(() => navigate("/"), 800);
      } else {
        toast.error(e.message || "Connection failed");
      }
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in px-0 sm:px-4">
      {/* Header */}
      <header className="space-y-3">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-fit -ml-2 rounded-xl text-muted-foreground hover:text-primary h-10"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> {t("button.back")}
        </Button>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] font-bold uppercase text-primary">
                {t("connect.devicePairing")}
              </Badge>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase bg-success/10 text-success border-success/20">
                <Radio className="mr-1 h-3 w-3 animate-pulse" /> {t("connect.liveScanning")}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">{t("connect.botDiscovery")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("connect.searchingDesc")}</p>
          </div>
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow shrink-0">
            <Tractor className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
        </div>
      </header>

      {/* Scan Results */}
      {isScanning ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border-2 border-dashed bg-gradient-iot/5 border-primary/20">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <Loader2 className="h-14 w-14 animate-spin text-primary opacity-20" />
            <Search className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
          </div>
          <h2 className="text-lg font-black mb-1">{t("connect.scanningTitle")}</h2>
          <p className="text-sm text-muted-foreground max-w-xs px-4">{t("connect.scanningDesc")}</p>
        </Card>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {nearbyBots.length > 0 ? `${nearbyBots.length} ${t("demo.demoBots").toLowerCase()}` : t("connect.noBotsTitle")}
            </p>
            <Button variant="link" onClick={handleStartDiscovery} className="text-primary font-bold text-sm h-auto p-0">
              {t("button.scanAgain")}
            </Button>
          </div>

          {nearbyBots.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {nearbyBots.map((bot) => (
                <Card
                  key={bot.id}
                  className="rounded-2xl border-2 p-4 sm:p-5 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/80">
                      <Wifi className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="border-success/30 text-success bg-success/5 text-[10px] font-bold">
                      {bot.signal || t("status.strongSignal")} {t("connect.signal")}
                    </Badge>
                  </div>
                  <h3 className="text-base font-black">{bot.name || bot.id}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">ID: {bot.id}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      {t("connect.esp32Ready")}
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl h-9 px-4 font-bold"
                      disabled={isConnecting === bot.id}
                      onClick={() => handleConnectBot(bot.id, bot.name)}
                    >
                      {isConnecting === bot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : t("connect.connectNow")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/5">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
              <h2 className="text-base font-black mb-1">{t("connect.noBotsTitle")}</h2>
              <p className="text-sm text-muted-foreground text-center max-w-xs px-4">{t("connect.noBotsDesc")}</p>
              <Button variant="outline" onClick={handleStartDiscovery} className="mt-6 rounded-xl h-11 px-6 border-primary/20 text-primary font-bold">
                {t("button.scanAgain")}
              </Button>
            </Card>
          )}

          {/* Manual Entry */}
          <Card className="rounded-2xl p-4 sm:p-6 bg-secondary/30 border border-dashed border-muted-foreground/20 space-y-5">
            <div>
              <h3 className="font-bold text-base mb-1">{t("connect.cantFindBot")}</h3>
              <p className="text-sm text-muted-foreground">{t("connect.manualDesc")}</p>
            </div>

            {/* Bot ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Tractor className="h-3.5 w-3.5" /> {t("connect.botId")}
              </label>
              <Input
                placeholder={t("connect.botIdPlaceholder")}
                className="h-12 rounded-xl bg-background border-primary/20 text-base"
                value={manualBotId}
                onChange={(e) => setManualBotId(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground px-1">
                The unique ID printed on your ESP32 bot or given during setup.
              </p>
            </div>

            {/* ThingSpeak Channel ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> {t("connect.channelId")}
              </label>
              <Input
                placeholder={t("connect.channelPlaceholder")}
                className="h-12 rounded-xl bg-background border-primary/20 text-base font-mono"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground px-1">
                Found on your ThingSpeak channel page — it's the number in the URL:
                <span className="font-mono bg-muted rounded px-1 ml-1">thingspeak.com/channels/<strong>2345678</strong></span>
              </p>
            </div>

            {/* ThingSpeak Read API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" /> {t("connect.readApiKey")}
              </label>
              <Input
                placeholder={t("connect.readKeyPlaceholder")}
                className="h-12 rounded-xl bg-background border-primary/20 text-base font-mono tracking-wider"
                value={readApiKey}
                onChange={(e) => setReadApiKey(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground px-1">
                Go to your ThingSpeak channel → <strong>API Keys</strong> tab → copy the <strong>Read API Key</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:underline w-full text-left"
            >
              <Info className="h-3.5 w-3.5 shrink-0" />
              {t("connect.thingSpeakSetup")}
              {showHelp ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
            </button>

            {showHelp && (
              <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="font-bold text-foreground text-xs uppercase tracking-widest">{t("connect.thingSpeakSetup")}</p>
                <ol className="space-y-2 list-none">
                  {[
                    <>Go to <a href="https://thingspeak.com" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">thingspeak.com</a> and sign in (or create a free account).</>,
                    <>Click <strong>Channels</strong> in the top menu, then open your bot's channel.</>,
                    <>Your <strong>{t("connect.channelId")}</strong> is the number shown at the top of the channel page and in the browser URL.</>,
                    <>Click the <strong>API Keys</strong> tab on the channel page.</>,
                    <>Copy the <strong>{t("connect.readApiKey")}</strong> (starts with letters, 16 characters long) and paste it above.</>,
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-black mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-[11px] bg-muted/60 rounded-lg p-2.5 leading-relaxed">
                  💡 Your ESP32 bot must be programmed to send data to the same ThingSpeak channel. The Channel ID and API Key link this app to your bot's live data feed.
                </p>
              </div>
            )}

            <Button
              onClick={() => manualBotId.trim() && channelId.trim() && readApiKey.trim() && handleConnectBot(manualBotId.trim())}
              disabled={!manualBotId.trim() || !channelId.trim() || !readApiKey.trim() || isConnecting === manualBotId}
              className="rounded-xl h-12 px-6 font-bold shadow-glow w-full"
            >
              {isConnecting === manualBotId ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {t("connect.validating")}</>
              ) : (
                t("connect.validateConnect")
              )}
            </Button>

            {(!channelId.trim() || !readApiKey.trim()) && manualBotId.trim() && (
              <p className="text-[11px] text-amber-500 text-center -mt-2">
                {t("connect.missingFields")}
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
