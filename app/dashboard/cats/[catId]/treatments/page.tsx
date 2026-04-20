'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Smile } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TreatmentsPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    treatmentType: 'flea_tick',
    productName: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    notes: '',
  });

  const [treatments, setTreatments] = useState<any[]>([]);
  const supabase = createClient();

  const fetchTreatments = async () => {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('cat_id', params.catId)
      .order('date_administered', { ascending: false });
    setTreatments(data ?? []);
  };

  useEffect(() => {
    fetchTreatments();
  }, [params.catId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from('treatments').insert({
      cat_id: params.catId,
      treatment_type: formData.treatmentType,
      product_name: formData.productName,
      date_administered: formData.dateAdministered,
      next_due_date: formData.nextDueDate || null,
      notes: formData.notes || null,
    });
    setIsLoading(false);
    if (!error) {
      await fetchTreatments();
      setOpen(false);
      setFormData({
        treatmentType: 'flea_tick',
        productName: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        notes: '',
      });
    }
  };

  const treatmentTypeLabels: Record<string, string> = {
    flea_tick: 'Flea & Tick Prevention',
    deworming: 'Deworming',
    other: 'Other',
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
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Treatments</h1>
            <p className="text-muted-foreground mt-2">Preventive treatments like flea/tick and deworming</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Add Treatment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Treatment</DialogTitle>
                <DialogDescription>Record a preventive treatment</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Treatment Type *</Label>
                  <Select value={formData.treatmentType} onValueChange={(value) => setFormData({ ...formData, treatmentType: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flea_tick">Flea & Tick Prevention</SelectItem>
                      <SelectItem value="deworming">Deworming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product Name *</Label>
                  <Input
                    id="product"
                    placeholder="e.g., Frontline Plus"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateAdministered">Date Applied *</Label>
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
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

        {treatments.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Smile className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No treatments recorded yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {treatments.map((treatment: any, i: number) => {
              const status = getStatus(treatment.next_due_date);
              return (
                <Card key={treatment.id ?? i} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{treatment.product_name}</h3>
                      <p className="text-sm text-muted-foreground">{treatmentTypeLabels[treatment.treatment_type]}</p>
                    </div>
                    <Badge variant={status.variant as any}>{status.label}</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Applied</p>
                      <p className="font-semibold">{treatment.date_administered}</p>
                    </div>
                    {treatment.next_due_date && (
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-semibold">{treatment.next_due_date}</p>
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
