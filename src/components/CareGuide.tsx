/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, BookOpen, AlertTriangle, Sparkles, Droplet, Coffee, Info, Eye, Sun, Snowflake } from 'lucide-react';
import { SILK_CARE_RECIPES } from '../data';

export default function CareGuide() {
  const [selectedStain, setSelectedStain] = useState<string>(SILK_CARE_RECIPES[0].stainType);

  const activeRecipe = SILK_CARE_RECIPES.find(r => r.stainType === selectedStain) || SILK_CARE_RECIPES[0];

  const storageTips = [
    {
      title: 'Never use metallic hangers',
      desc: 'Pure heavy mulberry silks should be wrapped in clean, unbleached white muslin fabrics and stacked flat. Wooden or metal hangers will cause deep creasing structures that cut across vertical loom threads over time.'
    },
    {
      title: 'Decennial dry aeration',
      desc: 'Every 4 to 6 months, unfold your pure zari sarees completely under a soft fan in a shady, dust-free room for 2-3 hours. Refold them along different fold creases to distribute thread tension equally.'
    },
    {
      title: 'Prevent moisture buildup',
      desc: 'Use natural cedar balls or silica-gel packets inside your saree trunk. Never place naphthalene mothballs directly touching gold and silver zari threads as they oxidize the metals and make them turn charcoal black.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-800/20 text-xs font-mono font-bold text-emerald-900 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Conservation &amp; Preservation Hub</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight">
          Heritage Preservation &amp; Care
        </h2>
        <p className="mt-2 text-stone-600 text-sm leading-relaxed">
          Pure mulberry and zari threads carry generations of weaver labor. Learn the scientific care patterns to shield your sarees from environmental decay and identify authentic Silk Mark standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT COLUMN: Stain Care Planner (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Droplet className="w-5 h-5 text-amber-900" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Interactive Stain Rescue Guide
            </h3>
          </div>
          <p className="text-stone-600 text-xs mb-5 leading-relaxed">
            Spilled tea, coffee, or dropped an oily curry spot during a wedding festivity? Select the stain below to get instant handloom-expert recommended treatment pipelines:
          </p>

          {/* Stain Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {SILK_CARE_RECIPES.map((r) => {
              const isActive = r.stainType === selectedStain;
              return (
                <button
                  key={r.stainType}
                  onClick={() => setSelectedStain(r.stainType)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                    isActive
                      ? 'bg-amber-900 border-amber-900 text-stone-50 shadow'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {r.stainType === 'Tea or Coffee' && <Coffee className="w-4 h-4" />}
                  {r.stainType === 'Water Stains' && <Droplet className="w-4 h-4" />}
                  {r.stainType === 'Oily / Curry Spots' && <Sparkles className="w-4 h-4" />}
                  {r.stainType === 'Perfume or Deodorant' && <AlertTriangle className="w-4 h-4" />}
                  <span>{r.stainType}</span>
                </button>
              );
            })}
          </div>

          {/* Display instructions */}
          <div className="bg-stone-100/80 border border-stone-200/80 rounded-xl p-5 flex-grow">
            <div className="flex items-center justify-between border-b border-stone-250 pb-3 mb-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Standard Remedy</span>
                <h4 className="font-semibold text-xs text-stone-900">{activeRecipe.remedyType}</h4>
              </div>
              <span className="text-[9px] bg-amber-100 text-amber-950 font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                Safe for Zari
              </span>
            </div>

            <ol className="space-y-3">
              {activeRecipe.steps.map((st, sidx) => (
                <li key={sidx} className="flex gap-3 text-xs text-stone-605 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-amber-900/10 text-amber-900 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {sidx + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>

            <div className="mt-5 pt-3.5 border-t border-stone-250 flex items-start gap-2 text-[10px] text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Always perform a patch spot test on an inside corner of the blouse fabric before attempting any liquid treatments on the main body of the saree.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authenticity pledge & Storage (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Authenticity Certificate Widget */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="font-serif font-bold text-base tracking-wide text-stone-100">
                    Silk Mark Pledge
                  </span>
                </div>
                <span className="bg-emerald-800/60 border border-emerald-500/30 font-mono text-[9px] px-2 py-0.5 rounded font-extrabold text-emerald-300">
                  Govt Scheme Approved
                </span>
              </div>

              <p className="text-emerald-150 text-xs leading-relaxed mb-4">
                Silk Mark is a registered trademark issued by the Silk Mark Organisation of India (Ministry of Textiles). It protects customers from synthetic polyester blends disguised as premium mulberry silk.
              </p>

              <div className="space-y-3 bg-emerald-990 border border-emerald-800 p-3.5 rounded-xl text-xs mb-3">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>How to Check:</strong> Every saree we ship arrives with an individual holographic Silk Mark hangtag detailing a unique, verifiable identification number.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Scientific Test:</strong> When burned, organic pure silk thread smells precisely like burnt hair, crumbles into black ash immediately, and self-extinguishes.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-emerald-300 font-mono">
              ★ Guaranteed handwoven authentic silk mark certified looms.
            </div>
          </div>

          {/* Saree Storage Guide */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-900" />
              <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">
                Daily Trunk Storage Matrix
              </h3>
            </div>
            
            <div className="space-y-4">
              {storageTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-950 mt-1.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-900 text-xs leading-none mb-1">{tip.title}</span>
                    <span className="text-stone-605 text-[11px] leading-relaxed">{tip.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
