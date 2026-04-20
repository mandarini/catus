'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Heart, Pill, Calendar } from 'lucide-react';

export default function DashboardPage() {
  // TODO: Fetch user's cats from Supabase
  const cats: any[] = [];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Manage your cats' health and memories</p>
          </div>
        </div>

        {/* Cats Grid */}
        {cats.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4 max-w-md mx-auto">
              <div className="text-5xl">🐱</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">No cats yet</h2>
                <p className="text-muted-foreground mb-6">
                  Add your first cat to start tracking their health and keeping memories.
                </p>
              </div>
              <Link href="/dashboard/cats/new">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add Your First Cat
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Cats</h2>
              <Link href="/dashboard/cats/new">
                <Button size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Cat
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map((cat: any) => (
                <Link key={cat.id} href={`/dashboard/cats/${cat.id}`}>
                  <Card className="p-6 hover:border-primary transition-colors cursor-pointer group h-full">
                    <div className="space-y-4">
                      {/* Cat Avatar */}
                      {cat.photoUrl ? (
                        <img
                          src={cat.photoUrl}
                          alt={cat.name}
                          className="w-full h-48 rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center text-4xl group-hover:bg-muted/80 transition-colors">
                          🐱
                        </div>
                      )}

                      {/* Info */}
                      <div>
                        <h3 className="text-xl font-bold">{cat.name}</h3>
                        {cat.breed && <p className="text-sm text-muted-foreground">{cat.breed}</p>}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 rounded bg-muted">
                          <Heart className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="text-xs font-semibold">--</p>
                          <p className="text-xs text-muted-foreground">Weight</p>
                        </div>
                        <div className="text-center p-2 rounded bg-muted">
                          <Pill className="w-4 h-4 mx-auto mb-1 text-secondary" />
                          <p className="text-xs font-semibold">--</p>
                          <p className="text-xs text-muted-foreground">Vaccines</p>
                        </div>
                        <div className="text-center p-2 rounded bg-muted">
                          <Calendar className="w-4 h-4 mx-auto mb-1 text-accent" />
                          <p className="text-xs font-semibold">--</p>
                          <p className="text-xs text-muted-foreground">Vet Visit</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
