'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
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

export default function FeedingPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    foodType: 'dry',
    brand: '',
    productName: '',
    portionSize: '',
    feedingSchedule: '',
    startedOn: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [feedingHistory, setFeedingHistory] = useState<any[]>([]);
  const supabase = createClient();

  const fetchFeedings = async () => {
    const { data, error } = await supabase
      .from('feeding')
      .select('*')
      .eq('cat_id', params.catId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFeedingHistory(data);
    }
  };

  useEffect(() => {
    fetchFeedings();
  }, [params.catId]);

  const currentFeeding = feedingHistory.find((f) => f.is_current);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Set all existing feeding records for this cat to not current
      await supabase
        .from('feeding')
        .update({ is_current: false })
        .eq('cat_id', params.catId);

      // Insert new feeding record
      const { error } = await supabase.from('feeding').insert({
        cat_id: params.catId,
        food_type: formData.foodType,
        brand: formData.brand || null,
        product_name: formData.productName || null,
        portion_size: formData.portionSize || null,
        feeding_schedule: formData.feedingSchedule || null,
        started_on: formData.startedOn || null,
        notes: formData.notes || null,
        is_current: true,
      });

      if (error) throw error;

      await fetchFeedings();
      setOpen(false);
      setFormData({
        foodType: 'dry',
        brand: '',
        productName: '',
        portionSize: '',
        feedingSchedule: '',
        startedOn: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      console.error('Failed to save feeding record:', err);
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-4xl font-bold">Feeding</h1>
            <p className="text-muted-foreground mt-2">Track your cat's diet and nutrition</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Feeding Record</DialogTitle>
                <DialogDescription>Record your cat's food and diet</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodType">Food Type *</Label>
                  <Select value={formData.foodType} onValueChange={(value) => setFormData({ ...formData, foodType: value })}>
                    <SelectTrigger id="foodType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="wet">Wet</SelectItem>
                      <SelectItem value="raw">Raw</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Fancy Feast"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product Name</Label>
                    <Input
                      id="product"
                      placeholder="Specific product"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portion">Portion Size</Label>
                    <Input
                      id="portion"
                      placeholder="e.g., 1/2 cup"
                      value={formData.portionSize}
                      onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Feeding Schedule</Label>
                    <Input
                      id="schedule"
                      placeholder="e.g., Twice daily"
                      value={formData.feedingSchedule}
                      onChange={(e) => setFormData({ ...formData, feedingSchedule: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="started">Started On</Label>
                  <Input
                    id="started"
                    type="date"
                    value={formData.startedOn}
                    onChange={(e) => setFormData({ ...formData, startedOn: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Dietary restrictions, allergies, etc."
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

        {/* Current Feeding */}
        {currentFeeding ? (
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <p className="text-muted-foreground mb-2">Current Diet</p>
            <h2 className="text-2xl font-bold mb-4">
              {currentFeeding.brand && currentFeeding.product_name
                ? `${currentFeeding.brand} - ${currentFeeding.product_name}`
                : currentFeeding.brand || 'Custom Food'}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-semibold capitalize">{currentFeeding.food_type}</p>
              </div>
              {currentFeeding.portion_size && (
                <div>
                  <p className="text-muted-foreground">Portion</p>
                  <p className="font-semibold">{currentFeeding.portion_size}</p>
                </div>
              )}
              {currentFeeding.feeding_schedule && (
                <div>
                  <p className="text-muted-foreground">Schedule</p>
                  <p className="font-semibold">{currentFeeding.feeding_schedule}</p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No current feeding record. Add one to get started.</p>
          </Card>
        )}

        {/* Feeding History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Feeding History</h2>
          {feedingHistory.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No feeding records yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {feedingHistory.map((feeding: any, i: number) => (
                <Card key={i} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {feeding.brand && feeding.product_name
                          ? `${feeding.brand} - ${feeding.product_name}`
                          : feeding.brand || 'Custom Food'}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">{feeding.food_type}</p>
                    </div>
                    {feeding.is_current && <Badge>Current</Badge>}
                  </div>
                  {feeding.notes && <p className="text-sm text-muted-foreground">{feeding.notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
