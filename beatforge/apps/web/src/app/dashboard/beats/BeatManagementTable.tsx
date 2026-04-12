/**
 * @file src/components/dashboard/BeatManagementTable.tsx
 * @description Table for managing producer's beats.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface Beat {
  id: string;
  title: string;
  coverArt: string;
  genre: string;
  status: 'draft' | 'published' | 'archived';
  playCount: number;
  sales: number;
  createdAt: Date;
}

interface BeatManagementTableProps {
  beats: Beat[];
}

export function BeatManagementTable({ beats }: BeatManagementTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-accent';
      case 'draft':
        return 'bg-amber-500';
      case 'archived':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">Beat</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Plays</th>
            <th className="text-left py-3 px-4 font-semibold">Sales</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {beats.map((beat) => (
            <tr key={beat.id} className="border-b hover:bg-secondary/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {beat.coverArt && (
                    <Image
                      src={beat.coverArt}
                      alt={beat.title}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{beat.title}</p>
                    <p className="text-xs text-muted-foreground">{beat.genre}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge className={getStatusColor(beat.status)}>
                  {beat.status}
                </Badge>
              </td>
              <td className="py-3 px-4">{beat.playCount}</td>
              <td className="py-3 px-4">{beat.sales}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
