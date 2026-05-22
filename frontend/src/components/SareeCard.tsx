/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, MoveRight, Star, ShieldCheck } from 'lucide-react';
import { Saree } from '../types';

interface SareeCardProps {
  key?: string;
  saree: Saree;
  onViewDetails: (saree: Saree) => void;
  onToggleWishlist: (saree: Saree) => void;
  isWishlisted: boolean;
  onInstantMatch: (saree: Saree) => void;
}

export default function SareeCard({
  saree,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  onInstantMatch
}: SareeCardProps) {
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

  const discount = saree.originalPrice
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : 0;

  return (
    <div 
      id={`saree-card-${saree.id}`}
      className="group bg-[#FCFAF7] rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(139,92,26,0.04)] hover:shadow-[0_20px_40px_-4px_rgba(139,92,26,0.08)] border border-[#ECE6DD] hover:border-[#DFCBB5] transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full"
    >
      {/* Visual Header */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
        
        {/* Main Product Image with subtle scale zoom dynamic */}
        <img
          src={saree.image}
          alt={saree.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
        />

        {/* Shadow overlays - luxury soft warm neutral glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {saree.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[9px] tracking-[0.15em] uppercase bg-[#FAF9F5]/90 backdrop-blur-md text-stone-800 px-3 py-1.5 rounded-md font-bold border border-[#ECE6DD] shadow-sm"
            >
              {tag}
            </span>
          ))}
          {discount > 0 && (
            <span className="text-[9px] tracking-[0.15em] uppercase bg-[#800517] text-[#FAF9F5] px-3 py-1.5 rounded-md font-extrabold shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={() => onToggleWishlist(saree)}
          className="absolute top-4 right-4 z-10 p-2.5 bg-[#FAF9F5]/90 backdrop-blur-md hover:bg-[#FAF9F5] rounded-full text-stone-900 shadow-sm transition-all duration-300 active:scale-90 hover:text-rose-600 border border-[#ECE6DD]/40"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Quick specs pill with luxury glassmorphism */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-1 bg-[#FAF9F5]/85 backdrop-blur-md text-stone-800 px-2.5 py-1 rounded-lg border border-[#ECE6DD]/40 shadow-sm text-[11px]">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold">{saree.rating}</span>
          </div>
          
          {saree.silkMarkApproved && (
            <div className="flex items-center gap-1 bg-[#800517]/90 backdrop-blur-md text-stone-100 px-2.5 py-1 rounded-lg border border-[#800517]/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-extrabold text-[9px] tracking-[0.1em] uppercase">Silk Mark</span>
            </div>
          )}
        </div>
      </div>

      {/* Information Body */}
      <div className="p-5 flex flex-col flex-grow bg-[#FCFAF7]/40">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C6239] font-semibold mb-1.5 block">
          {saree.type} • {saree.origin}
        </span>
        
        <h3 className="font-serif text-base text-stone-900 group-hover:text-[#800517] transition-colors duration-300 font-bold tracking-tight line-clamp-1 mb-1.5">
          {saree.name}
        </h3>
        
        <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-4 flex-grow font-sans font-light">
          {saree.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto border-t border-[#ECE6DD] pt-4">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-lg font-serif font-bold text-stone-950 tracking-tight">{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-stone-400 text-xs line-through mt-0.5 font-light">{formattedOriginalPrice}</span>
              )}
            </div>
            <div className="text-right text-[10px] text-stone-500 font-mono">
              <span className="block font-bold uppercase tracking-wider text-[#8C6239]">Certified Pure</span>
              <span className="font-light">~{saree.weight}g handloom</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            
            {/* Action 1: Interactive Blouse Creator */}
            <button
              id={`btn-match-${saree.id}`}
              onClick={() => onInstantMatch(saree)}
              className="text-[#8C6239] border border-[#8C6239]/60 hover:bg-[#8C6239]/5 text-[11px] tracking-wider uppercase font-semibold py-2.5 rounded-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Match Blouse</span>
            </button>

            {/* Action 2: View Details */}
            <button
              id={`btn-details-${saree.id}`}
              onClick={() => onViewDetails(saree)}
              className="bg-[#800517] text-stone-50 hover:bg-[#990d23] text-[11px] tracking-wider uppercase font-semibold py-2.5 rounded-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-1"
            >
              <span>View Heritage</span>
              <MoveRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
