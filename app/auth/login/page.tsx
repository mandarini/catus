'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your Catus account</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Google OAuth Button */}
      <Button variant="outline" size="lg" className="w-full gap-2" disabled={isLoading} onClick={handleGoogleLogin}>
        <Chrome className="w-5 h-5" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
          Sign up
        </Link>
      </div>
    </Card>
  );
}
