'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User, Chrome, Check } from 'lucide-react';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    // TODO: Implement Supabase auth
    setTimeout(() => setIsLoading(false), 1000);
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <Card className="p-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">Start tracking your cat's health today</p>
      </div>

      {/* Google OAuth Button */}
      <Button variant="outline" size="lg" className="w-full gap-2" disabled={isLoading}>
        <Chrome className="w-5 h-5" />
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="password">Password</Label>
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
          <p className="text-xs text-muted-foreground">At least 8 characters recommended</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordsMatch && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
            )}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading || !passwordsMatch}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to our Terms. We'll never share your data.
      </p>
    </Card>
  );
}
