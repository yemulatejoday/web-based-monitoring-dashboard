import { API_URL } from "@/config";

/**
 * Get the stored JWT token
 */
const getToken = (): string | null => localStorage.getItem("agri_token");

/**
 * Base fetch wrapper with auth headers and JSON parsing
 */
const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach server. Check your connection.");
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server error (${res.status})`);
  }

  if (!json.success) {
    throw new Error(json.error || "Request failed");
  }

  return json.data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiFetch("/api/auth/me"),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => apiFetch("/api/profile"),

  update: (fields: {
    name?: string;
    phone?: string;
    village?: string;
    district?: string;
    state?: string;
    cropsGrown?: string | string[];
  }) =>
    apiFetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(fields),
    }),
};

// ─── Bots ─────────────────────────────────────────────────────────────────────
export const botApi = {
  getAll: () => apiFetch("/api/bots"),

  getAvailable: () => apiFetch("/api/bots/available"),

  add: (botId: string, name?: string) =>
    apiFetch("/api/bots", {
      method: "POST",
      body: JSON.stringify({ botId, name }),
    }),

  remove: (botId: string) =>
    apiFetch(`/api/bots/${encodeURIComponent(botId)}`, { method: "DELETE" }),
};

// ─── Telemetry ────────────────────────────────────────────────────────────────
export const telemetryApi = {
  getLatest: (botId: string) =>
    apiFetch(`/api/telemetry/${encodeURIComponent(botId)}`),
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportApi = {
  get: (botId: string, limit = 100) =>
    apiFetch(`/api/reports/${encodeURIComponent(botId)}?limit=${limit}`),
};

// ─── Help ─────────────────────────────────────────────────────────────────────
export const helpApi = {
  submit: (data: { name: string; phone: string; message: string; village?: string }) =>
    apiFetch("/api/help", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMine: () => apiFetch("/api/help"),
};
