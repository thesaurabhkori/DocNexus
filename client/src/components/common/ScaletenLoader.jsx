import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafbfe] px-4 sm:px-8 lg:px-12 py-6 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-16">

        {/* 1. NAVBAR SKELETON */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-5 w-28 rounded-md bg-slate-200 animate-pulse" />
          </div>
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="h-4 w-16 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-4 w-20 rounded-md bg-slate-200 animate-pulse" />
          </div>
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-16 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-9 w-20 rounded-md bg-purple-200/60 animate-pulse" />
          </div>
        </div>

        {/* 2. HERO SECTION SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-4">
          {/* Left Text Block */}
          <div className="space-y-6">
            <div className="h-6 w-40 rounded-full bg-purple-100 animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 w-[90%] rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-12 w-[75%] rounded-lg bg-slate-200 animate-pulse" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-[85%] rounded-md bg-slate-200 animate-pulse" />
              <div className="h-4 w-[65%] rounded-md bg-slate-200 animate-pulse" />
            </div>
            {/* Features Checklist Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-5 w-32 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-5 w-36 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-5 w-40 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-5 w-36 rounded-md bg-slate-200 animate-pulse" />
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <div className="h-12 w-44 rounded-lg bg-purple-300/70 animate-pulse" />
              <div className="h-12 w-36 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>

          {/* Right Hero Graphic Skeleton */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[420px] h-[320px] rounded-2xl bg-gradient-to-tr from-purple-100/50 to-indigo-50 border border-slate-100 p-6 flex flex-col justify-between shadow-xs">
              <div className="flex justify-between items-center">
                <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
              </div>
              <div className="h-28 w-28 mx-auto rounded-xl bg-purple-200/80 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. POPULAR TOOLS SECTION SKELETON */}
        <div className="space-y-8 pt-8">
          {/* Section Heading */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-4 w-72 rounded-md bg-slate-200 animate-pulse" />
          </div>

          {/* 5 x 2 Tools Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index} 
                className="p-5 rounded-xl bg-white border border-slate-100 space-y-4 shadow-2xs"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-5 w-24 rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-full rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-16 rounded-md bg-purple-200/70 animate-pulse pt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. FEATURES BANNER SKELETON */}
        <div className="w-full h-24 rounded-2xl bg-white border border-slate-100 p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 items-center shadow-2xs">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-32 rounded-md bg-slate-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SkeletonLoader;