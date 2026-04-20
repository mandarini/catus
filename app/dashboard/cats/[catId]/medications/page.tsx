'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pill } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MedicationsPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    prescribedBy: '',
    reason: '',
    notes: '',
  });

  const currentMeds: any[] = [];
  const pastMeds: any[] = [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        prescribedBy: '',
        reason: '',
        notes: '',
      });
    }, 1000);
  };

  const MedicationCard = ({ med }: { med: any }) => (
    <Card className="p-6 hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{med.name}</h3>
          <p className="text-sm text-muted-foreground">{med.dosage}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        {med.frequency && (
          <div>
            <p className="text-muted-foreground">Frequency</p>
            <p className="font-semibold">{med.frequency}</p>
          </div>
        )}
        {med.reason && (
          <div>
            <p className="text-muted-foreground">Reason</p>
            <p className="font-semibold">{med.reason}</p>
          </div>
        )}
        {med.prescribedBy && (
          <div>
            <p className="text-muted-foreground">Prescribed by</p>
            <p className="font-semibold">{med.prescribedBy}</p>
          </div>
        )}
        {med.startDate && (
          <div>
            <p className="text-muted-foreground">Started</p>
            <p className="font-semibold">{med.startDate}</p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Medications</h1>
            <p className="text-muted-foreground mt-2">Track prescriptions and medications</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Medication</DialogTitle>
                <DialogDescription>Record a new medication</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medication Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 5mg"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      placeholder="e.g., Twice daily"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (if applicable)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescribedBy">Prescribed By</Label>
                  <Input
                    id="prescribedBy"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  />
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

        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4 mt-6">
            {currentMeds.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No current medications</p>
              </Card>
            ) : (
              currentMeds.map((med: any, i: number) => <MedicationCard key={i} med={med} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {pastMeds.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <p>No past medications</p>
              </Card>
            ) : (
              pastMeds.map((med: any, i: number) => <MedicationCard key={i} med={med} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
