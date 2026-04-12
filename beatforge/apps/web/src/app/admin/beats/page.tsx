/**
 * @file src/app/admin/beats/page.tsx
 * @description Beat moderation page.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Beat Moderation - BeatForge Admin',
  description: 'Review and moderate beats',
};

export default function BeatsModeration() {
  // TODO: Fetch reported beats from database
  const reports = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Beat Moderation</h1>
        <p className="text-muted-foreground">Review reported beats and violations</p>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold">No reported beats</p>
            <p className="text-muted-foreground">All beats comply with guidelines</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{report.beatTitle}</p>
                    <p className="text-sm text-muted-foreground">By {report.producer}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Reported: {report.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {report.reportCount} reports
                    </Badge>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      Remove
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
