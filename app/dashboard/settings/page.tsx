'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Save to Supabase
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    // TODO: Logout from Supabase
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="opacity-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>

        {/* Preferences Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Preferences</h2>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unit">Weight Unit</Label>
              <Select value={weightUnit} onValueChange={setWeightUnit}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Used throughout the app for weight tracking</p>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </form>
        </Card>

        {/* Connected Accounts */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Connected Accounts</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Google Account</p>
                <p className="text-sm text-muted-foreground">user@gmail.com</p>
              </div>
              <Badge variant="default">Connected</Badge>
            </div>
            <p className="text-sm text-muted-foreground">You can use your Google account to sign in</p>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 border-destructive/30 bg-destructive/5">
          <h2 className="text-2xl font-bold mb-6 text-destructive">Danger Zone</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full gap-2" onClick={handleLogout} disabled={isLoading}>
              <LogOut className="w-5 h-5" />
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data including cats, health records, and memories will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Type "delete my account" to confirm:</p>
                  <Input placeholder="delete my account" />
                </div>
                <div className="flex gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Permanently</AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>
    </div>
  );
}
