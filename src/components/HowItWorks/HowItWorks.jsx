import React from 'react';
import { CloudUpload, Sliders, Download, ArrowRight, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Upload Your File",
      desc: "Choose a PDF or image file and completely safe.",
      icon: <CloudUpload className="w-10 h-10 text-indigo-600" /> // Logo size exact original
    },
    {
      number: "2",
      title: "Choose Conversion",
      desc: "Select the format you want and click convert.",
      icon: <Sliders className="w-10 h-10 text-indigo-600" />
    },
    {
      number: "3",
      title: "Download File",
      desc: "Get your converted file instantly.",
      icon: <Download className="w-10 h-10 text-indigo-600" />
    }
  ];

  return (
    <section className="w-full bg-[#fafbfe] py-12 px-4 sm:px-6 lg:px-8 h-auto flex items-center justify-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-12 w-full">
        
        {/* SECTION HEADER - Text content unchanged */}
        <div className="text-center space-y-2.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Convert your files in just 3 simple steps.
          </p>
        </div>

        {/* STEPS FLOW CONTAINER */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-3">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              
              {/* Only Box is scale-reduced here */}
              <div className="relative bg-white rounded-2xl border border-slate-100/80 px-4 py-6 shadow-[0_8px_30px_rgba(99,102,241,0.015)] flex flex-col items-center text-center w-52 sm:w-56 h-auto min-h-[210px] justify-center transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.05)] hover:border-slate-200 group">
                
                {/* Step Number Badge */}
                <div className="absolute -top-4 w-8 h-8 bg-indigo-600 text-white font-bold text-sm rounded-full flex items-center justify-center shadow-md shadow-indigo-600/20 select-none">
                  {step.number}
                </div>

                {/* Step Icon */}
                <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                  {step.icon}
                </div>

                {/* Step Meta Text - Font size original */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connecting Chevron Arrow */}
              {idx < steps.length - 1 && (
                <div className="text-slate-300 lg:block hidden mx-2">
                  <ChevronRight className="w-5 h-5 opacity-70" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA BUTTON */}
        <div className="pt-2">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-700/30 active:scale-[0.98] transition-all group cursor-pointer text-sm sm:text-base">
            Try Now for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;