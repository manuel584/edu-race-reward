
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-2/3 mx-auto" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};
