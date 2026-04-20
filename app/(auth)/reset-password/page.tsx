'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Mail, CircleAlert as AlertCircle, CircleCheck as CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-amber-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Catus</span>
          </Link>
        </div>

        <div className="rounded-2xl border bg-card shadow-lg shadow-black/5 p-8">
          {success ? (
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground mb-1">Reset your password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-md shadow-primary/20"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
