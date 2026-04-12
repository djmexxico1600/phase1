/**
 * @file src/components/upload/UploadProgress.tsx
 * @description Upload progress indicator.
 */

'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';

interface UploadProgressProps {
  filename: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export function UploadProgress({
  filename,
  progress,
  status,
  error,
}: UploadProgressProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'uploading' && (
              <Upload className="w-4 h-4 text-primary animate-bounce" />
            )}
            {status === 'complete' && (
              <CheckCircle2 className="w-4 h-4 text-accent" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm font-semibold">{filename}</span>
          </div>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              status === 'error' ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </Card>
  );
}
