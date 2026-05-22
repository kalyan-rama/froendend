/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Heart, ShieldCheck, Sparkles, BookOpen, Scissors } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

export default function Navbar({
  activeSection,
  setActiveSection,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick
}: NavbarProps) {
  const navItems = [
    { id: 'collection', label: 'Saree Collection', icon: ShoppingBag },
    { id: 'studio', label: 'Blouse Match Studio', icon: Scissors },
    { id: 'tracking', label: 'Track Heritage Order', icon: ShieldCheck },
    { id: 'care', label: 'Care & Authenticity', icon: BookOpen },
    { id: 'custom', label: 'Bespoke Custom Weaves', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-amber-800/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex flex-col cursor-pointer" onClick={() => setActiveSection('collection')}>
            <span className="font-serif text-2xl tracking-wider text-amber-900 font-bold leading-tight">
              SPS SAREES
            </span>
            <span className="text-[9px] uppercase tracking-[0.12em] text-amber-800 font-semibold font-sans">
              Sri Praharsha Silk Sarees
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-900 text-stone-50 shadow-sm'
                      : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-900/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Icons and Badges */}
          <div className="flex items-center space-x-4">
            
            {/* Authenticity Pledge Widget */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Silk Mark Certified</span>
            </div>

            {/* Wishlist Button */}
            <button
              id="wishlist-trigger"
              onClick={onWishlistClick}
              className="relative p-2 text-amber-900/80 hover:text-amber-950 hover:bg-amber-900/5 rounded-full transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-sans text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-stone-50 font-bold scale-90">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="cart-trigger"
              onClick={onCartClick}
              className="relative p-2 text-stone-50 bg-amber-900 hover:bg-amber-950 rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 font-sans text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-amber-950 font-extrabold">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto scrollbar-none bg-stone-100 border-t border-amber-900/5 px-2 py-1.5 gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                isActive
                  ? 'bg-amber-900 text-stone-50'
                  : 'text-amber-950/80 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
