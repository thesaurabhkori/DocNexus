import React from 'react';

const HeroGridFloor = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[60vh] min-h-[480px] sm:min-h-[520px] overflow-hidden pointer-events-none z-0 flex justify-center items-end">
      
      {/* Glossy Floor Lavender Ambient Glow (Adds shining surface base) */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-purple-400/30 via-indigo-200/20 to-transparent pointer-events-none" />

      {/* 3D Perspective Grid Wrapper - Oversized to completely fill left-right corners */}
      <div className="relative w-[500%] sm:w-[350%] lg:w-[250%] h-[1000px] origin-bottom [perspective:700px] flex justify-center">
        
        {/* Grid Surface */}
        <div 
          className="absolute inset-0 origin-bottom"
          style={{
            transform: 'rotateX(var(--rotate-angle, 78deg)) scale(2.5)',
            backgroundImage: `
              linear-gradient(to right, rgba(168, 85, 247, 0.85) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(168, 85, 247, 0.85) 1.5px, transparent 1.5px)
            `,
            backgroundSize: 'var(--grid-size, 50px) var(--grid-size, 50px)',
            // Drop-shadow filter added for neon glowing lines
            filter: 'drop-shadow(0px 0px 6px rgba(168, 85, 247, 0.6))',
            maskImage: 'linear-gradient(to top, black 50%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 95%)',
          }}
        />

        {/* Intense Horizon Neon Light Glow */}
        <div className="absolute bottom-4 inset-x-0 h-96 bg-gradient-to-t from-purple-500/50 via-indigo-400/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-48 bg-purple-400/40 rounded-full blur-2xl" />
      </div>

      {/* Shining Stars & Intersection Dots */}
      <div className="absolute bottom-[20%] left-[25%] text-purple-200 text-lg font-bold animate-pulse">✦</div>
      <div className="absolute bottom-[12%] right-[22%] text-white text-xl font-bold drop-shadow-[0_0_8px_white] animate-pulse">✦</div>
      <div className="absolute bottom-[30%] right-[35%] text-purple-300 text-xs animate-ping">✦</div>
      <div className="absolute bottom-[8%] left-[42%] text-white text-sm drop-shadow-[0_0_6px_white]">✦</div>

      {/* Top Edge Soft Blend */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fafbfe] via-[#fafbfe]/60 to-transparent pointer-events-none" />

      {/* Responsive Grid Box Sizing & Rotation */}
      <style>{`
        :root { 
          --rotate-angle: 100deg;
          --grid-size: 40px; 
        }
        @media (min-width: 640px) { 
          :root { 
            --rotate-angle: 100deg;
            --grid-size: 80px; 
          } 
        }
        @media (min-width: 900px) { 
          :root { 
            --rotate-angle: 100deg;
            --grid-size: 70px; 
          } 
        }
      `}</style>

    </div>
  );
};

export default HeroGridFloor;