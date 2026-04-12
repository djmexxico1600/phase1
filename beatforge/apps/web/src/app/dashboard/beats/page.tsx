/**
 * @file src/app/dashboard/beats/page.tsx
 * @description Beat management page with table.
 */

import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BeatManagementTable } from '@/components/dashboard/BeatManagementTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Beats - BeatForge Producer',
  description: 'Manage your published beats',
};

export default function BeatsPage() {
  // TODO: Fetch beats from database
  const beats = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Beats</h1>
          <p className="text-muted-foreground">Manage and publish your beats</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/beats/upload">
            <Plus className="w-4 h-4 mr-2" />
            Upload New Beat
          </Link>
        </Button>
      </div>

      {/* Beats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Beats</CardTitle>
        </CardHeader>
        <CardContent>
          {beats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No beats uploaded yet</p>
              <Button asChild>
                <Link href="/dashboard/beats/upload">
                  Upload Your First Beat
                </Link>
              </Button>
            </div>
          ) : (
            <BeatManagementTable beats={beats} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
