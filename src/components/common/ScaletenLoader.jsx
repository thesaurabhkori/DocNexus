import React from "react";

const ScaletenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/95 px-4 py-6">
      <div className="w-full max-w-[1240px] overflow-hidden rounded-lg bg-white p-6 sm:p-8 shadow-[0_24px_100px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-slate-200 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-3 w-20 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="h-3 w-20 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-3 w-24 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-3 w-16 rounded-lg bg-slate-200 animate-pulse" />
          </div>

          <div className="flex gap-3 justify-end">
            <div className="h-10 w-24 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-10 w-28 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="h-20 w-[90%] rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-14 w-[65%] rounded-lg bg-slate-200 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-4 w-[92%] rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-4 w-[72%] rounded-lg bg-slate-200 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="h-14 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-14 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-14 rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-14 rounded-lg bg-slate-200 animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="h-14 w-full max-w-[180px] rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-14 w-full max-w-[180px] rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 via-slate-100 to-white">
            <div className="absolute inset-6 rounded-lg bg-slate-200/90 shadow-inner shadow-slate-300" />
            <div className="absolute top-8 left-8 h-14 w-14 rounded-lg bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]" />
            <div className="absolute top-16 left-28 h-16 w-16 rounded-lg bg-slate-200 animate-pulse" />
            <div className="absolute right-8 top-20 h-20 w-20 rounded-lg bg-slate-200 animate-pulse" />
            <div className="absolute inset-x-20 bottom-8 h-24 rounded-lg bg-white shadow-[0_20px_50px_rgba(99,102,241,0.18)]" />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-32 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ScaletenLoader;
