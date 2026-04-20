'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
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
import { Badge } from '@/components/ui/badge';

export default function WeightPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [weightLogs, setWeightLogs] = useState<any[]>([]);

  const supabase = createClient();

  const fetchWeightLogs = async () => {
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('cat_id', params.catId)
      .order('recorded_at', { ascending: false });

    if (!error && data) {
      setWeightLogs(data);
    }
  };

  useEffect(() => {
    fetchWeightLogs();
  }, [params.catId]);

  const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight_kg : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('weight_logs').insert({
      cat_id: params.catId,
      weight_kg: parseFloat(weight),
      recorded_at: date,
      notes: notes || null,
    });

    if (!error) {
      await fetchWeightLogs();
      setOpen(false);
      setWeight('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }

    setIsLoading(false);
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
            <h1 className="text-4xl font-bold">Weight Tracking</h1>
            <p className="text-muted-foreground mt-2">Monitor your cat's weight over time</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Log Weight
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Weight Entry</DialogTitle>
                <DialogDescription>Record your cat's weight measurement</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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

        {/* Current Weight Card */}
        {currentWeight && (
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-muted-foreground mb-2">Current Weight</p>
                <div className="text-5xl font-bold">{currentWeight} kg</div>
              </div>
              <TrendingUp className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>
        )}

        {/* Chart Placeholder */}
        <Card className="p-12 text-center">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg font-semibold">Weight Chart</p>
            <p>Chart visualization will appear here once you add weight entries</p>
          </div>
        </Card>

        {/* Weight Log List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Weight History</h2>
          {weightLogs.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No weight entries yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {weightLogs.map((log: any) => (
                <Card key={log.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{log.weight_kg} kg</p>
                    <p className="text-sm text-muted-foreground">{log.recorded_at}</p>
                  </div>
                  {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
