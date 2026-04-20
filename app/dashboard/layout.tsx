import { createClient } from '@/lib/supabase/server';
import { SidebarWrapper } from '@/components/layout/sidebar-wrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName = 'User';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarWrapper userDisplayName={displayName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
