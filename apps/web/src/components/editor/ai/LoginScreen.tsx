import { useState } from "react";
import { useAuthStore } from "@openreel/auth-and-storage";

export function LoginScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, requestPasswordReset } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const ok = await login(username, password);
        if (!ok) throw new Error("Invalid username or password");
        onSuccess?.();
      } else if (mode === "register") {
        await register(username, email, password);
        onSuccess?.();
      } else {
        await requestPasswordReset(email);
        alert("If that email exists, a reset token was generated (check console for demo)");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">OpenReel</h1>

        <div className="flex gap-2 mb-6 text-sm">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded ${mode === "login" ? "bg-blue-600" : "bg-gray-800"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded ${mode === "register" ? "bg-blue-600" : "bg-gray-800"}`}
          >
            Register
          </button>
          <button
            onClick={() => setMode("reset")}
            className={`flex-1 py-2 rounded ${mode === "reset" ? "bg-blue-600" : "bg-gray-800"}`}
          >
            Reset
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== "reset" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          )}

          {(mode === "register" || mode === "reset") && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          )}

          {mode !== "reset" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium"
          >
            {mode === "login" ? "Login" : mode === "register" ? "Create Account" : "Send Reset"}
          </button>
        </form>
      </div>
    </div>
  );
}
