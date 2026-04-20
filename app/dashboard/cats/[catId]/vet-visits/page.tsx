'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function VetVisitsPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    vetName: '',
    clinicName: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    cost: '',
    followUpDate: '',
    notes: '',
  });

  const visits: any[] = [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      setFormData({
        visitDate: new Date().toISOString().split('T')[0],
        vetName: '',
        clinicName: '',
        reason: '',
        diagnosis: '',
        treatment: '',
        cost: '',
        followUpDate: '',
        notes: '',
      });
    }, 1000);
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
            <h1 className="text-4xl font-bold">Vet Visits</h1>
            <p className="text-muted-foreground mt-2">Track veterinary appointments and records</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Log Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log Vet Visit</DialogTitle>
                <DialogDescription>Record a veterinary appointment</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Visit Date *</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vet">Vet Name</Label>
                    <Input
                      id="vet"
                      value={formData.vetName}
                      onChange={(e) => setFormData({ ...formData, vetName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic">Clinic Name</Label>
                    <Input
                      id="clinic"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Annual checkup"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Input
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Date</Label>
                  <Input
                    id="followUp"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes..."
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

        {visits.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No vet visits recorded yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {visits.map((visit: any, i: number) => (
              <Card key={i} className="p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{visit.reason}</h3>
                    <p className="text-sm text-muted-foreground">{visit.visitDate}</p>
                  </div>
                  {visit.cost && <p className="font-semibold">${visit.cost}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {visit.vetName && (
                    <div>
                      <p className="text-muted-foreground">Vet</p>
                      <p className="font-semibold">{visit.vetName}</p>
                    </div>
                  )}
                  {visit.clinicName && (
                    <div>
                      <p className="text-muted-foreground">Clinic</p>
                      <p className="font-semibold">{visit.clinicName}</p>
                    </div>
                  )}
                  {visit.diagnosis && (
                    <div>
                      <p className="text-muted-foreground">Diagnosis</p>
                      <p className="font-semibold">{visit.diagnosis}</p>
                    </div>
                  )}
                  {visit.treatment && (
                    <div>
                      <p className="text-muted-foreground">Treatment</p>
                      <p className="font-semibold">{visit.treatment}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
