'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

export default function EditCatPage({ params }: { params: { catId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    colorMarkings: '',
    gender: 'unknown',
    dateOfBirth: '',
    isNeutered: false,
    adoptionDate: '',
    livingSituation: 'indoor',
  });

  useEffect(() => {
    async function fetchCat() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .eq('id', params.catId)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setFormData({
          name: data.name,
          breed: data.breed ?? '',
          colorMarkings: data.color_markings ?? '',
          gender: data.gender,
          dateOfBirth: data.date_of_birth ?? '',
          isNeutered: data.is_neutered,
          adoptionDate: data.adoption_date ?? '',
          livingSituation: data.living_situation,
        });
      }
      setIsFetching(false);
    }

    fetchCat();
  }, [params.catId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from('cats')
      .update({
        name: formData.name,
        breed: formData.breed || null,
        color_markings: formData.colorMarkings || null,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth || null,
        is_neutered: formData.isNeutered,
        adoption_date: formData.adoptionDate || null,
        living_situation: formData.livingSituation,
      })
      .eq('id', params.catId);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push(`/dashboard/cats/${params.catId}`);
    }
  };

  if (isFetching) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading cat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-bold">Edit {formData.name}</h1>
          <p className="text-muted-foreground mt-2">Update your cat's information</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorMarkings">Color & Markings</Label>
                <Input
                  id="colorMarkings"
                  value={formData.colorMarkings}
                  onChange={(e) => setFormData({ ...formData, colorMarkings: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Health & Living */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold">Health & Living</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neutered">Neutered/Spayed?</Label>
                  <Select
                    value={formData.isNeutered ? 'yes' : 'no'}
                    onValueChange={(value) => setFormData({ ...formData, isNeutered: value === 'yes' })}
                  >
                    <SelectTrigger id="neutered">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="living">Living Situation</Label>
                  <Select value={formData.livingSituation} onValueChange={(value) => setFormData({ ...formData, livingSituation: value })}>
                    <SelectTrigger id="living">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor only</SelectItem>
                      <SelectItem value="outdoor">Outdoor only</SelectItem>
                      <SelectItem value="both">Indoor/Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adoptionDate">Adoption Date</Label>
                <Input
                  id="adoptionDate"
                  type="date"
                  value={formData.adoptionDate}
                  onChange={(e) => setFormData({ ...formData, adoptionDate: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Link href={`/dashboard/cats/${params.catId}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
