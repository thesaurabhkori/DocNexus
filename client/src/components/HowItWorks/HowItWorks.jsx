import React from 'react';
import { 
  ArrowRight, 
  Lock, 
  Settings2, 
  Zap, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      badgeColor: "bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-purple-500/30",
      title: "Upload Your File",
      desc: "Choose a PDF, image or any document file and upload it securely.",
      tag: {
        icon: <Lock className="w-3.5 h-3.5 text-purple-600" />,
        text: "100% Secure Upload",
        style: "bg-purple-50/80 text-purple-700 border-purple-100"
      },
      illustration: (
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* File sheet base */}
          <div className="w-10 h-10 bg-white rounded-full shadow-[0_10px_25px_rgba(99,102,241,0.12)] border border-slate-100 flex flex-col items-center justify-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white">
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          {/* Format pills */}
          <span className="absolute left-2 top-3 text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-sm">PDF</span>
          <span className="absolute left-2 bottom-4 text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-500 text-white shadow-sm">JPG</span>
          <span className="absolute right-2 top-3 text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-500 text-white shadow-sm">PNG</span>
          <span className="absolute right-2 bottom-4 text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-sm">DOC</span>
        </div>
      )
    },
    {
      number: "02",
      badgeColor: "bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-blue-500/30",
      title: "Choose Conversion",
      desc: "Select the format you want and click convert.",
      tag: {
        icon: <Settings2 className="w-3.5 h-3.5 text-blue-600" />,
        text: "Multiple Formats Supported",
        style: "bg-blue-50/80 text-blue-700 border-blue-100"
      },
      illustration: (
        <div className="relative w-36 h-28 flex items-center justify-center gap-3">
          {/* PDF miniature */}
          <div className="w-12 h-16 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center relative">
            <div className="w-6 h-1.5 bg-slate-200 rounded-full mb-1.5" />
            <span className="text-[9px] font-black text-rose-500 tracking-wider">PDF</span>
          </div>

          {/* Sync cycle arrows */}
          <div className="flex flex-col items-center justify-center z-10 text-indigo-500">
            <RefreshCw className="w-6 h-6 animate-[spin_6s_linear_infinite]" />
          </div>

          {/* DOC miniature */}
          <div className="w-12 h-16 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center relative">
            <div className="w-6 h-1.5 bg-slate-200 rounded-full mb-1.5" />
            <span className="text-[9px] font-black text-blue-600 tracking-wider">DOC</span>
          </div>
        </div>
      )
    },
    {
      number: "03",
      badgeColor: "bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full shadow-teal-500/30",
      title: "Download File",
      desc: "Get your converted file instantly and start using it.",
      tag: {
        icon: <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />,
        text: "Instant Download",
        style: "bg-emerald-50/80 text-emerald-700 border-emerald-100"
      },
      illustration: (
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* Sparkles */}
          <Sparkles className="w-4 h-4 text-emerald-400 absolute top-2 right-4" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 absolute bottom-3 left-4" />
          {/* Download doc base */}
          <div className="w-10 h-10 bg-white rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.12)] border border-slate-100 flex flex-col items-center justify-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30 text-white">
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f8faff] via-[#f3f6fd] to-[#fbfcfe] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background soft pastel ambient glows */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-12 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-normal max-w-lg mx-auto">
            Convert your files in just 3 simple steps. Fast, secure and hassle-free.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mt-2" />
        </div>

        {/* Steps Grid & Connecting Arrows */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-3">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              
              {/* Step Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/80 p-6 shadow-[0_15px_40px_rgba(148,163,184,0.12)] flex flex-col items-center text-center w-full max-w-[320px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(99,102,241,0.15)] group">
                
                {/* Embedded Top-Left Number Pill */}
                <div className={`absolute top-4 left-4 w-9 h-9 rounded-2xl ${step.badgeColor} text-white font-bold text-sm flex items-center justify-center shadow-lg select-none`}>
                  {step.number}
                </div>

                {/* Illustrated Graphic Center */}
                <div className="my-3 flex items-center justify-center h-28">
                  {step.illustration}
                </div>

                {/* Text Content */}
                <div className="space-y-2 mt-1">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Feature Tag */}
                <div className={`mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${step.tag.style}`}>
                  {step.tag.icon}
                  {step.tag.text}
                </div>
              </div>

              {/* Connecting Dotted Arrow Between Steps */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-1">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                </div>
              )}

            </React.Fragment>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              variant="primary" 
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
            >
              Try Now for Free
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;