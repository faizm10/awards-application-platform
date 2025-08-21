"use client";

import { BucketDebug } from "@/components/bucket-debug";
import { StorageTest } from "@/components/storage-test";

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Storage Debug Tools</h1>
      
      <div className="space-y-8">
        <BucketDebug />
        <StorageTest />
      </div>
    </div>
  );
}
