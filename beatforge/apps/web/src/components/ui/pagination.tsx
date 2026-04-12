/**
 * @file src/components/ui/pagination.tsx
 * @description Pagination component.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
}

export function Pagination({ currentPage, hasNextPage, basePath }: PaginationProps) {
  const separator = basePath.includes('?') ? '&' : '?';
  
  return (
    <div className="flex items-center gap-2">
      {currentPage > 1 && (
        <Link href={`${basePath}${separator}page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      )}

      <span className="text-sm text-muted-foreground">
        Page {currentPage}
      </span>

      {hasNextPage && (
        <Link href={`${basePath}${separator}page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
