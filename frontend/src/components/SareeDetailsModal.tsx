/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, Shield, Landmark, Calendar, Scale, Award, Truck, Star, CheckCircle, Package } from 'lucide-react';
import { Saree, CustomBlouseConfig } from '../types';
import { SAMPLE_REVIEWS } from '../data';

interface SareeDetailsModalProps {
  saree: Saree;
  onClose: () => void;
  onAddToCart: (saree: Saree, customBlouse?: CustomBlouseConfig) => void;
  onToggleWishlist: (saree: Saree) => void;
  isWishlisted: boolean;
}

export default function SareeDetailsModal({
  saree,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}: SareeDetailsModalProps) {
  const [activeImg, setActiveImg] = useState<string>(saree.image);
  const [activeTab, setActiveTab] = useState<'heritage' | 'specs' | 'reviews'>('heritage');
  const [pincode, setPincode] = useState<string>('');
  const [deliveryResult, setDeliveryResult] = useState<{
    success: boolean;
    msg: string;
    days?: number;
  } | null>(null);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(saree.price);

  const formattedOriginalPrice = saree.originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(saree.originalPrice)
    : null;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setDeliveryResult({
        success: false,
        msg: 'Kindly enter a valid 6-digit Indian Postal Code.'
      });
      return;
    }

    // Interactive realistic simulation based on origin
    const multiplier = parseInt(cleanPin.substring(0, 1), 10);
    let estimatedDays = 3;
    if (multiplier >= 1 && multiplier <= 3) estimatedDays = saree.origin.includes('Varanasi') ? 2 : 4;
    else if (multiplier >= 5 && multiplier <= 6) estimatedDays = saree.origin.includes('Kanchipuram') ? 2 : 4;
    else estimatedDays = 3;

    setDeliveryResult({
      success: true,
      msg: `Express shipping available! Secured dispatch via Bluedart. Expected delivery in ${estimatedDays} business days directly to your doorstep.`,
      days: estimatedDays
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1917]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#FCFAF7] rounded-3xl w-full max-w-5xl shadow-[0_30px_60px_-15px_rgba(28,25,23,0.3)] relative flex flex-col max-h-[92vh] md:max-h-[88vh] overflow-hidden border border-[#ECE6DD]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-details-modal"
          className="absolute right-4 top-4 z-10 p-2.5 bg-[#FAF9F5]/90 backdrop-blur-sm rounded-full text-stone-900 shadow-sm hover:bg-[#FAF9F5] transition-colors border border-[#ECE6DD]/40"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Gallery Left Column */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#ECE6DD]">
                <img
                  src={activeImg}
                  alt={saree.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                />
              </div>
              
              {/* Thumbnail Gallery Row */}
              <div className="flex gap-2 mr-auto overflow-x-auto pb-1 max-w-full">
                {saree.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(imgUrl)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                      activeImg === imgUrl ? 'border-[#800517] scale-95 shadow-sm' : 'border-[#ECE6DD] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Gallery index ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product description Right Column */}
            <div className="flex flex-col">
              
              {/* Metadata */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6239] font-bold font-mono">
                  {saree.type} • Origin: {saree.origin}
                </span>
                <button
                  onClick={() => onToggleWishlist(saree)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4.5 py-2 rounded-full border transition-all duration-300 ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'border-[#ECE6DD] hover:border-[#8C6239] text-stone-700 hover:text-[#8C6239] bg-[#FCFAF7]'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight leading-8 mb-2">
                {saree.name}
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-[#FAF7F2] text-[#8C6239] border border-[#ECE6DD] px-2.5 py-0.5 rounded text-xs font-bold font-sans">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{saree.rating} / 5</span>
                </div>
                <span className="text-stone-500 text-xs font-light">({saree.reviewsCount} verified buyers)</span>
              </div>

              {/* Price Tag */}
              <div className="bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl p-5 mb-5 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">{formattedPrice}</span>
                    {formattedOriginalPrice && (
                      <span className="text-stone-400 text-sm line-through font-light">{formattedOriginalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8C6239] font-bold tracking-wider uppercase mt-1 block">Inclusive of premium insurance &amp; free shipping</span>
                </div>

                {saree.silkMarkApproved && (
                  <div className="flex items-center gap-2.5 bg-[#800517]/5 text-[#800517] border border-[#800517]/25 px-3.5 py-2 rounded-xl">
                    <Award className="w-5 h-5 text-[#800517]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold tracking-widest uppercase leading-none text-[#800517]">Silk Mark Approved</span>
                      <span className="text-[8px] text-[#800517]/80 font-bold uppercase tracking-widest mt-1">100% Pure Natural Handloom Silk</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Heritage Specifications & Tabs */}
              <div className="border-b border-[#ECE6DD] mb-4 flex space-x-6">
                {[
                  { id: 'heritage', label: 'Weaver Story' },
                  { id: 'specs', label: 'Technical Details' },
                  { id: 'reviews', label: 'Buyer Reviews' }
                ].map((t) => (
                  <button
                    key={t.id}
                    id={`modal-tab-${t.id}`}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`pb-2.5 text-[11px] uppercase tracking-wider font-bold border-b-2 transition-all duration-300 cursor-pointer ${
                      activeTab === t.id
                        ? 'border-[#800517] text-[#800517]'
                        : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex-grow mb-6 min-h-[140px] text-xs">
                {activeTab === 'heritage' && (
                  <div className="space-y-3 text-stone-600 leading-relaxed text-sm">
                    <p>{saree.description}</p>
                    <div className="grid grid-cols-2 gap-3.5 bg-amber-50/40 border border-amber-900/5 p-3 rounded-lg mt-3 text-xs text-amber-950">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-amber-800 mt-0.5" />
                        <div>
                          <span className="block font-bold">Weaving Time</span>
                          <span>{saree.weavingTime} days of continuous loom labor</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Landmark className="w-4 h-4 text-amber-800 mt-0.5" />
                        <div>
                          <span className="block font-bold">Loom Origin</span>
                          <span>Registered Handloom Co-op of {saree.origin}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-stone-700 bg-stone-100/50 p-4 rounded-xl border border-stone-200/50">
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Fabric Integrity</span>
                      <span className="font-semibold text-stone-900">{saree.warpCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Zari Quality</span>
                      <span className="font-semibold text-stone-900">{saree.zariType}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Physical Weight</span>
                      <span className="font-semibold text-stone-900 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-stone-500" />
                        {saree.weight} grams
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Saree Dimensions</span>
                      <span className="font-semibold text-stone-900">5.5 Meters + 80cm Custom Blouse Fabric</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Main Base Color</span>
                      <span className="font-semibold text-stone-900 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: saree.colorHex }} />
                        {saree.color}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider font-mono">Default Border Contrast</span>
                      <span className="font-semibold text-stone-900 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: saree.contrastColorHex }} />
                        {saree.contrastColor}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {SAMPLE_REVIEWS.map((r) => (
                      <div key={r.id} className="border-b border-stone-200/50 pb-3 flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-800 text-xs">{r.author}</span>
                          <span className="text-[10px] text-stone-400">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex">
                            {Array.from({ length: r.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          {r.verified && (
                            <span className="text-emerald-700 bg-emerald-50 text-[9px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 text-xs italic leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Indian Pincode Delivery Checker */}
              <div className="mb-6 bg-stone-100 border border-stone-200/60 p-4 rounded-xl">
                <h4 className="font-bold text-xs text-stone-800 flex items-center gap-1.5 mb-2.5">
                  <Truck className="w-4 h-4 text-amber-800" />
                  Local Pincode Shipping Estimator
                </h4>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Indian PIN Code (e.g. 560001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="bg-white border border-stone-300 rounded px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-amber-900 font-mono"
                  />
                  <button
                    id="check-pincode-btn"
                    type="submit"
                    className="bg-stone-900 text-stone-50 text-[11px] font-bold px-4 py-1.5 rounded hover:bg-black transition-colors"
                  >
                    Check
                  </button>
                </form>
                {deliveryResult && (
                  <div className={`mt-2.5 text-xs p-2 rounded flex items-start gap-1.5 ${
                    deliveryResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-rose-50 text-rose-900 border border-rose-100'
                  }`}>
                    {deliveryResult.success ? (
                      <Package className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{deliveryResult.msg}</span>
                  </div>
                )}
              </div>

              {/* Call-To-Action buttons */}
              <div className="flex gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => onAddToCart(saree)}
                  className="flex-1 bg-amber-900 hover:bg-amber-950 text-stone-50 font-bold text-sm py-3 px-6 rounded-lg shadow-md transition-transform active:scale-95 text-center cursor-pointer"
                >
                  Add Saree to Bag
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
