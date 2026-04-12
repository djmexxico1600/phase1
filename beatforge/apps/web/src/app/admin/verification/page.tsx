/**
 * @file src/app/admin/verification/page.tsx
 * @description Producer verification queue.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Verification Queue - BeatForge Admin',
  description: 'Review producer verification requests',
};

export default function VerificationPage() {
  // TODO: Fetch verification queue from database
  const queue = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Verification Queue</h1>
        <p className="text-muted-foreground">Review and approve producer verification requests</p>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold">No pending verifications</p>
            <p className="text-muted-foreground">All producers have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map((producer: any) => (
            <Card key={producer.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{producer.name}</p>
                    <p className="text-sm text-muted-foreground">{producer.email}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied {new Date(producer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
