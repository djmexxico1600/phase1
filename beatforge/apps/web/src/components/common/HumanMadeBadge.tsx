/**
 * @file src/components/common/HumanMadeBadge.tsx
 * @description Verified human-made artist badge component.
 */

'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle2 } from 'lucide-react';

interface HumanMadeBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function HumanMadeBadge({ size = 'md', showLabel }: HumanMadeBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <CheckCircle2
              className={`${sizeMap[size]} text-accent flex-shrink-0`}
              fill="currentColor"
            />
            {showLabel && <span className="text-xs font-semibold">Verified</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Human-made verified artist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
