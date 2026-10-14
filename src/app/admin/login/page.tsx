"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Compass,
} from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <Loader2 className="h-6 w-6 animate-spin text-forest" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/requests";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials. Please verify and try again.");
        return;
      }

      // Successful login -> Redirect to requested callbackUrl or default dashboard
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Login request failed:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-12 selection:bg-sand/30 selection:text-forest">
      {/* Subtle organic background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[45rem] -translate-x-1/2 rounded-full bg-forest/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[25rem] w-[35rem] rounded-full bg-sand/[0.08] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Classic Header Card */}
        <div className="rounded-[2.2rem] border border-forest/10 bg-mist p-8 shadow-2xl shadow-forest/10 md:p-10">
          {/* Brand mark */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand shadow-md shadow-forest/20">
              <Compass className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-sage uppercase">
              Sajek Valley • Bangladesh
            </p>

            <h1 className="mt-1 font-serif-display text-2xl text-forest md:text-3xl">
              Sampari Admin
            </h1>

            <p className="mt-1.5 text-xs text-mountain">
              Sign in to manage resort bookings, room rates, and analytics.
            </p>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-brown/20 bg-brown/5 p-3.5 text-xs text-brown animate-fade-up">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brown" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
                <Mail className="h-3.5 w-3.5" />
                Administrator Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sampari.com"
                className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm text-forest outline-none transition-all placeholder:text-sage/70 focus:border-forest/40 focus:ring-2 focus:ring-forest/5"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
                  <Lock className="h-3.5 w-3.5" />
                  Password
                </span>
                <Link
                  href="/admin/forgot-password"
                  className="text-[11px] text-sage transition-colors hover:text-forest hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 pr-11 text-sm text-forest outline-none transition-all placeholder:text-sage/70 focus:border-forest/40 focus:ring-2 focus:ring-forest/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage transition-colors hover:text-forest"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium tracking-wide text-mist shadow-lg shadow-forest/15 transition-all duration-300 hover:bg-mountain hover:shadow-xl disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-sand" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider & Signup Link */}
          <div className="mt-8 border-t border-forest/10 pt-6 text-center">
            <p className="text-xs text-mountain">
              Need a new administrator account?{" "}
              <Link
                href="/admin/signup"
                className="font-semibold text-forest underline underline-offset-4 transition-colors hover:text-brown"
              >
                Create Account
              </Link>
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-sage transition-colors hover:text-forest"
            >
              <span>← Back to Sampari Resort Website</span>
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-sage">
          <ShieldCheck className="h-3.5 w-3.5 text-sage" />
          <span>Secured with cryptographic session protection & MongoDB Atlas</span>
        </div>
      </div>
    </div>
  );
}
