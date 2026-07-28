import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

const AllToolsModal = ({ open, onClose, tools }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 bg-slate-950/30 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-md  border border-white/40 bg-white/40 shadow-2xl shadow-slate-950/40 backdrop-blur-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute left-4 top-6 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute right-4 bottom-6 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="relative p-6 sm:p-8 lg:p-6 overflow-y-auto max-h-[calc(100vh-5rem)] all-tools-scroll">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold uppercase tracking-[0.3em] text-indigo-600/80">
                  All Tools
                </p>
                <h2 className="mt-1 text-md font-black text-slate-900/80 sm:text-lg">
                  Professional PDF solutions for creating, editing, converting, securing, and managing documents effortlessly.
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm  border border-white/40 bg-white/50 text-slate-700 shadow-2xl transition hover:bg-white/60"
                aria-label="Close all tools popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      navigate(tool.path);
                      onClose();
                    }}
                    className="group relative overflow-hidden rounded-md border border-white/30 bg-white/30 p-4 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-2 hover:border-indigo-200/80 hover:bg-white/60"
                  >
                    <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md ${tool.iconBg}`}>
                      <Icon className={`h-6 w-6 ${tool.iconClass}`} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-slate-900 transition group-hover:text-indigo-600">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {tool.desc}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 text-indigo-600 font-semibold">
                      <span>Let's Go</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllToolsModal;
