'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Cat {
  id: string;
  name: string;
  photoUrl?: string;
}

interface CatSwitcherProps {
  currentCatId?: string;
  currentCatName?: string;
  cats?: Cat[];
}

export function CatSwitcher({ currentCatId, currentCatName = 'Select a cat', cats = [] }: CatSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-w-xs">
          <div className="truncate">{currentCatName}</div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Your Cats</div>
        {cats.length === 0 ? (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">No cats yet</div>
        ) : (
          cats.map((cat) => (
            <Link key={cat.id} href={`/dashboard/cats/${cat.id}`}>
              <DropdownMenuItem>
                <div className="flex items-center gap-2 w-full">
                  {cat.photoUrl ? (
                    <img src={cat.photoUrl} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{cat.name}</span>
                  {cat.id === currentCatId && <span className="ml-auto text-primary">✓</span>}
                </div>
              </DropdownMenuItem>
            </Link>
          ))
        )}
        <DropdownMenuSeparator />
        <Link href="/dashboard/cats/new">
          <DropdownMenuItem>
            <Plus className="w-4 h-4 mr-2" />
            Add a New Cat
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
