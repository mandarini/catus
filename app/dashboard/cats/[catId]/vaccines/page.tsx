'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function VaccinesPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    administeredBy: '',
  });

  const [vaccines, setVaccines] = useState<any[]>([]);
  const supabase = createClient();

  const fetchVaccines = async () => {
    const { data, error } = await supabase
      .from('vaccinations')
      .select('*')
      .eq('cat_id', params.catId)
      .order('date_administered', { ascending: false });

    if (!error && data) {
      setVaccines(data);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, [params.catId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('vaccinations').insert({
      cat_id: params.catId,
      vaccine_name: formData.vaccineName,
      date_administered: formData.dateAdministered,
      next_due_date: formData.nextDueDate || null,
      administered_by: formData.administeredBy || null,
    });

    if (!error) {
      await fetchVaccines();
      setOpen(false);
      setFormData({
        vaccineName: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        administeredBy: '',
      });
    }

    setIsLoading(false);
  };

  const getStatus = (nextDueDate?: string) => {
    if (!nextDueDate) return { label: 'No due date', variant: 'secondary' };
    const today = new Date();
    const due = new Date(nextDueDate);
    const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return { label: 'Overdue', variant: 'destructive' };
    if (daysUntilDue < 30) return { label: 'Due soon', variant: 'warning' };
    return { label: 'Up to date', variant: 'default' };
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Vaccination Records</h1>
            <p className="text-muted-foreground mt-2">Keep track of your cat's vaccinations and due dates</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vaccination Record</DialogTitle>
                <DialogDescription>Record a new vaccination</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccine">Vaccine Name *</Label>
                  <Input
                    id="vaccine"
                    placeholder="e.g., FVRCP, Rabies, FeLV"
                    value={formData.vaccineName}
                    onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateAdministered">Date Administered</Label>
                    <Input
                      id="dateAdministered"
                      type="date"
                      value={formData.dateAdministered}
                      onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextDue">Next Due Date</Label>
                    <Input
                      id="nextDue"
                      type="date"
                      value={formData.nextDueDate}
                      onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vet">Administered By (Vet Name)</Label>
                  <Input
                    id="vet"
                    placeholder="Vet's name"
                    value={formData.administeredBy}
                    onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vaccines List */}
        {vaccines.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No vaccination records yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {vaccines.map((vaccine: any, i: number) => {
              const status = getStatus(vaccine.next_due_date);
              return (
                <Card key={vaccine.id ?? i} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{vaccine.vaccine_name}</h3>
                      <p className="text-sm text-muted-foreground">{vaccine.date_administered}</p>
                    </div>
                    <Badge variant={status.variant as any}>{status.label}</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    {vaccine.administered_by && (
                      <div>
                        <p className="text-muted-foreground">Vet</p>
                        <p className="font-semibold">{vaccine.administered_by}</p>
                      </div>
                    )}
                    {vaccine.next_due_date && (
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-semibold">{vaccine.next_due_date}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
