'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Image as ImageIcon, X } from 'lucide-react';
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

export default function PhotosPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // TODO: Fetch photos from Supabase
  const photos: any[] = [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Upload to Supabase Storage
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      setSelectedFiles([]);
      setCaption('');
      setDate(new Date().toISOString().split('T')[0]);
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Photos</h1>
            <p className="text-muted-foreground mt-2">Cherish memories of your feline friend</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Upload Photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Photos</DialogTitle>
                <DialogDescription>Add photos of your cat</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photos">Select Photos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="photos" className="cursor-pointer block">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-semibold">Click to select photos</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold">{selectedFiles.length} file(s) selected</p>
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFiles(selectedFiles.filter((_, index) => index !== i))
                            }
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date Taken</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption (optional)</Label>
                  <Input
                    id="caption"
                    placeholder="Add a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading || selectedFiles.length === 0}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Gallery */}
        {photos.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No photos yet</h2>
            <p className="text-muted-foreground mb-6">Upload photos to create a gallery of your cat's memories</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo: any, i: number) => (
              <Card key={i} className="overflow-hidden hover:border-primary transition-colors group cursor-pointer">
                <div className="relative overflow-hidden bg-muted h-48">
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Cat photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-sm font-semibold">{photo.caption}</p>
                    {photo.takenAt && <p className="text-xs text-muted-foreground">{photo.takenAt}</p>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
