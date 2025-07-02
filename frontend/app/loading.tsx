import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center geometric-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <span className="text-lg text-muted-foreground font-medium">Loading...</span>
      </div>
    </div>
  );
}
