import React from 'react';

const HeroBalls = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      
      {/* -------------------------------------------------------------
          1. LEFT SMALL 3D METALLIC SPHERE (Fixed on Floor)
         ------------------------------------------------------------- */}
      <div className="absolute bottom-[16%] left-[38%] sm:left-[42%] flex flex-col items-center justify-center">
        
        {/* Ball Body */}
        <div 
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full relative z-10 shadow-md"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #d8b4fe 20%, #a855f7 50%, #581c87 85%, #2e1065 100%)',
            boxShadow: 'inset -2px -2px 5px rgba(0, 0, 0, 0.5), inset 2px 2px 4px rgba(255, 255, 255, 0.9), 0 4px 10px rgba(168, 85, 247, 0.4)'
          }}
        >
          {/* Specular Light Highlight */}
          <div className="absolute top-[12%] left-[18%] w-[30%] h-[30%] bg-white rounded-full blur-[3px] opacity-95" />
        </div>

        {/* Contact Shadow directly under ball on floor (Height h-1.5 & negative margin overlay) */}
        <div className="w-5 sm:w-6 h-1.5 bg-purple-950/90 rounded-full blur-[3px] -mt-[3px] transform scale-y-50 z-0" />
      </div>

      {/* -------------------------------------------------------------
          2. RIGHT LARGE 3D METALLIC SPHERE (Fixed on Floor near Podium)
         ------------------------------------------------------------- */}
      <div className="absolute bottom-[8%] right-[6%] sm:right-[10%] flex flex-col items-center justify-center">
        
        {/* Ball Body */}
        <div 
          className="w-10 h-10 sm:w-13 sm:h-13 lg:w-15 lg:h-15 rounded-full relative z-10 shadow-xl"
          style={{
            background: 'radial-gradient(circle at 35% 25%, #ffffff 0%, #f3e8ff 15%, #c084fc 40%, #7e22ce 75%, #3b0764 100%)',
            boxShadow: 'inset -4px -4px 8px rgba(0, 0, 0, 0.5), inset 3px 3px 6px rgba(255, 255, 255, 1), 0 6px 20px rgba(146, 51, 234, 0.62)'
          }}
        >
          {/* Bright Glossy Specular Light */}
          <div className="absolute top-[12%] left-[18%] w-[35%] h-[35%] bg-white rounded-full blur-[3px] opacity-95" />
          
          {/* Rim Light Reflection */}
          <div className="absolute bottom-[10%] right-[12%] w-[40%] h-[20%] bg-purple-300/50 rounded-full blur-xs transform -rotate-45" />
        </div>

        {/* Tight Contact Shadow on Floor (Height h-2.5 & -mt-[6px] so it sticks to base) */}
        <div className="w-9 sm:w-12 lg:w-14 h-2.5 bg-purple-950/95 rounded-full blur-[4px] -mt-[6px] transform scale-y-50 z-0" />
      </div>

    </div>
  );
};

export default HeroBalls;