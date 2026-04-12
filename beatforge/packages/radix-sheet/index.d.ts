import * as React from 'react';

export const Sheet: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetTrigger: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetContent: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetClose: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetHeader: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetTitle: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
export const SheetDescription: React.FC<React.PropsWithChildren<Record<string, unknown>>>;

export default {} as {
  Sheet: typeof Sheet;
  SheetTrigger: typeof SheetTrigger;
  SheetContent: typeof SheetContent;
  SheetClose: typeof SheetClose;
  SheetHeader: typeof SheetHeader;
  SheetTitle: typeof SheetTitle;
  SheetDescription: typeof SheetDescription;
};
