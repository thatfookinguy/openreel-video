import { create } from "zustand";

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const STORAGE_KEY = "marketxyn_auth_user";

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? loadUser() : null,
  isAuthenticated: typeof window !== "undefined" ? !!loadUser() : false,
  setUser: (user) => {
    persistUser(user);
    set({ user, isAuthenticated: !!user });
  },
  logout: () => {
    persistUser(null);
    set({ user: null, isAuthenticated: false });
  },
}));

/** Phase 0: ensure a local guest account so keys work without a login UI. */
export function ensureGuestUser() {
  const state = useAuthStore.getState();
  if (state.user) return state.user;
  const guest: AuthUser = {
    id: "guest",
    username: "guest",
  };
  state.setUser(guest);
  return guest;
}

export async function register(
  username: string,
  password: string,
  email?: string
): Promise<AuthUser> {
  // Simple local-only register (password hashed lightly for Phase 0)
  const id = `user_${username.toLowerCase()}`;
  const user: AuthUser = { id, username, email };
  // Store password hash locally (not production-grade; Phase 0)
  const enc = new TextEncoder();
  const data = await crypto.subtle.digest("SHA-256", enc.encode(password + id));
  const hash = Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  localStorage.setItem(`marketxyn_pw_${id}`, hash);
  useAuthStore.getState().setUser(user);
  return user;
}

export async function login(username: string, password: string): Promise<AuthUser> {
  const id = `user_${username.toLowerCase()}`;
  const stored = localStorage.getItem(`marketxyn_pw_${id}`);
  if (!stored) throw new Error("User not found");
  const enc = new TextEncoder();
  const data = await crypto.subtle.digest("SHA-256", enc.encode(password + id));
  const hash = Array.from(new Uint8Array(data))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  if (hash !== stored) throw new Error("Invalid password");
  const user: AuthUser = { id, username };
  useAuthStore.getState().setUser(user);
  return user;
}
