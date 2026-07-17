import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafbfe] flex flex-col items-center justify-center p-6 font-sans select-none relative overflow-hidden">
      
      {/* BACKGROUND FLOATING ILLUSTRATION ZONE */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center z-10 my-auto">
        
        {/* LEFT SIDE: 404 TEXT & CALL TO ACTIONS */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          
          {/* 404 NUMBER WITH GLITCH AESTHETIC SHINE */}
          <div className="relative inline-block">
            <h1 className="text-[100px] sm:text-[140px] font-black tracking-tight leading-none bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 bg-clip-text text-transparent filter drop-shadow-sm">
              404
            </h1>
            {/* Cute accent sparkle marks over 404 */}
            <span className="absolute -top-2 -right-6 text-indigo-500 text-2xl font-bold animate-pulse">
              ///
            </span>
          </div>

          {/* MAIN STATUS SUB-TITLES */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Oops! Page Not Found
            </h2>
            <p className="text-slate-400 font-medium text-sm sm:text-base max-w-xs sm:max-w-md leading-relaxed">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* BUTTON ACTIONS GRID CONTAINER */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full max-w-xs sm:max-w-none justify-center lg:justify-start">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/15 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>

            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: CUSTOM SIGNPOST & PAPER PLANE ART ILLUSTRATION */}
        <div className="relative w-full max-w-md h-[320px] sm:h-[400px] mx-auto flex items-center justify-center">
          
          {/* Abstract Fluid Background Shape blob */}
          <div className="absolute inset-0 bg-indigo-50/40 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] transform rotate-12 scale-105 blur-sm animate-pulse duration-[6000ms]"></div>
          
          {/* Custom SVG Drawing Area */}
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm select-none z-10">
            
            {/* Little Deco Stars & Dots */}
            <circle cx="60" cy="120" r="3" className="fill-indigo-300 opacity-60 animate-ping" />
            <circle cx="340" cy="220" r="4" className="fill-purple-300 opacity-50" />
            <path d="M220,90 L225,95 M225,90 L220,95" className="stroke-indigo-300 stroke-2" />
            <path d="M40,240 L46,246 M46,240 L40,246" className="stroke-purple-300 stroke-2" />

            {/* Base Shadow & Ground Stones */}
            <ellipse cx="220" cy="350" rx="120" ry="12" className="fill-slate-200/50" />
            <path d="M110,345 Q125,325 145,348 Z" className="fill-slate-300/80" />
            <path d="M280,346 Q295,330 310,347 Z" className="fill-slate-300/60" />

            {/* MAIN WOODEN SIGNPOST */}
            <g>
              {/* Vertical Pillar Pole */}
              <rect x="185" y="140" width="22" height="210" rx="3" className="fill-slate-800" />
              
              {/* TOP SIGN BOARD (Points Right: PAGE NOT FOUND) */}
              <g className="cursor-pointer transform hover:translate-x-1 transition-transform">
                <path d="M110,150 L275,150 L300,175 L275,200 L110,200 Z" className="fill-slate-800" />
                <text x="195" y="180" textAnchor="middle" className="fill-white font-black text-sm tracking-wide">
                  PAGE NOT FOUND
                </text>
              </g>

              {/* BOTTOM SIGN BOARD (Points Left: LET'S GET YOU HOME) */}
              <g className="cursor-pointer transform hover:-translate-x-1 transition-transform">
                <path d="M275,210 L140,210 L120,230 L140,250 L275,250 Z" className="fill-slate-700" />
                <text x="202" y="234" textAnchor="middle" className="fill-white font-bold text-[10px] tracking-wider">
                  LET'S GET YOU HOME
                </text>
              </g>
            </g>

            {/* ILLUSTRATION LEAVES GRAPHICS (Bottom Left & Right) */}
            <g className="opacity-95">
              {/* Left Foliage Pack */}
              <path d="M120,340 C90,320 85,280 110,260 C115,290 100,320 120,340 Z" className="fill-indigo-400" />
              <path d="M135,342 C110,310 115,270 130,265 C132,295 120,325 135,342 Z" className="fill-purple-400" />
              <path d="M100,345 C80,335 70,305 85,290 C95,305 90,330 100,345 Z" className="fill-indigo-300" />
              
              {/* Right Foliage Pack */}
              <path d="M295,345 C320,325 330,295 315,280 C310,305 305,330 295,345 Z" className="fill-indigo-400" />
              <path d="M315,346 C335,335 340,315 330,300 C325,315 325,335 315,346 Z" className="fill-purple-300" />
            </g>

            {/* PAPER AIRPLANE WITH DOT PATH TRAILING LINE */}
            <g className="animate-bounce duration-[3000ms]">
              {/* Dashed trail line */}
              <path d="M230,210 Q280,180 300,140 T360,70" fill="none" className="stroke-slate-300 stroke-2 stroke-dashed" strokeDasharray="4 4" />
              
              {/* Paper Plane Triangle Origami SVG elements */}
              <g className="translate-x-[345px] translate-y-[55px] rotate-[-10deg]">
                <polygon points="0,15 25,0 12,22" className="fill-indigo-500" />
                <polygon points="12,22 25,0 8,17" className="fill-indigo-600" />
                <polygon points="0,15 12,22 5,20" className="fill-indigo-400" />
              </g>
            </g>

          </svg>
        </div>

      </div>

      {/* FOOTER NEED HELP BOTTOM BAR PANEL PANEL */}
      <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-4 shadow-[0_4px_20px_rgba(99,102,241,0.02)] z-10 mt-auto lg:mt-8">
        {/* Support Life Buoy Floating Icon Ring Shape */}
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="14.83" y2="9.17" />
            <line x1="9.17" y1="14.83" x2="4.93" y2="19.07" />
          </svg>
        </div>
        
        <div className="text-xs sm:text-sm font-medium text-slate-500">
          Need Help? Visit our{' '}
          <a href="/help" className="text-indigo-600 font-bold hover:underline transition-all">Help Center</a>
          {' '}or{' '}
          <a href="/contact" className="text-indigo-600 font-bold hover:underline transition-all">contact support</a>.
        </div>
      </div>

    </div>
  );
};

export default NotFound;