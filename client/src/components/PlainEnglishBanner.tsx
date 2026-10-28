'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface MetricExplainer {
  acronym: string;
  plainName: string;
  explanation: string;
  healthyBenchmark?: string;
}

export interface PlainEnglishBannerProps {
  moduleName: string;
  whatItDoes: string;
  whyItMatters: string;
  metrics?: MetricExplainer[];
  quickSteps?: string[];
  defaultOpen?: boolean;
}

export function PlainEnglishBanner({
  moduleName,
  whatItDoes,
  whyItMatters,
  metrics = [],
  quickSteps = [],
  defaultOpen = false,
}: PlainEnglishBannerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900/40 overflow-hidden shadow-xs transition-all">
      {/* Header Bar / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-blue-100/40 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-blue-600 text-white shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Plain-English Guide: {moduleName}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
              {isOpen ? 'Click to minimize guide' : 'Click to see how this screen works in simple terms'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 px-2 py-0.5 rounded">
            {isOpen ? 'Hide Guide' : 'Explain This Screen'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-blue-200/60 dark:border-blue-900/30 space-y-3.5 text-xs animate-in fade-in duration-150">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-blue-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-[11px]">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>What this screen does (in plain English):</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {whatItDoes}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-blue-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Why it matters to the business:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {whyItMatters}
              </p>
            </div>
          </div>

          {/* Metric Glossary Pills */}
          {metrics.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Key Metrics on this screen explained:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {m.acronym}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {m.plainName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {m.explanation}
                    </p>
                    {m.healthyBenchmark && (
                      <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 pt-0.5">
                        Target: {m.healthyBenchmark}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Steps */}
          {quickSteps.length > 0 && (
            <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 flex flex-col sm:flex-row sm:items-center gap-2 text-[11px]">
              <span className="font-bold text-blue-700 dark:text-blue-300 shrink-0">
                Quick 1-2-3 How to Use:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
                {quickSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span>{step}</span>
                    {idx < quickSteps.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
