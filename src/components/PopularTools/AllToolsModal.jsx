import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

const AllToolsModal = ({ open, onClose, tools }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 bg-slate-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-md  border border-white/20 bg-white/10 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute left-4 top-6 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute right-4 bottom-6 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="relative p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[calc(100vh-5rem)] all-tools-scroll">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold uppercase tracking-[0.3em] text-indigo-400/60">
                  All Tools
                </p>
                <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-lg">
                  Browse all PDF utilities with a clean, modern popup layout designed for fast access.
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md  border border-white/30 bg-white/20 text-slate-700 shadow-sm transition hover:bg-white/40"
                aria-label="Close all tools popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5">
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
                    className="group relative overflow-hidden rounded-md border border-white/30 bg-white/30 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-200/80 hover:bg-white/60"
                  >
                    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${tool.iconBg}`}>
                      <Icon className={`h-6 w-6 ${tool.iconClass}`} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-slate-900 transition group-hover:text-indigo-600">
                      {tool.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {tool.desc}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold">
                      <span>Open</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
