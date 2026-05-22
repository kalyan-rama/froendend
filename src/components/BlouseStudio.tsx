/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Scissors, Sparkles, Check, HelpCircle, AlertCircle, ShoppingBag, Plus } from 'lucide-react';
import { Saree, CustomBlouseConfig } from '../types';
import { CONTRAST_COLORS_PRESET } from '../data';

interface BlouseStudioProps {
  sarees: Saree[];
  selectedSaree: Saree | null;
  onAddToCartWithBlouse: (saree: Saree, blouseConfig: CustomBlouseConfig) => void;
}

export default function BlouseStudio({
  sarees,
  selectedSaree: initialSelectedSaree,
  onAddToCartWithBlouse
}: BlouseStudioProps) {
  const [activeSaree, setActiveSaree] = useState<Saree | null>(initialSelectedSaree || sarees[0] || null);
  
  // Custom states
  const [selectedColor, setSelectedColor] = useState({ name: '', hex: '' });
  const [neckStyle, setNeckStyle] = useState<'Classic Round' | 'Deep U-Neck' | 'Royal Boat-Neck' | 'Backless Cutout' | 'Elegant Pot-Neck'>('Classic Round');
  const [sleeveLength, setSleeveLength] = useState<'Sleeveless' | 'Short Sleeve' | 'Elbow Length' | 'Full Sleeve'>('Elbow Length');
  const [borderType, setBorderType] = useState<'None' | 'Zari Border' | 'Thread Work' | 'Elbow Mesh Border'>('Zari Border');
  const [measurementNotes, setMeasurementNotes] = useState('');
  const [addonStitch, setAddonStitch] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize when parent tells us to focus on a particular saree
  useEffect(() => {
    if (initialSelectedSaree) {
      setActiveSaree(initialSelectedSaree);
      setSelectedColor({
        name: initialSelectedSaree.contrastColor,
        hex: initialSelectedSaree.contrastColorHex
      });
    } else if (sarees.length > 0) {
      setActiveSaree(sarees[0]);
      setSelectedColor({
        name: sarees[0].contrastColor,
        hex: sarees[0].contrastColorHex
      });
    }
  }, [initialSelectedSaree, sarees]);

  // Adjust default colors when selected saree changes
  const handleSareeChange = (saree: Saree) => {
    setActiveSaree(saree);
    setSelectedColor({
      name: saree.contrastColor,
      hex: saree.contrastColorHex
    });
  };

  const currentColors = activeSaree
    ? [
        { name: `Saree Contrast (${activeSaree.contrastColor})`, hex: activeSaree.contrastColorHex },
        { name: `Saree Matching (${activeSaree.color})`, hex: activeSaree.colorHex },
        ...CONTRAST_COLORS_PRESET.filter(c => c.hex !== activeSaree.contrastColorHex && c.hex !== activeSaree.colorHex)
      ]
    : CONTRAST_COLORS_PRESET;

  const handleSubmit = () => {
    if (!activeSaree) return;
    
    const config: CustomBlouseConfig = {
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      borderType,
      neckStyle,
      sleeveLength,
      measurementNotes: measurementNotes ? measurementNotes : undefined
    };

    onAddToCartWithBlouse(activeSaree, config);
    setSuccessMsg(`Exquisite Pair Added! Your ${activeSaree.name} was successfully added with the Custom ${neckStyle} (${selectedColor.name}) Blouse configuration.`);
    
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-800/20 text-xs font-mono font-bold text-amber-900 mb-2">
          <Scissors className="w-3.5 h-3.5" />
          <span>Interactive Mix &amp; Match Suite</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight">
          Blouse Matching Studio
        </h2>
        <p className="mt-2 text-stone-600 text-sm leading-relaxed">
          Craft the ultimate contrast complement or perfect matching blouse. Customize handloom fabrics, neckline borders, and sleeve configurations with real-time feedback.
        </p>
      </div>

      {successMsg && (
        <div className="max-w-3xl mx-auto mb-8 bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-sm text-emerald-950 flex items-start gap-2 animate-fade-in shadow-sm">
          <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Added Successfully!</span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* Main Studio Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Controls & Swatches (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-stone-50 rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-1.5 font-mono">
              <span>Step 1. Choose Saree</span>
            </h3>

            {/* Saree dropdown selection */}
            <div className="mb-6">
              <label className="block text-xs text-stone-500 font-bold mb-1.5">Active Loom Saree</label>
              <select
                value={activeSaree?.id || ''}
                onChange={(e) => {
                  const s = sarees.find(x => x.id === e.target.value);
                  if (s) handleSareeChange(s);
                }}
                className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amber-900 text-stone-800 focus:outline-none"
              >
                {sarees.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                ))}
              </select>
            </div>

            {/* Fabric colors */}
            <div className="mb-6">
              <h4 className="text-xs text-stone-500 font-bold mb-2">
                Step 2. Select Blouse Fabric Color
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {currentColors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(col)}
                    className={`group relative aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                      selectedColor.hex === col.hex ? 'border-amber-900 ring-2 ring-amber-900/15 scale-95' : 'border-transparent hover:border-stone-300'
                    }`}
                    title={col.name}
                  >
                    <span 
                      className="w-full h-full rounded-[6px] shadow-inner" 
                      style={{ backgroundColor: col.hex }}
                    />
                    {selectedColor.hex === col.hex && (
                      <span className="absolute bg-white/90 p-0.5 rounded-full shadow border border-amber-900 text-amber-900">
                        <Check className="w-2.5 h-2.5 font-extrabold" />
                      </span>
                    )}
                    {idx < 2 && (
                      <span className="absolute -top-1 -right-1 bg-amber-600 border border-stone-50 text-[7px] text-stone-950 font-sans px-1 rounded-sm tracking-tighter shadow-sm scale-90">
                        {idx === 0 ? 'Contrast' : 'Match'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="block mt-2 text-[10px] text-stone-500 font-medium italic">
                Selected: <span className="font-bold text-stone-800">{selectedColor.name}</span>
              </span>
            </div>

            {/* Neck Styles selection */}
            <div className="mb-6">
              <label className="block text-xs text-stone-500 font-bold mb-1.5">
                Step 3. Back-Neck Cutout Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Classic Round', 'Deep U-Neck', 'Royal Boat-Neck', 'Backless Cutout', 'Elegant Pot-Neck'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setNeckStyle(style)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-bold text-left border transition-all ${
                      neckStyle === style
                        ? 'bg-amber-900 text-stone-50 border-amber-900 shadow-sm'
                        : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleeves & Borders */}
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              <div>
                <label className="block text-xs text-stone-500 font-bold mb-1">Sleeve Length</label>
                <select
                  value={sleeveLength}
                  onChange={(e) => setSleeveLength(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800"
                >
                  {['Sleeveless', 'Short Sleeve', 'Elbow Length', 'Full Sleeve'].map(sl => (
                    <option key={sl} value={sl}>{sl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 font-bold mb-1">Border Detailing</label>
                <select
                  value={borderType}
                  onChange={(e) => setBorderType(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800"
                >
                  {['None', 'Zari Border', 'Thread Work', 'Elbow Mesh Border'].map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-200/80 pt-4">
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>We'll coordinate custom sizing on WhatsApp.</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Interactive Canvas Mockup Visualizer (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-stone-900 rounded-2xl relative p-6 flex flex-col justify-between overflow-hidden shadow-xl border border-stone-800 text-white min-h-[420px]">
          
          {/* Subtle watermarks and indicators */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-500/80 font-mono display-block">
              Interactive Stylization View
            </span>
          </div>

          {/* Interactive CSS Canvas Sketch of Blouse Neckline & Colors! */}
          <div className="flex-grow flex items-center justify-center relative py-8">
            <div className="relative w-64 h-64 flex items-center justify-center scale-110">
              
              {/* Back Neck Mock Canvas Background block representing skin */}
              <div className="absolute inset-0 bg-stone-800/10 rounded-full border border-stone-800/20 backdrop-blur-3xl flex items-center justify-center">
                
                {/* Simulated Back shoulder/neck representation */}
                <div className="relative w-48 h-56 bg-amber-100 rounded-b-full border border-stone-300/20 overflow-hidden flex flex-col items-center">
                  
                  {/* Skin tone color background */}
                  <div className="absolute inset-0 bg-stone-200/80" />

                  {/* CUSTOM BLOUSE BODY CLOTH COLOR */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-44 transition-all duration-500 ease-in-out border-t border-stone-400/20"
                    style={{ backgroundColor: selectedColor.hex || '#63101E' }}
                  >
                    
                    {/* BORDERS & EMBELLISHMENTS */}
                    {borderType === 'Zari Border' && (
                      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse border-b border-amber-600 shadow-sm" />
                    )}
                    {borderType === 'Thread Work' && (
                      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-teal-500 to-orange-400 border-b border-white/20" />
                    )}
                    {borderType === 'Elbow Mesh Border' && (
                      <div className="absolute top-0 inset-x-0 h-4 bg-yellow-500/20 repeating-linear-gradient border-b border-amber-600/30" />
                    )}

                    {/* DYNAMIC BACK NECKLINE CUTS */}
                    {neckStyle === 'Classic Round' && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-20 bg-stone-200/80 rounded-b-full border-b border-stone-400/20" style={{ backgroundColor: '#e2d6ca' }}>
                        {borderType === 'Zari Border' && (
                          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-yellow-400 border-t border-amber-600 rounded-b-full" />
                        )}
                        {borderType === 'Thread Work' && (
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-teal-400 rounded-b-full" />
                        )}
                      </div>
                    )}

                    {neckStyle === 'Deep U-Neck' && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-28 bg-stone-200/80 rounded-b-full border-b border-stone-400/20" style={{ backgroundColor: '#e2d6ca' }}>
                        {borderType === 'Zari Border' && (
                          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-yellow-400 rounded-b-full" />
                        )}
                      </div>
                    )}

                    {neckStyle === 'Royal Boat-Neck' && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-36 h-12 bg-stone-200/80 rounded-b-full border-b border-stone-400/20" style={{ backgroundColor: '#e2d6ca' }}>
                        {borderType === 'Zari Border' && (
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-yellow-400 rounded-b-full" />
                        )}
                      </div>
                    )}

                    {neckStyle === 'Backless Cutout' && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-36 bg-stone-200/80 rounded-full border border-stone-400/20" style={{ backgroundColor: '#e2d6ca' }}>
                        {/* Little beautiful connection thread string */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-amber-800" />
                      </div>
                    )}

                    {neckStyle === 'Elegant Pot-Neck' && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-stone-200/80 rounded-full border-b border-stone-400/20" style={{ backgroundColor: '#e2d6ca', borderTopLeftRadius: '50% 10%', borderTopRightRadius: '50% 10%' }}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-amber-900" />
                        {borderType === 'Zari Border' && (
                          <div className="absolute bottom-0 inset-x-0 h-1 bg-yellow-400 rounded-b-full" />
                        )}
                      </div>
                    )}

                    {/* Little decorative tassles (latkans) for deep backlines */}
                    {(neckStyle === 'Backless Cutout' || neckStyle === 'Elegant Pot-Neck' || neckStyle === 'Deep U-Neck') && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex justify-between w-24 px-1.5">
                        <span className="w-1.5 h-4 bg-amber-500/90 rounded-b-sm animate-bounce" />
                        <span className="w-1.5 h-4 bg-amber-500/90 rounded-b-sm animate-bounce [animation-delay:0.2s]" />
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* Little detail annotations */}
              <div className="absolute bottom-1 right-2 bg-stone-800/90 backdrop-blur-md px-2 py-1 rounded text-[9px] text-stone-300 font-mono">
                Sleeve: {sleeveLength}
              </div>
            </div>
          </div>

          {/* Color harmony check bar */}
          <div className="bg-stone-800/80 backdrop-blur-sm p-4 rounded-xl border border-stone-700/60 text-xs">
            <span className="font-bold text-amber-400 block mb-1">Color Palette Harmony Checklist:</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSaree?.colorHex || '#d19e34' }} />
                <span>Body: {activeSaree?.color}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex || '#ffffff' }} />
                <span>Blouse: {selectedColor.name}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Configuration Summary (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-stone-50 rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 font-mono">
              Bespoke Summary
            </h3>

            {/* Saree Quick View */}
            {activeSaree && (
              <div className="flex gap-3 mb-6 bg-white p-2.5 rounded-lg border border-stone-200">
                <img src={activeSaree.image} alt="" className="w-12 h-16 object-cover rounded" referrerPolicy="no-referrer" />
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">{activeSaree.type}</span>
                  <span className="font-serif font-bold text-xs text-stone-900 line-clamp-1">{activeSaree.name}</span>
                  <span className="text-[11px] text-amber-955 font-bold mt-0.5 font-mono">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(activeSaree.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Configuration breakdown lists */}
            <div className="space-y-3.5 mb-6 text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-250 pb-2">
                <span className="text-stone-400 font-medium">Blouse Fabric:</span>
                <span className="font-bold text-stone-900 text-right">{selectedColor.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-250 pb-2">
                <span className="text-stone-400 font-medium">Back line Style:</span>
                <span className="font-bold text-stone-900 text-right">{neckStyle}</span>
              </div>
              <div className="flex justify-between border-b border-stone-250 pb-2">
                <span className="text-stone-400 font-medium">Sleeve Config:</span>
                <span className="font-bold text-stone-900 text-right">{sleeveLength}</span>
              </div>
              <div className="flex justify-between border-b border-stone-250 pb-2">
                <span className="text-stone-400 font-medium">Loom Borders:</span>
                <span className="font-bold text-stone-900 text-right">{borderType}</span>
              </div>

              {/* Custom specs text notes */}
              <div className="mt-4">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Fit or Lining Notes (Optional)</label>
                <textarea
                  placeholder="e.g., Please add extra soft cotton lining and keep side hooks."
                  value={measurementNotes}
                  onChange={(e) => setMeasurementNotes(e.target.value)}
                  className="bg-white border border-stone-300 rounded p-2 text-xs w-full h-16 focus:outline-none focus:ring-1 focus:ring-amber-900 text-stone-800"
                />
              </div>

              {/* Sticking charge toggle */}
              <div className="mt-4 bg-amber-50/50 border border-amber-800/10 p-2.5 rounded flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-[11px]">Boutique Stitching Add-on</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Master tailor crafted finish</span>
                </div>
                <div className="flex items-center">
                  <span className="font-mono text-xs font-bold text-amber-900 mr-2">+₹1,800</span>
                  <input
                    type="checkbox"
                    checked={addonStitch}
                    onChange={(e) => setAddonStitch(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-900"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-200/80 pt-4">
            <button
              id="studio-bundle-add-btn"
              onClick={handleSubmit}
              className="w-full bg-amber-900 hover:bg-amber-950 text-stone-50 text-xs font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Set to Bag</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
