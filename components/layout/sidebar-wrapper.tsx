'use client';

import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './sidebar';

interface SidebarWrapperProps {
  userDisplayName: string;
}

export function SidebarWrapper({ userDisplayName }: SidebarWrapperProps) {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return <Sidebar userDisplayName={userDisplayName} onLogout={handleLogout} />;
}
