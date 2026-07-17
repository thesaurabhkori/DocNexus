import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  FileSpreadsheet, 
  FileLineChart, 
  Image as ImageIcon, 
  FileCode, 
  ShieldCheck, 
  Zap, 
  Cloud, 
  Users,
  FilePlus,
  Scissors,
  RotateCw,
  Trash2,
  Unlock,
  Pen,
  Crop
} from 'lucide-react';
import AllToolsModal from './AllToolsModal';

const PopularTools = () => {
  // Popular tool cards (Convert to PDF | Convert from PDF)
  const tools = [
    {
      title: "JPG to PDF",
      desc: "Convert images (JPG/PNG) into a one PDF",
      icon: ImageIcon,
      iconClass: "text-pink-600",
      iconBg: "bg-pink-50",
      path: "/jpg-to-pdf"
    },
    {
      title: "Word to PDF",
      desc: "Convert Word documents to PDF",
      icon: FileText,
      iconClass: "text-blue-600",
      iconBg: "bg-blue-50",
      path: "/word-to-pdf"
    },
    {
      title: "PowerPoint to PDF",
      desc: "Convert PowerPoint slides to PDF",
      icon: FileLineChart,
      iconClass: "text-orange-600",
      iconBg: "bg-orange-50",
      path: "/ppt-to-pdf"
    },
    {
      title: "Excel to PDF",
      desc: "Convert spreadsheets to PDF",
      icon: FileSpreadsheet,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/excel-to-pdf"
    },
    {
      title: "HTML to PDF",
      desc: "Convert HTML files or webpages to PDF",
      icon: FileCode,
      iconClass: "text-yellow-600",
      iconBg: "bg-yellow-50",
      path: "/html-to-pdf"
    },

    // Convert FROM PDF
    {
      title: "PDF to JPG",
      desc: "Convert PDF pages to JPG images",
      icon: ImageIcon,
      iconClass: "text-purple-600",
      iconBg: "bg-purple-50",
      path: "/pdf-to-jpg"
    },
    {
      title: "PDF to Word",
      desc: "Convert PDF files to editable Word documents",
      icon: FileText,
      iconClass: "text-blue-600",
      iconBg: "bg-blue-50",
      path: "/pdf-to-word"
    },
    {
      title: "PDF to PowerPoint",
      desc: "Convert PDF pages to PowerPoint presentations",
      icon: FileLineChart,
      iconClass: "text-orange-600",
      iconBg: "bg-orange-50",
      path: "/pdf-to-ppt"
    },
    {
      title: "PDF to Excel",
      desc: "Convert PDF files to Excel spreadsheets",
      icon: FileSpreadsheet,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/pdf-to-excel"
    },
    {
      title: "PDF to PDF/A",
      desc: "Convert PDF to archival PDF/A format",
      icon: ShieldCheck,
      iconClass: "text-indigo-600",
      iconBg: "bg-indigo-50",
      path: "/pdf-to-pdfa"
    }
    ,
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF files into one",
      icon: FilePlus,
      iconClass: "text-pink-600",
      iconBg: "bg-pink-50",
      path: "/merge-pdf"
    },
    {
      title: "Split PDF",
      desc: "Split PDF into multiple files",
      icon: Scissors,
      iconClass: "text-purple-600",
      iconBg: "bg-purple-50",
      path: "/split-pdf"
    },
    {
      title: "Compress PDF",
      desc: "Reduce PDF file size without losing quality",
      icon: Zap,
      iconClass: "text-amber-600",
      iconBg: "bg-amber-50",
      path: "/compress-pdf"
    },
    {
      title: "Rotate PDF",
      desc: "Rotate PDF pages to the desired direction",
      icon: RotateCw,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/rotate-pdf"
    },
    {
      title: "Remove Pages",
      desc: "Remove unwanted pages from the PDF",
      icon: Trash2,
      iconClass: "text-red-600",
      iconBg: "bg-red-50",
      path: "/remove-pages"
    },
    {
      title: "Extract Pages",
      desc: "Extract specific pages from a PDF",
      icon: FileText,
      iconClass: "text-sky-600",
      iconBg: "bg-sky-50",
      path: "/extract-pages"
    },
    {
      title: "Watermark PDF",
      desc: "Add text or image watermark to PDF",
      icon: ImageIcon,
      iconClass: "text-cyan-600",
      iconBg: "bg-cyan-50",
      path: "/watermark-pdf"
    },
    {
      title: "Crop PDF",
      desc: "Crop PDF pages to remove margins",
      icon: Crop,
      iconClass: "text-violet-600",
      iconBg: "bg-violet-50",
      path: "/crop-pdf"
    },
    {
      title: "Unlock PDF",
      desc: "Remove password protection from PDF",
      icon: Unlock,
      iconClass: "text-pink-500",
      iconBg: "bg-pink-50",
      path: "/unlock-pdf"
    },
    {
      title: "Protect PDF",
      desc: "Add password and encrypt PDF files",
      icon: ShieldCheck,
      iconClass: "text-indigo-600",
      iconBg: "bg-indigo-50",
      path: "/protect-pdf"
    },
    {
      title: "Sign PDF",
      desc: "Add digital signatures to PDF",
      icon: Pen,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/sign-pdf"
    }
  ];

  // Bottom Banner Features Data
  const features = [
    {
      title: "100% Secure",
      desc: "Your files are encrypted and completely safe.",
      icon: <ShieldCheck className="w-7 h-7 text-indigo-600" />
    },
    {
      title: "Super Fast",
      desc: "Convert files in seconds with our powerful tools.",
      icon: <Zap className="w-7 h-7 text-indigo-600" />
    },
    {
      title: "Cloud Based",
      desc: "Access your files from anywhere, anytime.",
      icon: <Cloud className="w-7 h-7 text-indigo-600" />
    },
    {
      title: "Trusted by Millions",
      desc: "Join millions of users who trust our platform.",
      icon: <Users className="w-7 h-7 text-indigo-600" />
    }
  ];

  const [modalOpen, setModalOpen] = useState(false);

  const visiblePaths = [
    "/jpg-to-pdf",
    "/word-to-pdf",
    "/pdf-to-jpg",
    "/pdf-to-word",
    "/compress-pdf",
    "/merge-pdf",
    "/split-pdf",
    "/pdf-to-excel",
    "/protect-pdf",
    "/unlock-pdf"
  ];

  const homepageTools = visiblePaths
    .map((path) => tools.find((tool) => tool.path === path))
    .filter(Boolean);

  return (
    <section className="w-full bg-white py-10 px-4 sm:px-6 lg:px-8">
      <AllToolsModal open={modalOpen} onClose={() => setModalOpen(false)} tools={tools} />

      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900/90 tracking-tight">
            Popular Tools
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Everything you need to work with PDF files in one place.
          </p>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {homepageTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link 
                to={tool.path}
                key={idx} 
                className="bg-white rounded-lg p-4 border border-slate-300 hover:border-zinc-300 hover:bg-purple-100 hover:shadow-xl hover:-translate-y-4  transition-all duration-300 flex flex-col justify-between group cursor-pointer decoration-transparent select-none"
              >
                <div className="space-y-3">
                  {/* Tool Icon */}
                  <div className={`w-10 h-10 ${tool.iconBg} rounded-sm flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                    <Icon className={`w-8 h-8 sm:w-6 sm:h-8 ${tool.iconClass}`} aria-hidden="true" />
                  </div>
                  
                  {/* Tool Meta */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-700 text-lg md:text-xl lg:text-xl group-hover:text-indigo-600 transition-colors leading-tight">
                      {tool.title}
                    </h3>
                    <p className="text-lg sm:text-base md:text-base lg:text-md text-slate-600 font-medium leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                {/* Action Arrow */}
                <div className="pt-2 inline-flex items-center gap-1 text-indigo-600 font-semibold">
                  <span>Let's Go</span>
                  <ArrowRight className="w-3 h-3 text-indigo-600 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* VIEW ALL TOOLS LINK */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm sm:text-base group cursor-pointer"
          >
            View All Tools 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* BOTTOM TRUST/FEATURES BANNER */}
        <div className="w-full bg-white rounded-lg border border-slate-400 p-8 sm:p-10 hover:border-slate-900 hover:shadow-[0_10px_30px_rgba(99,102,241,0.06)] transition-all duration-300 shadow-[0_10px_40px_rgba(99,102,241,0.02)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start mt-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4 items-start sm:px-2">
              {/* Feature Icon */}
              <div className="p-2.5 bg-indigo-50/60 rounded-lg flex-shrink-0">
                {feature.icon}
              </div>
              
              {/* Feature Text */}
              <div className="space-y-1 text-left">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularTools;