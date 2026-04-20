'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, BookOpen, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export default function JournalPage({ params }: { params: { catId: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entryDate: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    tagInput: '',
  });
  const [selectedTag, setSelectedTag] = useState('');

  const [entries, setEntries] = useState<any[]>([]);
  const supabase = createClient();

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('cat_id', params.catId)
      .order('entry_date', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [params.catId]);

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from('journal_entries').insert({
      cat_id: params.catId,
      title: formData.title || null,
      content: formData.content,
      entry_date: formData.entryDate,
      tags: formData.tags.length > 0 ? formData.tags : null,
    });

    if (!error) {
      await fetchEntries();
      setOpen(false);
      setFormData({
        title: '',
        content: '',
        entryDate: new Date().toISOString().split('T')[0],
        tags: [],
        tagInput: '',
      });
    }

    setIsLoading(false);
  };

  const filteredEntries = selectedTag
    ? entries.filter((e) => e.tags?.includes(selectedTag))
    : entries;

  const uniqueTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href={`/dashboard/cats/${params.catId}`} className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Cat Profile
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Journal</h1>
            <p className="text-muted-foreground mt-2">Write notes and memories about your cat</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
                <DialogDescription>Write down your thoughts and memories</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryDate">Date</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Entry *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your thoughts, observations, or memories..."
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag..."
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:opacity-70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading || !formData.content}>
                    {isLoading ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tag Filter */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              All
            </Button>
            {uniqueTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}

        {/* Journal Entries */}
        {filteredEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No entries yet</h2>
            <p className="text-muted-foreground">Start writing to capture memories and moments with your cat</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry: any, i: number) => (
              <Card key={i} className="p-6 hover:border-primary transition-colors">
                <div className="mb-3">
                  {entry.title && <h3 className="text-xl font-bold">{entry.title}</h3>}
                  <p className="text-sm text-muted-foreground">{entry.entry_date}</p>
                </div>

                <p className="text-foreground line-clamp-4 mb-4">{entry.content}</p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
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
