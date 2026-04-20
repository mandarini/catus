'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Chrome as Home, Settings, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userDisplayName?: string;
  onLogout?: () => void;
}

export function Sidebar({ userDisplayName = 'User', onLogout }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="px-6 py-6 border-b border-border flex items-center gap-3 hover:bg-muted transition-colors">
        <PawPrint className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold">Catus</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                size="sm"
                className={cn('w-full justify-start gap-3', isActive(item.href) && 'bg-primary text-primary-foreground')}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <div className="pt-4 border-t border-border">
          <Link href="/dashboard/cats/new">
            <Button variant="outline" size="sm" className="w-full justify-start gap-3">
              <Plus className="w-5 h-5" />
              Add a Cat
            </Button>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="px-2 text-sm">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="font-semibold truncate">{userDisplayName}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start gap-3" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
