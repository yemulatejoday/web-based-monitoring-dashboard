import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Tractor, Edit2, Check, X, Phone, MapPin, Leaf, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { profileApi, helpApi } from "@/services/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";

export default function Profile() {
  const { user, updateProfile, activeBotId } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    village: user?.village || "",
    district: user?.district || "",
    state: user?.state || "",
    cropsGrown: user?.cropsGrown?.join(", ") || "",
  });

  const [helpForm, setHelpForm] = useState({ message: "", phone: user?.phone || "" });
  const [isSubmittingHelp, setIsSubmittingHelp] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error(t("profile.nameEmpty"));
      return;
    }
    setIsSaving(true);
    try {
      const data = await profileApi.update({
        name: form.name,
        phone: form.phone,
        village: form.village,
        district: form.district,
        state: form.state,
        cropsGrown: form.cropsGrown,
      });
      updateProfile(data.profile);
      setIsEditing(false);
      toast.success(t("profile.updated"));
    } catch (e: any) {
      toast.error(e.message || t("profile.updated"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpForm.message.trim() || !helpForm.phone.trim()) {
      toast.error(t("auth.fillFields"));
      return;
    }
    setIsSubmittingHelp(true);
    try {
      await helpApi.submit({
        name: user?.name || "Farmer",
        phone: helpForm.phone,
        message: helpForm.message,
        village: user?.village || "",
      });
      toast.success(t("help.sent"));
      setHelpForm({ message: "", phone: user?.phone || "" });
    } catch (e: any) {
      toast.error(e.message || t("help.failed"));
    } finally {
      setIsSubmittingHelp(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <Card className="rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shadow-glow border-2 border-primary/20 shrink-0">
            <AvatarFallback className="bg-gradient-iot text-xl sm:text-2xl font-black text-primary-foreground">
              {user?.name?.substring(0, 2).toUpperCase() || "FM"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-bold text-[10px]">
                {t("profile.botOwnerProfile")}
              </Badge>
              {user?.profileComplete && (
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success font-bold text-[10px]">
                  ✓ {t("status.ready")}
                </Badge>
              )}
              {!isEditing ? (
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full ml-auto" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              ) : (
                <div className="flex items-center gap-1 ml-auto">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-success" onClick={handleSave} disabled={isSaving}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({ name: user?.name || "", phone: user?.phone || "", village: user?.village || "", district: user?.district || "", state: user?.state || "", cropsGrown: user?.cropsGrown?.join(", ") || "" });
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("auth.userName")}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder={t("auth.userNamePlaceholder")} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("connect.readApiKey").replace("Read API Key", "Phone Number")}</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder="e.g. 9876543210" type="tel" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Village</Label>
                    <Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder="Village name" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">District</Label>
                    <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder="District" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State</Label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder="State" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Crops Grown (comma separated)</Label>
                  <Input value={form.cropsGrown} onChange={(e) => setForm({ ...form, cropsGrown: e.target.value })} className="mt-1 h-11 rounded-xl" placeholder="e.g. Rice, Wheat, Cotton" />
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 rounded-xl font-bold">
                  {isSaving ? t("auth.processing") : t("profile.updated").replace("!", "")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="font-display text-xl sm:text-2xl font-black truncate">{user?.name || "Farmer"}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {(user?.phone || user?.village || user?.state) && (
                  <div className="mt-3 space-y-1.5">
                    {user?.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" /> {user.phone}
                      </div>
                    )}
                    {(user?.village || user?.district || user?.state) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        {[user.village, user.district, user.state].filter(Boolean).join(", ")}
                      </div>
                    )}
                    {user?.cropsGrown && user.cropsGrown.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Leaf className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{user.cropsGrown.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}
                {!user?.phone && !user?.village && (
                  <p className="text-xs text-muted-foreground mt-2 italic">{t("profile.subtitle")}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="rounded-2xl p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 mb-3">
            <Tractor className="h-4 w-4 text-primary" />
          </span>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("profile.totalConnectedDevices")}</p>
          <p className="mt-1 font-display text-lg font-bold">{activeBotId ? t("profile.oneBot") : t("profile.zeroBots")}</p>
        </Card>
        <Card className="rounded-2xl p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 mb-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </span>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("profile.monitoringAccess")}</p>
          <p className="mt-1 font-display text-lg font-bold">{t("profile.readOnly")}</p>
        </Card>
      </section>

      {/* Help Form */}
      <Card className="rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display text-base font-bold">{t("help.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t("help.desc")}
        </p>
        <form onSubmit={handleHelpSubmit} className="space-y-3">
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("help.phone")}</Label>
            <Input value={helpForm.phone} onChange={(e) => setHelpForm({ ...helpForm, phone: e.target.value })} className="mt-1 h-12 rounded-xl text-base" placeholder={t("help.phonePlaceholder")} type="tel" />
          </div>
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("help.message")}</Label>
            <Textarea value={helpForm.message} onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })} className="mt-1 rounded-xl text-base resize-none" placeholder={t("help.messagePlaceholder")} rows={3} />
          </div>
          <Button type="submit" disabled={isSubmittingHelp} className="w-full h-12 rounded-xl font-bold text-base">
            {isSubmittingHelp ? t("auth.processing") : t("help.submit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
