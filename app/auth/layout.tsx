import { PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity">
        <PawPrint className="w-8 h-8 text-primary" />
        <span>Catus</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
