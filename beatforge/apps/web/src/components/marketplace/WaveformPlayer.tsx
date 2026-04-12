/**
 * @file src/components/marketplace/WaveformPlayer.tsx
 * @description Waveform player component using wavesurfer.js.
 */

'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Card } from '@/components/ui/card';
import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WaveformPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function WaveformPlayer({ url, title, onClose }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'hsl(var(--primary) / 0.5)',
      progressColor: 'hsl(var(--primary))',
      url,
      height: 100,
      barWidth: 2,
      barRadius: 1,
      barGap: 2,
      cursorWidth: 2,
      cursorColor: 'hsl(var(--primary))',
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      isPlayingRef.current = !isPlayingRef.current;
    }
  };

  return (
    <Card className="p-4 border-accent/50">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Waveform */}
        <div ref={containerRef} className="rounded-lg overflow-hidden" />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={togglePlay}
            className="flex-1"
          >
            {isPlayingRef.current ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
