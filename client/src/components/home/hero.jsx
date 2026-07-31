import React from 'react';
import { Link } from 'react-router-dom';
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import HeroIllustration from './HeroIllustration';
// import HeroGridFloor from './HeroGridFloor';
// import HeroBalls from './HeroBalls';

const Hero = () => {
  const features = [
    "20+ Docs Tools",
    "Quick Conversion",
    "Instant Access",
    "Device Friendly"
  ];

  return (
    <section className="relative w-full bg-[#fafbfe] overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      {/* 3D Balls Overlay Component */}
      {/* <HeroBalls /> */}

      {/* 3D Perspective Grid Floor Component (Background Layer) */}
      {/* <HeroGridFloor /> */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 lg:mt-0 mt-4">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Everything <span className="text-red-500">PDF.</span> <br />
            Simple, Fast, <span className="text-indigo-600">Secure.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            The complete PDF platform to convert, edit, compress, merge, and manage documents with speed, security, and precision.
          </p>

          {/* Features Checklist */}
          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-3 pt-2 text-left w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0 px-2 sm:px-0">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-start gap-2 sm:gap-2.5 text-slate-700 font-medium text-xs sm:text-base">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
                <span className="truncate sm:whitespace-normal">{feature}</span>
              </div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-row items-center justify-around sm:justify-evenly lg:justify-start  gap-3 sm:gap-6 pt-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
            <Button 
              variant="primary" 
              size="lg" 
              rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}>
              Convert Now
            </Button>

            <Button variant="secondary" size="lg">
              Explore Tools
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Illustration Graphic */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] w-full">
          
          {/* Background Glow */}
          <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-purple-300/30 via-indigo-200/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

          {/* Illustration Container */}
          <div className="w-full flex items-center justify-center">
            <HeroIllustration />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;