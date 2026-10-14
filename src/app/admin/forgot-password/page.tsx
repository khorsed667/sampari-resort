"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Compass,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setResetUrl(null);

    if (!email.trim()) {
      setError("Please enter your administrator email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to process request. Please try again.");
        return;
      }

      setSuccessMessage(
        data.message ||
          "If an account is associated with this email, a reset link has been prepared."
      );
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-12 selection:bg-sand/30 selection:text-forest">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[45rem] -translate-x-1/2 rounded-full bg-forest/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[25rem] w-[35rem] rounded-full bg-sand/[0.08] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Main Card */}
        <div className="rounded-[2.2rem] border border-forest/10 bg-mist p-8 shadow-2xl shadow-forest/10 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-sand shadow-md shadow-forest/20">
              <KeyRound className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-sage uppercase">
              Sampari Security
            </p>

            <h1 className="mt-1 font-serif-display text-2xl text-forest md:text-3xl">
              Reset Password
            </h1>

            <p className="mt-1.5 text-xs text-mountain">
              Enter your registered administrator email to receive reset instructions.
            </p>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-brown/20 bg-brown/5 p-3.5 text-xs text-brown animate-fade-up">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brown" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Callout */}
          {successMessage && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-forest/20 bg-forest/5 p-4 text-xs text-forest animate-fade-up">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <span>{successMessage}</span>
              </div>

              {resetUrl && (
                <div className="mt-2 border-t border-forest/10 pt-3">
                  <p className="text-[11px] text-mountain">
                    Your secure recovery link is ready:
                  </p>
                  <Link
                    href={resetUrl}
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-mist shadow-sm transition-colors hover:bg-mountain"
                  >
                    <span>Proceed to Set New Password</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {!resetUrl && (
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

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium tracking-wide text-mist shadow-lg shadow-forest/15 transition-all duration-300 hover:bg-mountain hover:shadow-xl disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-sand" />
                    <span>Generating Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Reset Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to sign in */}
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
