"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <Loader2 className="h-6 w-6 animate-spin text-forest" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update password. Link may have expired.");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Reset password failed:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-12 selection:bg-sand/30 selection:text-forest">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[45rem] -translate-x-1/2 rounded-full bg-forest/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[25rem] w-[35rem] rounded-full bg-sand/[0.08] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="rounded-[2.2rem] border border-forest/10 bg-mist p-8 shadow-2xl shadow-forest/10 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand shadow-md shadow-forest/20">
              <KeyRound className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-sage uppercase">
              Sampari Security
            </p>

            <h1 className="mt-1 font-serif-display text-2xl text-forest md:text-3xl">
              Set New Password
            </h1>

            <p className="mt-1.5 text-xs text-mountain">
              Choose a strong, secure password for your administrator account.
            </p>
          </div>

          {!token && (
            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-brown/20 bg-brown/5 p-4 text-xs text-brown">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brown" />
                <span>
                  No recovery token was found in the link. Please request a new password reset link.
                </span>
              </div>
              <Link
                href="/admin/forgot-password"
                className="mt-2 font-semibold underline underline-offset-4"
              >
                Go to Forgot Password Page →
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-brown/20 bg-brown/5 p-3.5 text-xs text-brown animate-fade-up">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brown" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="mt-6 flex flex-col gap-4 text-center animate-fade-up">
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-forest/20 bg-forest/5 p-5 text-forest">
                <CheckCircle2 className="h-8 w-8 text-forest" />
                <h3 className="font-serif-display text-lg">Password Updated!</h3>
                <p className="text-xs text-mountain">
                  Your administrator password has been updated in MongoDB Atlas. You can now sign in with your new credentials.
                </p>
              </div>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-mist shadow-lg shadow-forest/15 hover:bg-mountain"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            token && (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
                    <Lock className="h-3.5 w-3.5" />
                    New Password (min. 6 characters)
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Confirm New Password
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm text-forest outline-none transition-all placeholder:text-sage/70 focus:border-forest/40 focus:ring-2 focus:ring-forest/5"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium tracking-wide text-mist shadow-lg shadow-forest/15 transition-all duration-300 hover:bg-mountain hover:shadow-xl disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-sand" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )
          )}

          <div className="mt-8 border-t border-forest/10 pt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-mountain transition-colors hover:text-forest"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
