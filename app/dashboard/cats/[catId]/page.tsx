'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard as Edit, Heart, Pill, Activity, Stethoscope, Smile, BookOpen, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function CatProfilePage({ params }: { params: { catId: string } }) {
  // TODO: Fetch cat data from Supabase
  const cat = {
    id: params.catId,
    name: 'Whiskers',
    breed: 'Bengal',
    gender: 'Male',
    dateOfBirth: '2020-05-15',
    isNeutered: true,
    livingFitation: 'indoor',
    photoUrl: null,
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const sections = [
    { label: 'Weight', href: `/dashboard/cats/${params.catId}/weight`, icon: Heart },
    { label: 'Vaccines', href: `/dashboard/cats/${params.catId}/vaccines`, icon: Activity },
    { label: 'Vet Visits', href: `/dashboard/cats/${params.catId}/vet-visits`, icon: Stethoscope },
    { label: 'Medications', href: `/dashboard/cats/${params.catId}/medications`, icon: Pill },
    { label: 'Treatments', href: `/dashboard/cats/${params.catId}/treatments`, icon: Smile },
    { label: 'Feeding', href: `/dashboard/cats/${params.catId}/feeding`, icon: Smile },
    { label: 'Photos', href: `/dashboard/cats/${params.catId}/photos`, icon: ImageIcon },
    { label: 'Journal', href: `/dashboard/cats/${params.catId}/journal`, icon: BookOpen },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Cat Hero */}
        <Card className="overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"></div>
          <div className="relative px-8 pb-8">
            <div className="flex items-end gap-6 -mt-24 mb-6">
              {cat.photoUrl ? (
                <img
                  src={cat.photoUrl}
                  alt={cat.name}
                  className="w-32 h-32 rounded-lg object-cover border-4 border-card"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center text-6xl border-4 border-card">
                  🐱
                </div>
              )}

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold">{cat.name}</h1>
                  <Link href={`/dashboard/cats/${params.catId}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
                {cat.breed && <p className="text-lg text-muted-foreground">{cat.breed}</p>}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age</p>
                <p className="font-semibold">{calculateAge(cat.dateOfBirth)} years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="font-semibold capitalize">{cat.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge variant={cat.isNeutered ? 'default' : 'outline'}>
                  {cat.isNeutered ? 'Neutered' : 'Not neutered'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Living</p>
                <p className="font-semibold capitalize">{cat.livingFitation}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Health & Life Tracking</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.label} href={section.href}>
                  <Card className="p-4 hover:border-primary hover:bg-muted transition-colors cursor-pointer h-full flex flex-col items-center justify-center text-center gap-3">
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="font-semibold">{section.label}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-4 pb-4 border-b border-border last:border-0">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold">No activity yet</p>
                <p className="text-sm text-muted-foreground">Start tracking your cat's health and memories</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
