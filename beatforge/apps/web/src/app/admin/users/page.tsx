/**
 * @file src/app/admin/users/page.tsx
 * @description User management page.
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'User Management - BeatForge Admin',
  description: 'Manage platform users',
};

export default function UserManagement() {
  // TODO: Fetch users from database
  const users = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage platform users</p>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold">Loading users...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">User</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-secondary/50">
                  <td className="py-3 px-4 font-semibold">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.blocked ? 'destructive' : 'default'}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="outline" className="mr-2">
                      View
                    </Button>
                    {!user.blocked && (
                      <Button size="sm" variant="destructive">
                        Block
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
