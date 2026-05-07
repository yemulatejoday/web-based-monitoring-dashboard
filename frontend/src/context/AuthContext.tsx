import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface User {
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  cropsGrown?: string[];
  profileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  accounts: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (fields: Partial<User>) => void;
  isAuthenticated: boolean;
  activeBotId: string | null;
  connectBot: (id: string) => void;
  disconnectBot: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("agri_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accounts] = useState<User[]>([]);
  const [activeBotId, setActiveBotId] = useState<string | null>(
    () => localStorage.getItem("agri_active_bot") || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Login failed");

      const { token, user: userData } = json.data;
      setUser(userData);
      localStorage.setItem("agri_token", token);
      localStorage.setItem("agri_user", JSON.stringify(userData));
    } catch (e: any) {
      toast.error(e.message || "Login failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Registration failed");

      const { token, user: userData } = json.data;
      setUser(userData);
      localStorage.setItem("agri_token", token);
      localStorage.setItem("agri_user", JSON.stringify(userData));
    } catch (e: any) {
      toast.error(e.message || "Registration failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveBotId(null);
    localStorage.removeItem("agri_user");
    localStorage.removeItem("agri_token");
    localStorage.removeItem("agri_active_bot");
  };

  const updateProfile = (fields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem("agri_user", JSON.stringify(updated));
  };

  const connectBot = (id: string) => {
    setActiveBotId(id);
    localStorage.setItem("agri_active_bot", id);
  };

  const disconnectBot = () => {
    setActiveBotId(null);
    localStorage.removeItem("agri_active_bot");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        login,
        logout,
        signup,
        updateProfile,
        isAuthenticated: !!user,
        activeBotId,
        connectBot,
        disconnectBot,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
