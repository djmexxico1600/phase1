/**
 * @file src/components/upload/AudioDropzone.tsx
 * @description Audio file dropzone with validation.
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'];

interface AudioDropzoneProps {
  onFile: (file: File) => void;
  isLoading?: boolean;
}

export function AudioDropzone({ onFile, isLoading }: AudioDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file format. Please use MP3, WAV, OGG, AAC, or FLAC.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 200MB.');
      return false;
    }

    setError(null);
    return true;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFile(file);
        }
      }
    },
    [onFile, validateFile]
  );

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          onFile(file);
        }
      }
    },
    [onFile, validateFile]
  );

  return (
    <div className="space-y-4">
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-8 border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-muted-foreground'
        }`}
      >
        <label className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold">Drop your beat here or click to upload</p>
            <p className="text-xs text-muted-foreground">MP3, WAV, OGG, AAC, FLAC up to 200MB</p>
          </div>
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleSelectFile}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
