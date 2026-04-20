'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement Supabase password reset
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <Card className="p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground">
            Check your email and follow the link to reset your password. The link expires in 1 hour.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a link to reset your password
        </p>
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

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending link...' : 'Send Reset Link'}
        </Button>
      </form>

      <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Link>
    </Card>
  );
}
