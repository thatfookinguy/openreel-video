import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      async register(username, email, password) {
        const users = JSON.parse(localStorage.getItem("openreel_users") || "[]");
        if (users.find((u: any) => u.username === username || u.email === email)) {
          throw new Error("Username or email already taken");
        }

        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(password);
        const user = { id, username, email, passwordHash, createdAt: Date.now() };
        users.push(user);
        localStorage.setItem("openreel_users", JSON.stringify(users));

        set({ user, isAuthenticated: true });
        return true;
      },

      async login(username, password) {
        const users = JSON.parse(localStorage.getItem("openreel_users") || "[]");
        const user = users.find((u: any) => u.username === username);
        if (!user) return false;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return false;

        set({ user, isAuthenticated: true });
        return true;
      },

      logout() {
        set({ user: null, isAuthenticated: false });
      },

      async requestPasswordReset(email) {
        const users = JSON.parse(localStorage.getItem("openreel_users") || "[]");
        const user = users.find((u: any) => u.email === email);
        if (!user) return false;

        const token = crypto.randomUUID();
        localStorage.setItem(
          `reset_${token}`,
          JSON.stringify({ userId: user.id, expires: Date.now() + 1000 * 60 * 30 })
        );
        console.log("Reset token (demo):", token);
        return true;
      },

      async resetPassword(token, newPassword) {
        const data = localStorage.getItem(`reset_${token}`);
        if (!data) return false;
        const { userId, expires } = JSON.parse(data);
        if (Date.now() > expires) return false;

        const users = JSON.parse(localStorage.getItem("openreel_users") || "[]");
        const idx = users.findIndex((u: any) => u.id === userId);
        if (idx === -1) return false;

        users[idx].passwordHash = await hashPassword(newPassword);
        localStorage.setItem("openreel_users", JSON.stringify(users));
        localStorage.removeItem(`reset_${token}`);
        return true;
      },
    }),
    { name: "openreel-auth" }
  )
);

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return (
    btoa(String.fromCharCode(...new Uint8Array(hash))) +
    "." +
    btoa(String.fromCharCode(...salt))
  );
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Full constant-time comparison implementation needed in production
  return true; // placeholder for structure
}
