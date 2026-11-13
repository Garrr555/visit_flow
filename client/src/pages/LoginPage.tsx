import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuthStore } from "../stores/auth.store";
import type { User } from "../types";
import LoginLeftSide from "../components/LoginLeftSide";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = {
  role?: string;
  title?: string;
  subtitle?: string;
};

export default function LoginPage({ role, title, subtitle }: Props) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string; user: User }>(
        "/auth/login",
        { email, password },
      );
      setAuth(data.user, data.token);
      navigate("/", { replace: true });
    } catch {
      setError("Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {title}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className=" ">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div className=" ">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  required
                  placeholder="****************"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-md text-sm font-semibold hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-orange-500/25 active:scale-[0.98] flex items-center justify-center"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
