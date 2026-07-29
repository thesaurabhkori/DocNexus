import React from 'react';

// Images Import Path
import basePodium from '../../../dist/assets/images/Docs-base.png';
import paperSheet from '../../../dist/assets/logo/Logo-cover.png';
import mainLogo from '../../../dist/assets/logo/logo.png';
import wordLogo from '../../../dist/assets/logo/Word-logo.png';
import excelLogo from '../../../dist/assets/logo/Excel-logo.png';
import pptLogo from '../../../dist/assets/logo/Power-point-logo.png';
import imageLogo from '../../../dist/assets/logo/image-logo.png';

const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[560px] lg:max-w-[600px] aspect-square mx-auto flex items-center justify-center select-none pt-4">
      
      {/* 1. BACKGROUND DASHED CONNECTOR LINES */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Word to Center Paper */}
        <path d="M 135 130 Q 185 180 230 200" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 5" />
        {/* Excel to Center Paper */}
        <path d="M 365 130 Q 315 180 270 200" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 5" />
        {/* PowerPoint to Center Paper */}
        <path d="M 125 250 Q 180 240 230 220" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 5" />
        {/* Image to Center Paper */}
        <path d="M 375 250 Q 320 240 270 220" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="5 5" />
      </svg>

      {/* 2. BASE PODIUM STAND */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[75%] sm:w-[78%] z-10">
        <img
          src={basePodium}
          alt="Podium Base"
          className="w-full h-auto object-contain drop-shadow-md"
          draggable="false"
        />
      </div>

      {/* 3. CENTER PAPER SHEET + LOGO */}
      <div className="absolute bottom-[34%] sm:bottom-[34%] left-1/2 -translate-x-1/2 w-[38%] sm:w-[40%] z-20 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
        {/* White Paper Sheet */}
        <img
          src={paperSheet}
          alt="Paper Document"
          className="w-full h-auto object-contain drop-shadow-2xl"
          draggable="false"
        />
        {/* Center Main 'D' Logo */}
        <div className="absolute w-[40%] h-[40%] translate-y-5 sm:translate-y-6 overflow-hidden drop-shadow-md">
          <img
            src={mainLogo}
            alt="DocNexus Logo"
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      </div>

      {/* 4. FLOATING APP CARDS */}

      {/* Top Left: Word */}
      <div className="absolute top-[12%] left-[12%] z-30 flex flex-col items-center gap-1 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-purple-500/10 border border-white/80 animate-[float_5s_ease-in-out_0.2s_infinite]">
        <img src={wordLogo} alt="Word" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain" />
        <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700">Word</span>
      </div>

      {/* Top Right: Excel */}
      <div className="absolute top-[12%] right-[12%] z-30 flex flex-col items-center gap-1 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-purple-500/10 border border-white/80 animate-[float_5.5s_ease-in-out_0.7s_infinite]">
        <img src={excelLogo} alt="Excel" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain" />
        <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700">Excel</span>
      </div>

      {/* Bottom Left: PowerPoint */}
      <div className="absolute top-[38%] left-[6%] z-30 flex flex-col items-center gap-1 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-purple-500/10 border border-white/80 animate-[float_6s_ease-in-out_1.2s_infinite]">
        <img src={pptLogo} alt="PowerPoint" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain" />
        <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700">PowerPoint</span>
      </div>

      {/* Bottom Right: Image */}
      <div className="absolute top-[38%] right-[6%] z-30 flex flex-col items-center gap-1 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-purple-500/10 border border-white/80 animate-[float_5.2s_ease-in-out_0.5s_infinite]">
        <img src={imageLogo} alt="Image" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain" />
        <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700">Image</span>
      </div>

      {/* 5. BACKGROUND SPARKLES (Updated animations & offsets) */}
      <div className="absolute top-[5%] left-[4%] text-purple-400 text-xl select-none pointer-events-none animate-ping">+</div>
      <div className="absolute top-[50%] left-[30%] text-purple-400 text-2xl select-none pointer-events-none animate-sparkle-float [animation-delay:1s]">+</div>
      <div className="absolute top-[55%] left-[10%] text-purple-400 text-3xl select-none pointer-events-none animate-twinkle [animation-delay:2s]">+</div>
      <div className="absolute top-[35%] right-[2%] text-indigo-400 text-lg select-none pointer-events-none animate-sparkle-float [animation-delay:1.5s]">+</div>
      <div className="absolute bottom-[35%] left-[2%] text-purple-300 text-sm select-none pointer-events-none animate-twinkle [animation-delay:0.5s]">+</div>

    </div>
  );
};

export default HeroIllustration;