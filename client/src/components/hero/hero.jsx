import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import heroImg from '../../assets/images/hero.png'; 

const Hero = () => {
  const features = [
    "30+ PDF Tools",
    "Works on Any Device",
    "No Registration Required",
    "Files are Secure & Private"
  ];

  return (
    // Yahan pt-[76px] (Header height) aur lg:pt-0 add kiya hai taaki spacing perfect ho jaye
    <section className="relative w-full bg-[#fafbfe] overflow-hidden pt-4 pb-0 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-28 right-10 w-96 h-96 bg-purple-200/40 rounded-lg blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-200/30 rounded-lg blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left z-10 lg:mt-0 mt-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg shadow-sm">
            <span className="text-sm">✨</span> All-in-one PDF Solution
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-fit leading-[1.1]">
            Everything <span className="text-red-500">PDF.</span> <br />
            Simple, Fast, <span className="text-indigo-600">Secure.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Convert, compress, edit, merge, and manage your PDF files with powerful yet easy-to-use tools — 100% free to get started.
          </p>

          {/* Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-700 font-medium text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/30 active:scale-[0.98] transition-all group cursor-pointer text-base">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm cursor-pointer text-base">
              Try All Tools
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Your Custom Floating Image Asset */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[350px] sm:min-h-[450px] lg:min-h-[500px]">
          
          {/* Subtle Background Glow behind your image */}
          <div className="absolute w-[70%] h-[70%] bg-gradient-to-tr from-purple-300/20 via-indigo-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

          {/* Dynamic Floating Container holding hero.png */}
          <div className="w-full max-w-[580px] sm:max-w-[640px] lg:max-w-full xl:max-w-[800px] px-4 animate-[float_5s_ease-in-out_infinite]">
            <img 
              src={heroImg} 
              alt="DocNexus PDF Tools Illustration" 
              className="w-full h-auto object-contain  selection:bg-transparent"
              draggable="false"
            />
          </div>

          {/* Minimal Sparkles over the layout */}
          <div className="absolute top-12 left-1/4 text-indigo-400 font-light text-xl opacity-40 select-none animate-ping">+</div>
          <div className="absolute bottom-20 right-1/4 text-purple-400 font-light text-2xl opacity-40 select-none">+</div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;