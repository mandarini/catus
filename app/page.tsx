'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Pill, Stethoscope, Image as ImageIcon, BookOpen, Smile, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Image src="/logo.png" alt="Catus" width={32} height={32} />
            <span>Catus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Track Your Cat's{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Health & Life
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about your cat—from vaccinations and vet visits to weight tracking, medications, and precious memories. All in one beautiful, simple app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <div className="font-semibold text-foreground">100% Free</div>
              <div>No hidden costs</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Secure</div>
              <div>Your data is yours</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Simple</div>
              <div>Intuitive design</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2>Everything You Need to Track</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for managing every aspect of your cat's wellbeing
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Heart,
              title: 'Weight Tracking',
              description: 'Monitor your cat\'s weight over time with beautiful charts and visual trends.',
            },
            {
              icon: Pill,
              title: 'Medications',
              description: 'Keep track of all prescriptions, dosages, and medication schedules.',
            },
            {
              icon: Activity,
              title: 'Vaccinations',
              description: 'Stay on top of vaccines with due date reminders and records.',
            },
            {
              icon: Stethoscope,
              title: 'Vet Visits',
              description: 'Log visits, diagnoses, treatments, and attach medical documents.',
            },
            {
              icon: Smile,
              title: 'Health Treatments',
              description: 'Track flea/tick prevention, deworming, and other treatments.',
            },
            {
              icon: BookOpen,
              title: 'Journal & Photos',
              description: 'Save memories, notes, and photos of your beloved companion.',
            },
            {
              icon: ImageIcon,
              title: 'Feeding History',
              description: 'Document diet changes and nutrition information in one place.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-smooth group"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-primary/20 p-8 sm:p-12 text-center space-y-6">
          <h2>Ready to Care for Your Cat?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join cat owners who trust Catus to keep track of everything their cats need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Get Started Now</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Already have an account?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground">
          <p>Catus • Track. Care. Remember.</p>
          <p className="text-xs mt-4">Made with care for cat lovers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
