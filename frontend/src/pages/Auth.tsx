import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelect } from "@/components/LanguageSelect";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast.error(t("auth.fillFields"));
      return;
    }
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      toast.success(isLogin ? t("auth.welcomeBackToast") : t("auth.accountCreatedToast"));
      navigate("/");
    } catch {
      // Error handled in context
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      {/* Language selector — top right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelect />
      </div>

      <div className="w-full max-w-[420px] animate-scale-in relative">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">{t("app.brandName")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
        </div>

        <Card className="overflow-hidden rounded-2xl shadow-lg">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold mb-5 text-center">
              {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="name" className="text-sm font-semibold">{t("auth.userName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("auth.userNamePlaceholder")}
                      className="pl-10 h-12 rounded-xl text-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold">{t("auth.emailAddress")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    className="pl-10 h-12 rounded-xl text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    className="pl-10 pr-10 h-12 rounded-xl text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl text-base font-bold shadow-glow mt-2 active:scale-95 transition-transform"
                style={{ height: "52px" }}
              >
                {isLoading ? t("auth.processing") : isLogin ? t("auth.signIn") : t("auth.signUp")}
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  {isLogin ? t("auth.toggleToSignup") : t("auth.toggleToSignin")}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t text-center">
              <p className="text-[11px] text-muted-foreground">{t("auth.legalNotice")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
