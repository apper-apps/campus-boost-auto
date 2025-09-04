import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  const variants = {
    default: "space-y-6",
    card: "space-y-4",
    table: "space-y-3",
    list: "space-y-3"
  };
  
  const SkeletonBox = ({ className }) => (
    <div className={cn("animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded", className)} />
  );
  
  if (variant === "card") {
    return (
      <div className={cn("bg-white rounded-card shadow-card p-6", className)}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <SkeletonBox className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-5/6" />
            <SkeletonBox className="h-3 w-4/6" />
          </div>
          <div className="flex gap-2">
            <SkeletonBox className="h-8 w-20 rounded-lg" />
            <SkeletonBox className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === "table") {
    return (
      <div className={cn("bg-white rounded-card shadow-card overflow-hidden", className)}>
        <div className="px-6 py-4 border-b border-gray-200">
          <SkeletonBox className="h-6 w-48" />
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-6 w-12 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-card shadow-card p-6">
            <div className="flex items-start gap-4">
              <SkeletonBox className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <SkeletonBox className="h-5 w-16 rounded-full" />
                  <SkeletonBox className="h-5 w-20 rounded-full" />
                </div>
                <SkeletonBox className="h-5 w-3/4" />
                <div className="space-y-2">
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-5/6" />
                </div>
                <div className="flex justify-between items-center">
                  <SkeletonBox className="h-3 w-24" />
                  <SkeletonBox className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(variants[variant], className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-card shadow-card p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SkeletonBox className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-3/4" />
                  <SkeletonBox className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <SkeletonBox className="h-3 w-full" />
                <SkeletonBox className="h-3 w-5/6" />
              </div>
              <SkeletonBox className="h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;