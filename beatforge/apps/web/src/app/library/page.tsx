/**
 * @file src/app/library/page.tsx
 * @description Library page showing purchased beats.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Library - BeatForge',
  description: 'Download and manage your purchased beats',
};

export default function LibraryPage() {
  // TODO: Fetch purchased beats from database
  const purchasedBeats = [];
  const subscriptions = [];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">
            Download and manage your purchased beats
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="beats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="beats">
              <Music className="w-4 h-4 mr-2" />
              Purchased Beats
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Purchased Beats */}
          <TabsContent value="beats">
            {purchasedBeats.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No beats purchased yet</p>
                  <p className="text-muted-foreground mb-6">
                    Explore the marketplace to find and purchase beats
                  </p>
                  <Button asChild>
                    <Link href="/marketplace/beats">
                      Browse Beats
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedBeats.map((beat: any) => (
                  <Card key={beat.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{beat.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>License: {beat.license}</p>
                        <p>Purchased: {new Date(beat.purchasedAt).toLocaleDateString()}</p>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={beat.downloadUrl}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Subscriptions */}
          <TabsContent value="subscriptions">
            {subscriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-lg font-semibold mb-2">No active subscriptions</p>
                  <p className="text-muted-foreground mb-6">
                    Subscribe to get unlimited downloads
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub: any) => (
                  <Card key={sub.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{sub.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Renews on {new Date(sub.renewsAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline">
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
