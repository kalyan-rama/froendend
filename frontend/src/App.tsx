/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Trash2, ShieldCheck, Heart, Sparkles, X, Plus, Minus, CheckCircle, Search, MapPin, 
  ArrowRight, CreditCard, ChevronDown, Check, Info, PhoneCall, Lock, User, LogOut, RefreshCw
} from 'lucide-react';
import { Saree, CartItem, CustomBlouseConfig } from './types';
import { SAREES_DATA } from './data';
import Navbar from './components/Navbar';
import SareeCard from './components/SareeCard';
import SareeDetailsModal from './components/SareeDetailsModal';
import { getApiUrl } from './utils/api';
import BlouseStudio from './components/BlouseStudio';
import CareGuide from './components/CareGuide';
import CustomWeaveForm from './components/CustomWeaveForm';
import PoliciesView from './components/PoliciesView';

// Import Admin/Auth subcomponents
import AuthModal from './components/AuthModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import OrderTracker from './components/OrderTracker';

export default function App() {
  // Navigation
  const [activeSection, setActiveSection] = useState<string>('collection');
  const [selectedPolicyTab, setSelectedPolicyTab] = React.useState<'terms' | 'refund' | 'return' | 'shipping' | 'privacy'>('terms');
  
  // Interactive triggers
  const [selectedSareeForStudio, setSelectedSareeForStudio] = useState<Saree | null>(null);
  const [selectedSareeForDetails, setSelectedSareeForDetails] = useState<Saree | null>(null);
  
  // Storefront catalog states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating-high');

  // Dynamic products from JSON backend database
  const [sarees, setSarees] = useState<Saree[]>(() => SAREES_DATA);

  // Authentication State
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('saree_store_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('saree_store_token') || null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Persistence (Cart & Wishlist)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('saree_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Saree[]>(() => {
    try {
      const saved = localStorage.getItem('saree_store_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Address Checkouts
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'completed'>('cart');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'CASHFREE' | 'COD'>('CASHFREE');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    orderId: string;
    items: CartItem[];
    total: number;
    address: typeof shippingAddress;
    payment: string;
  } | null>(null);

  const [pendingCashfreeOrder, setPendingCashfreeOrder] = useState<any>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Coupon configuration
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Sync state changes in LocalStorage
  useEffect(() => {
    localStorage.setItem('saree_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('saree_store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch Sarees on Mount from back-end
  const fetchSareesData = async () => {
    try {
      const resp = await fetch(getApiUrl('/api/sarees'));
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          setSarees(data);
        }
      }
    } catch (e) {
      console.log('Using pre-bundled local saree catalog fallback.');
    }
  };

  useEffect(() => {
    fetchSareesData();
  }, [activeSection]);

  // Handle Cashfree payment verification redirection landing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const isCfVerify = params.get('cf_verify') === 'true';

    if (orderId && isCfVerify) {
      const verifyPayment = async () => {
        setIsVerifyingPayment(true);
        try {
          const resp = await fetch(getApiUrl('/api/payments/cashfree-verify'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
          });
          
          let result: any = {};
          const contentType = resp.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            result = await resp.json();
          } else {
            const tempText = await resp.text();
            throw new Error(tempText.substring(0, 150) || 'Gateway returned invalid response format.');
          }

          if (resp.ok && result.status === 'success') {
            setPlacedOrderDetails({
              orderId,
              items: result.order.items || [],
              total: result.order.totalAmount,
              address: {
                fullName: result.order.customerName,
                phone: result.order.customerPhone,
                addressLine: result.order.shippingAddress,
                city: '',
                state: '',
                pincode: ''
              },
              payment: 'Cashfree PG Verified'
            });
            setCheckoutStep('completed');
            setCart([]); // Clear cart since payment succeeded
            // Remove routing parameters from URL cleanly
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            alert('Cashfree Gateway transaction verification failed: ' + (result.error || 'unpaid'));
          }
        } catch (err: any) {
          console.error("Auto verification exception:", err);
        } finally {
          setIsVerifyingPayment(false);
        }
      };
      verifyPayment();
    }
  }, []);

  // Populate shipping address with logged-in user profile details
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        addressLine: prev.addressLine || user.address || ''
      }));
    }
  }, [user]);

  // Handler helpers
  const handleToggleWishlist = (saree: Saree) => {
    if (wishlist.some(item => item.id === saree.id)) {
      setWishlist(wishlist.filter(item => item.id !== saree.id));
    } else {
      setWishlist([...wishlist, saree]);
    }
  };

  const handleAddToCart = (saree: Saree, customBlouse?: CustomBlouseConfig) => {
    const existingIndex = cart.findIndex(item => 
      item.saree.id === saree.id && 
      JSON.stringify(item.customBlouseStyle) === JSON.stringify(customBlouse)
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { saree, quantity: 1, customBlouseStyle: customBlouse }]);
    }
    
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, idx) => idx !== index));
  };

  const updateCartQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(updated);
    }
  };

  const handleInstantMatch = (saree: Saree) => {
    setSelectedSareeForStudio(saree);
    setActiveSection('studio');
  };

  // Filter and sort computation
  const filteredSarees = sarees.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || s.type === selectedType;

    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'weaving-days') return a.weavingTime - b.weavingTime;
    return b.rating - a.rating; // default: high rating popularity
  });

  // Financial calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    let price = item.saree.price;
    if (item.customBlouseStyle) {
      price += 1800; // Stitching add-on constant
    }
    return sum + (price * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100) : 0;
  const freeShippingThreshold = 50000; // Free express delivery above 50K INR
  const shippingCharge = (cartSubtotal - discountAmount) >= freeShippingThreshold || cartSubtotal ===0 ? 0 : 350;
  const orderTotal = Math.max(0, cartSubtotal - discountAmount) + shippingCharge;

  // Verify and Apply promo coupon codes
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;

    try {
      const resp = await fetch(getApiUrl('/api/coupons'));
      if (resp.ok) {
        const couponsList: any[] = await resp.json();
        const found = couponsList.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
        
        if (found) {
          setAppliedCoupon(found);
          setCouponCode('');
        } else {
          setCouponError('Invalid or expired coupon regulation.');
        }
      } else {
        setCouponError('Could not sync with coupon registry server.');
      }
    } catch {
      setCouponError('Network error verifying promo code.');
    }
  };

  // Simulate Address suggestions from PIN code entry
  const handlePincodeAutofill = (pin: string) => {
    setShippingAddress(prev => ({ ...prev, pincode: pin }));
    const cleanPin = pin.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      // Direct Indian State mappings
      const digit = parseInt(cleanPin.charAt(0), 10);
      let city = 'Bengaluru';
      let state = 'Karnataka';
      if (digit === 1) { city = 'New Delhi'; state = 'Delhi'; }
      else if (digit === 2) { city = 'Varanasi'; state = 'Uttar Pradesh'; }
      else if (digit === 3) { city = 'Jaipur'; state = 'Rajasthan'; }
      else if (digit === 4) { city = 'Mumbai'; state = 'Maharashtra'; }
      else if (digit === 5) { city = 'Secunderabad'; state = 'Telangana'; }
      else if (digit === 6) { city = 'Kochi'; state = 'Kerala'; }
      else if (digit === 7) { city = 'Kolkata'; state = 'West Bengal'; }
      else if (digit === 8) { city = 'Patna'; state = 'Bihar'; }

      setShippingAddress(prev => ({
        ...prev,
        city,
        state,
        pincode: cleanPin
      }));
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine) {
      alert('Kindly fill in all required shipping coordinates.');
      return;
    }
    setCheckoutStep('payment');
  };

  // Checkout submit triggers full backend order creation and logs confirmations
  const handleConfirmOrderPayment = async () => {
    const payload = {
      customerName: shippingAddress.fullName,
      customerEmail: user ? user.email : 'guest-' + Date.now() + '@spssarees.com',
      customerPhone: shippingAddress.phone,
      items: cart,
      discountAmount,
      totalAmount: orderTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      shippingAddress: `${shippingAddress.addressLine}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`,
      paymentMethod
    };

    try {
      const resp = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data: any = {};
      const contentType = resp.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        throw new Error(text.substring(0, 150) || 'Server returned an invalid HTML or plain text response.');
      }

      if (!resp.ok) {
        throw new Error(data.error || 'Failed to process order placement.');
      }

      if (paymentMethod === 'CASHFREE') {
        const directPayUrl = data.cashfreeEnv === "production"
          ? `https://payments.cashfree.com/order/#${data.payment_session_id}`
          : `https://payments-test.cashfree.com/order/#${data.payment_session_id}`;

        // Initialize progress tracker screen with secure connections in case they navigate back or return
        setPendingCashfreeOrder(data);

        let sdkLaunched = false;
        if (data.payment_session_id && (window as any).Cashfree) {
          try {
            const cf = (window as any).Cashfree({
              mode: data.cashfreeEnv === "production" ? "production" : "sandbox"
            });
            cf.checkout({
              paymentSessionId: data.payment_session_id,
              redirectTarget: "_self"
            });
            sdkLaunched = true;
          } catch (sdkErr) {
            console.error("Cashfree SDK instantiation error, auto-navigating to secure link:", sdkErr);
          }
        }

        if (!sdkLaunched) {
          window.location.href = directPayUrl;
        }
        return;
      }

      setPlacedOrderDetails({
        orderId: data.id,
        items: cart,
        total: orderTotal,
        address: shippingAddress,
        payment: 'Cash on Delivery (COD)'
      });
      setCheckoutStep('completed');
      setCart([]); // Clean Cart
      setAppliedCoupon(null); // Clear coupons
    } catch (err: any) {
      alert('Order Placement Error: ' + err.message);
    }
  };

  const handleAuthSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('saree_store_token', newToken);
    localStorage.setItem('saree_store_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('saree_store_token');
    localStorage.removeItem('saree_store_user');
    setActiveSection('collection');
  };

  // Direct state router bypass for Admin Portal
  if (activeSection === 'admin-dashboard' && token && user?.role === 'admin') {
    return (
      <AdminDashboard 
        token={token}
        onLogout={handleLogout}
        onBackToStore={() => setActiveSection('collection')}
      />
    );
  }

  if (activeSection === 'admin-login') {
    return (
      <AdminLogin 
        onLoginSuccess={(t, u) => {
          handleAuthSuccess(t, u);
          setActiveSection('admin-dashboard');
        }}
        onBackToStore={() => setActiveSection('collection')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/40 text-stone-900 font-sans flex flex-col justify-between">
      
      {/* Top Session Sub-Header Ribbon for Auth toggles as required */}
      <div className="bg-stone-900 text-stone-300 py-1.5 px-4 text-[11px] border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-amber-500">★ Direct Weaver Channel:</span>
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-100 flex items-center gap-1 font-sans">
                  <User className="w-3 h-3 text-amber-500" />
                  <span>Namaste, {user.name}</span>
                </span>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setActiveSection('admin-dashboard')}
                    className="text-amber-400 hover:text-amber-500 font-bold ml-1 uppercase text-[9px] tracking-wide bg-amber-900/40 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Admin Hub
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-rose-400 font-bold ml-2 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="hover:text-amber-400 font-bold cursor-pointer"
                >
                  Customer Access Sign In
                </button>
                <span className="text-stone-700">|</span>
                <button 
                  onClick={() => setActiveSection('admin-login')}
                  className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Weaver Admin login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navbar header */}
      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onCartClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />

      {/* Main Sections Body View */}
      <main className="flex-grow pb-16">
        
        {/* Authentic Silk Mark Announcement Bar as shown in reference */}
        <div className="bg-[#800517] text-stone-100 py-3 px-4 text-xs font-semibold tracking-wide border-b border-amber-800/20 shadow-sm leading-tight">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-100">
                Authentic Silk Mark Assured · Direct Loom Sourced
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-xs uppercase tracking-wider text-stone-200">
              <span className="font-medium">★ 4.98 Buyer Trust Score</span>
              <span className="text-stone-400">|</span>
              <span className="text-amber-400 font-bold">Free Insured Shipping On ₹40K+</span>
            </div>
          </div>
        </div>

        {/* VIEW 1: Storefront Catalog */}
        {activeSection === 'collection' && (
          <div>
            
            {/* Elegant Luxury Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <section className="relative bg-stone-950 text-stone-100 overflow-hidden rounded-[2rem] py-16 sm:py-24 px-8 sm:px-12 md:px-16 shadow-2xl border border-amber-900/10">
                <div className="absolute inset-0 z-0">
                  {/* Curated high-quality traditional silk saree & bridal jewelry background photo as requested */}
                  <img
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=85"
                    alt="Traditional Kanjivaram Bridal Saree & Jewelry"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 object-[85%_35%] pointer-events-none scale-100 transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle luxurious warm ambient overlay to guarantee absolute text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-900/30 md:to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl flex flex-col items-start gap-4">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] font-bold backdrop-blur-md shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
                    <span>Pure mulberry silk &amp; genuine zari looms</span>
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-50 tracking-tight font-extrabold leading-tight">
                    Unfolding the Soul <br className="hidden sm:inline" />of Indian Artistry.
                  </h1>
                  
                  <p className="text-stone-300 text-sm leading-relaxed max-w-lg mt-2 font-medium">
                    Every weave at <strong>SPS SAREES (Sri Praharsha Silk Sarees)</strong> is handcrafted over weeks on certified heritage pit looms. Sourced directly from standard weavers’ co-operatives in Kanchipuram, Varanasi, Paithan, and Pochampally.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={() => {
                        const target = document.getElementById('collection-browse');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-xs px-6 py-3 rounded shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>Explore Masterpieces</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('care')}
                      className="border border-stone-500 hover:bg-white/5 text-stone-200 text-xs font-bold px-6 py-3 rounded transition-colors"
                    >
                      Authenticity Pledge
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Content Filters & Collection Grid */}
            <section id="collection-browse" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              
              {/* Filter Controls Row */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search Text */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by weave, fabric, origin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-stone-300 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                {/* Filter Categories pills */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {['All', ...Array.from(new Set(sarees.map(s => s.type)))].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        selectedType === type
                          ? 'bg-amber-900 border-amber-900 text-stone-50 shadow-sm'
                          : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Sort selection drop down */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-stone-400 text-xs shrink-0 font-medium">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-stone-300 rounded text-xs px-2.5 py-2 w-full md:w-44 focus:outline-none"
                  >
                    <option value="rating-high">Highest Rated (Popular)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="weaving-days">Shortest Weave Process</option>
                  </select>
                </div>

              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredSarees.map((saree) => (
                  <SareeCard
                    key={saree.id}
                    saree={saree}
                    onViewDetails={(s) => setSelectedSareeForDetails(s)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some(item => item.id === saree.id)}
                    onInstantMatch={handleInstantMatch}
                  />
                ))}
              </div>

              {filteredSarees.length === 0 && (
                <div className="text-center py-24 bg-stone-50 rounded-2xl border border-stone-200 mt-6 p-4">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-700 font-serif font-bold text-lg mb-1">No Loom Masterpieces Found</p>
                  <p className="text-stone-500 text-xs">Try adjusting your search query or selecting a different saree subset.</p>
                </div>
              )}

            </section>
          </div>
        )}

        {/* VIEW 2: Blouse Match Studio */}
        {activeSection === 'studio' && (
          <BlouseStudio
            sarees={sarees}
            selectedSaree={selectedSareeForStudio}
            onAddToCartWithBlouse={handleAddToCart}
          />
        )}

        {/* VIEW 3: Care & Authenticity Guide */}
        {activeSection === 'care' && <CareGuide />}

        {/* VIEW 4: Bespoke Consultation */}
        {activeSection === 'custom' && <CustomWeaveForm />}

        {/* VIEW 5: Assurances & Legal Policies */}
        {activeSection === 'policies' && (
          <PoliciesView 
            initialTab={selectedPolicyTab} 
            onBackToStore={() => setActiveSection('collection')} 
          />
        )}

        {/* VIEW 6: Real-Time Order Tracking Timeline Ledger */}
        {activeSection === 'tracking' && (
          <OrderTracker 
            token={token}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

      </main>

      {/* Saree Details Modal block */}
      {selectedSareeForDetails && (
        <SareeDetailsModal
          saree={selectedSareeForDetails}
          onClose={() => setSelectedSareeForDetails(null)}
          onAddToCart={(s) => {
            handleAddToCart(s);
            setSelectedSareeForDetails(null);
          }}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some(item => item.id === selectedSareeForDetails.id)}
        />
      )}

      {/* Customer Authentication Modal Overlay */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Wishlist Sidebar Overlay */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex justify-end">
          <div className="relative w-full max-w-md bg-[#FCFAF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#ECE6DD]">
            
            {/* Wishlist Header */}
            <div className="p-4 sm:p-6 border-b border-[#ECE6DD] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                <h3 className="font-serif font-bold text-lg text-stone-900">Saved Masterpieces</h3>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-[#FAF7F2] rounded-full" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Content list */}
            <div className="p-4 sm:p-6 flex-grow overflow-y-auto space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <Heart className="w-12 h-12 text-stone-300 mb-3" />
                  <p className="text-stone-700 font-serif font-bold text-sm">Your saved trunk is empty</p>
                  <p className="text-stone-400 text-xs mt-1">Sarees you add to your wishlist will display here.</p>
                </div>
              ) : (
                wishlist.map((saree) => (
                  <div key={saree.id} id={`wish-row-${saree.id}`} className="flex gap-4 border-b border-stone-200/60 pb-4">
                    <img src={saree.image} alt="" className="w-16 h-20 object-cover rounded-md border" referrerPolicy="no-referrer" />
                    <div className="flex-grow flex flex-col justify-between py-0.5">
                      <div>
                        <span className="text-[9px] uppercase font-mono tracking-widest text-amber-800 font-bold block">{saree.type}</span>
                        <h4 className="font-serif font-bold text-xs text-stone-900 line-clamp-1">{saree.name}</h4>
                        <span className="text-xs font-bold text-amber-955 mt-1 block">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(saree.price)}
                        </span>
                      </div>
                      <div className="flex gap-2.5 mt-2">
                        <button
                          onClick={() => {
                            handleAddToCart(saree);
                            setIsWishlistOpen(false);
                          }}
                          className="text-[10px] bg-amber-900 text-stone-50 font-bold px-3 py-1 rounded"
                        >
                          Add to Bag
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(saree)}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Wishlist slide-out action block */}
            <div className="p-6 border-t border-stone-200 bg-stone-100/50">
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-full bg-stone-900 hover:bg-black text-stone-50 text-xs font-bold py-3 px-4 rounded-lg text-center"
              >
                Close saved items
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Shopping Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex justify-end">
          <div className="relative w-full max-w-lg bg-stone-20 h-full shadow-2xl flex flex-col bg-stone-50 border-l border-stone-200">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-900" />
                <h3 className="font-serif font-bold text-lg text-stone-900">Your Shopping Trunk</h3>
                <span className="text-[11px] bg-amber-900/10 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
                </span>
              </div>
              <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} className="p-2 hover:bg-stone-200 rounded-full" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicators */}
            {checkoutStep !== 'completed' && (
              <div className="bg-stone-100/50 px-5 py-3 border-b border-stone-200 flex items-center justify-between text-xs font-bold">
                {[
                  { id: 'cart', label: '1. Cart' },
                  { id: 'shipping', label: '2. Address' },
                  { id: 'payment', label: '3. Payment' }
                ].map((st, i) => {
                  const isActive = checkoutStep === st.id;
                  return (
                    <div key={i} className={`flex items-center gap-1 ${isActive ? 'text-amber-900' : 'text-stone-400'}`}>
                      <span>{st.label}</span>
                      {i < 2 && <span className="text-stone-300 font-light font-mono">/</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Scrolling Checkout Body block */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
              
              {/* STEP A: CART DISPLAY */}
              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  
                  {/* Upsell Banner */}
                  {cartSubtotal > 0 && cartSubtotal < freeShippingThreshold && (
                    <div className="bg-amber-50 border border-amber-800/10 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span>Add <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(freeShippingThreshold - cartSubtotal)}</strong> more to unlock <strong className="uppercase">Free Express Silk-Care Delivery</strong>.</span>
                      </div>
                    </div>
                  )}

                  {cart.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">
                      <ShoppingBag className="w-14 h-14 text-stone-200 mb-4" />
                      <p className="text-stone-700 font-serif font-bold text-sm">Your trunk is currently vacant</p>
                      <p className="text-stone-400 text-xs mt-1">Select a masterpiece from the gallery to begin.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 bg-amber-900 text-white font-bold text-xs px-5 py-2 rounded shadow-sm cursor-pointer hover:bg-amber-950"
                      >
                        Browse Gallery
                      </button>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} id={`cart-row-${idx}`} className="flex gap-4 border-b border-stone-200/50 pb-4">
                        <img src={item.saree.image} alt="" className="w-16 h-22 object-cover rounded-md border" referrerPolicy="no-referrer" />
                        
                        <div className="flex-grow flex flex-col">
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-amber-900 font-bold font-mono">{item.saree.type} ({item.saree.origin})</span>
                              <h4 className="font-serif font-bold text-sm text-stone-950 line-clamp-1">{item.saree.name}</h4>
                            </div>
                            <button onClick={() => removeFromCart(idx)} className="p-1 text-stone-400 hover:text-stone-700" title="Delete product">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Custom Blouse details block */}
                          {item.customBlouseStyle && (
                            <div className="mt-1.5 bg-stone-100 rounded-md p-2 border border-stone-200/50 text-[10px] text-stone-605">
                              <span className="font-bold text-amber-900 uppercase tracking-widest block mb-0.5">Bespoke Boutique Configuration:</span>
                              <div>Fabric Hue: {item.customBlouseStyle.colorName}</div>
                              <div>Silhouette: {item.customBlouseStyle.neckStyle} • Sleeve: {item.customBlouseStyle.sleeveLength}</div>
                              <div>Decors: {item.customBlouseStyle.borderType} (+₹1,800 stitching included)</div>
                            </div>
                          )}

                          {/* Quantity control rows */}
                          <div className="flex justify-between items-end mt-3 border-t border-stone-200/40 pt-2">
                            <div className="flex items-center gap-1.5 bg-stone-100 rounded border px-1">
                              <button onClick={() => updateCartQty(idx, -1)} className="p-1 hover:text-stone-900 border-none justify-center flex items-center" title="Decrease">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-stone-800 px-1 font-mono">{item.quantity}</span>
                              <button onClick={() => updateCartQty(idx, 1)} className="p-1 hover:text-stone-900 border-none justify-center flex items-center" title="Increase">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <span className="font-mono text-xs font-bold text-stone-900 text-right">
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                              }).format((item.saree.price + (item.customBlouseStyle ? 1800 : 0)) * item.quantity)}
                            </span>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* STEP B: SHIPPING ADDRESS WORKFLOW */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <h4 className="font-bold text-sm text-stone-900">Shipping Destination</h4>
                    <p className="text-stone-400 text-xs">Enter delivery coordinates. We utilize secured express channels inside India.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Receiver Full Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        placeholder="e.g. Radhika Iyer"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Contact Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">House/Apartment Address *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.addressLine}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                        placeholder="e.g. flat no 402, Swarnam apartments"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        {/* Indian 6-Digit PIN autofills City/State on completion! */}
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={shippingAddress.pincode}
                          onChange={(e) => handlePincodeAutofill(e.target.value)}
                          placeholder="6-digit code"
                          className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">City Location</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">State Territory</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        placeholder="e.g. Karnataka"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-850"
                      />
                    </div>
                  </div>

                  <div className="bg-stone-100 p-3 rounded-xl border border-stone-250 text-[10px] text-stone-500 italic">
                    💡 <strong>Protip:</strong> Entering a valid 6-digit Indian Postal Code automatically fetches corresponding metropolis city and state territories.
                  </div>

                  <button
                    id="submit-address-btn"
                    type="submit"
                    className="w-full mt-4 bg-stone-900 text-stone-50 text-xs font-semibold py-3 rounded hover:bg-black transition-colors"
                  >
                    Proceed to Payment Gateways
                  </button>
                </form>
              )}

              {/* STEP C: PAYMENT & CHECKOUT INTAKE */}
              {checkoutStep === 'payment' && (
                <div className="space-y-5">
                  <div className="border-b border-stone-200 pb-2">
                    <h4 className="font-bold text-sm text-stone-900">Secure Payment Channel</h4>
                    <p className="text-stone-400 text-xs">Choose your payment mode. Securely processed via Cashfree Payment Gateway.</p>
                  </div>

                  {/* Payment Options list */}
                  <div className="space-y-2.5">
                    {[
                      { id: 'CASHFREE', label: 'Cashfree Secure Gateway (Cards, UPI, Netbanking)', desc: 'Pay securely in real-time via Credit/Debit Cards, Bharat UPI, Wallets, or Netbanking powered by Cashfree.' },
                      { id: 'COD', label: 'Cash on Delivery (COD) available', desc: 'Pay Cash or QR-UPI at the door during package delivery.' }
                    ].map((m) => {
                      const isSelected = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-amber-900 bg-amber-50/20 shadow'
                              : 'border-stone-200 bg-white hover:border-stone-400'
                          }`}
                          onClick={() => setPaymentMethod(m.id as any)}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center mt-0.5 ${
                            isSelected ? 'bg-amber-900 border-amber-900 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-stone-900 block leading-tight mb-1">{m.label}</span>
                            <span className="text-stone-500 text-[10px] leading-relaxed block">{m.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Breakdown details */}
                  <div className="bg-stone-100 p-4 rounded-xl border border-stone-250 text-xs space-y-1.5">
                    <div className="flex justify-between text-stone-500">
                      <span>Store Subtotal</span>
                      <span className="font-mono font-bold text-stone-800">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartSubtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-505">
                      <span>Delivery (Secure Dispatch)</span>
                      <span className="font-mono">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200/50 pt-2 text-sm mt-1.5">
                      <span>Grand Total Order</span>
                      <span className="font-mono text-amber-955">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(orderTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    id="confirm-checkout-btn"
                    onClick={handleConfirmOrderPayment}
                    className="w-full mt-4 bg-amber-900 hover:bg-amber-950 text-stone-50 text-xs font-bold py-3.5 rounded-lg text-center shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    Confirm {paymentMethod === 'COD' ? 'Cash on Delivery Order' : 'Secure Payment & Checkout'}
                  </button>
                </div>
              )}

              {/* STEP D: COMPLETED SUCCESS VIEW */}
              {checkoutStep === 'completed' && placedOrderDetails && (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-6 border border-emerald-200 shadow-md">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                    Order Placed Successfully!
                  </h3>
                  <span className="text-[10px] tracking-widest font-mono text-amber-900 font-extrabold uppercase bg-amber-50 px-3 py-1 border border-amber-900/10 rounded-full">
                    Reference: {placedOrderDetails.orderId}
                  </span>

                  <p className="text-stone-600 text-xs mt-3 leading-relaxed max-w-sm">
                    Thank you for supporting heritage looms. Your transaction was securely authorized using test credentials. A copy of the digital receipt and dispatch tracking handles has been sent to your inbox.
                  </p>

                  {/* Summary card details */}
                  <div className="w-full border border-stone-200 bg-stone-100 rounded-xl p-4 text-left text-xs mt-6 space-y-2.5">
                    <span className="font-bold text-[10px] uppercase font-mono tracking-wider text-stone-400 block pb-1 border-b border-stone-230">Receipt details</span>
                    <div><span className="font-bold">Deliver To:</span> {placedOrderDetails.address.fullName}</div>
                    <div><span className="font-bold">Contact Coordinates:</span> {placedOrderDetails.address.phone}</div>
                    <div><span className="font-bold">Delivery Address:</span> {placedOrderDetails.address.addressLine}, {placedOrderDetails.address.city}, {placedOrderDetails.address.state} - {placedOrderDetails.address.pincode}</div>
                    <div><span className="font-bold">Payment Method:</span> {placedOrderDetails.payment}</div>
                    <div className="flex justify-between font-bold border-t border-stone-200/50 pt-2 mt-1 bg-stone-200/20 px-1 py-0.5 rounded text-amber-955">
                      <span>Total Transacted:</span>
                      <span className="font-mono">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(placedOrderDetails.total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutStep('cart');
                      setIsCartOpen(false);
                      setActiveSection('collection');
                    }}
                    className="w-full mt-8 bg-stone-900 hover:bg-black text-stone-0 text-stone-50 text-xs font-bold py-3.5 rounded-lg text-center"
                  >
                    Continue Legacy Shopping
                  </button>
                </div>
              )}

            </div>

            {/* General Subtotal Footer Drawer */}
            {checkoutStep === 'cart' && cartSubtotal > 0 && (
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-100 rounded-b-2xl space-y-4">
                
                {/* Promo Coupons Applicator form */}
                <div className="border-b border-stone-200/80 pb-3">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-250 p-2 text-xs rounded-lg">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Promo Code Applied: <strong className="font-mono text-amber-955 bg-white px-1 ml-0.5 border border-emerald-200 rounded">{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercentage}%)</span>
                      </div>
                      <button 
                        onClick={() => setAppliedCoupon(null)}
                        className="text-stone-400 hover:text-stone-900 font-bold hover:underline select-none text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. FESTIVE10)"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        className="flex-grow bg-white border border-stone-300 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-900"
                      />
                      <button
                        type="submit"
                        className="bg-stone-900 hover:bg-black text-stone-50 text-xs px-4 py-1.5 rounded font-bold cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <span className="text-rose-600 text-[10px] font-bold mt-1 block">🚨 {couponError}</span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-550 font-medium font-sans">
                    <span>Store Trunk Subtotal</span>
                    <span className="font-mono font-bold text-stone-850">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartSubtotal)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Weaver Discount Code (-{appliedCoupon.discountPercentage}%)</span>
                      <span className="font-mono font-bold">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-550 font-medium">
                    <span>Delivery (Secure Air Cargo)</span>
                    <span className="font-mono">{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                  </div>

                  <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200/50 pt-2 text-sm mt-1.5">
                    <span>Grand Total</span>
                    <span className="font-mono text-amber-955">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(orderTotal)}
                    </span>
                  </div>
                </div>

                <button
                  id="checkout-proceed-btn"
                  onClick={() => setCheckoutStep('shipping')}
                  className="w-full bg-amber-900 hover:bg-amber-950 text-stone-50 text-xs font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Proceed to Shipping Addresses</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER DESIGNS */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs mt-12 bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Brand info */}
          <div className="flex flex-col gap-3.5">
            <span className="text-stone-50 font-serif text-lg tracking-wider font-bold">
              SPS SAREES
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-amber-500 font-bold font-sans">
              Sri Praharsha Silk Sarees
            </span>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              We preserve legacy. Safeguarding ancient pit-loom traditional weaving models by offering global direct-to-consumer portals for authorized master craftsmen and weavers' unions.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Approved Government Handloom Portal
            </span>
          </div>

          {/* Quick Hub Links */}
          <div>
            <span className="text-stone-50 font-serif font-bold text-xs uppercase tracking-wider block mb-3.5">The Legacy Collections</span>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => { setActiveSection('collection'); setSelectedType('Kanjivaram'); }} className="hover:text-amber-500 bg-none border-none text-left p-0">Swarna Gold Kanjivarams</button></li>
              <li><button onClick={() => { setActiveSection('collection'); setSelectedType('Banarasi'); }} className="hover:text-amber-500 bg-none border-none text-left p-0">Rajkumari Shikargah Banarasis</button></li>
              <li><button onClick={() => { setActiveSection('collection'); setSelectedType('Paithani'); }} className="hover:text-amber-500 bg-none border-none text-left p-0">Mayur Pankh Paithanis</button></li>
              <li><button onClick={() => { setActiveSection('collection'); setSelectedType('Pochampally'); }} className="hover:text-amber-500 bg-none border-none text-left p-0">Telia Double Ikat Pochampallys</button></li>
            </ul>
          </div>

          {/* Customer Assistance Hub */}
          <div>
            <span className="text-stone-50 font-serif font-bold text-xs uppercase tracking-wider block mb-3.5">Interactive Features</span>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setActiveSection('studio')} className="hover:text-amber-500 bg-none border-none text-left p-0">Blouse Contrast Matching Studio</button></li>
              <li><button onClick={() => setActiveSection('care')} className="hover:text-amber-500 bg-none border-none text-left p-0">Organic Silk Care Stain Planner</button></li>
              <li><button onClick={() => setActiveSection('custom')} className="hover:text-amber-500 bg-none border-none text-left p-0">Book Weaving Loom Consultation</button></li>
              <li><a href="#about" className="hover:text-amber-500">Government Silk Mark Verification</a></li>
            </ul>
          </div>

          {/* Contact coordinates info */}
          <div>
            <span className="text-stone-50 font-serif font-bold text-xs uppercase tracking-wider block mb-3.5">Indian Handlooms HQ</span>
            <p className="text-stone-405 leading-relaxed text-[11px] mb-2.5">
              Co-operative Loom Hall 3A<br />
              Koppula Charka Rd, Pochampally,<br />
              Telangana, 508284, India
            </p>
            <a href="https://wa.me/919876543210" className="inline-flex items-center gap-1.5 text-amber-550 hover:text-amber-400 bg-none border-none p-0 text-[11px]" target="_blank" rel="noreferrer">
              <PhoneCall className="w-3.5 h-3.5" /> <span>Live WhatsApp: +91 98765 43210</span>
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-stone-800 text-center text-[10px] text-stone-500 flex flex-wrap justify-between items-center gap-4">
          <span>&copy; 2026 SPS Sarees (Sri Praharsha Silk Sarees) Handwoven Boutique. All Rights Reserved. Co-op under Ministry of Textiles Registration code: IN-HL-2460.</span>
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-end text-[11px]">
            <button onClick={() => { setSelectedPolicyTab('terms'); setActiveSection('policies'); }} className="hover:underline hover:text-amber-500 cursor-pointer transition-colors">Terms & Conditions</button>
            <span className="text-stone-800">|</span>
            <button onClick={() => { setSelectedPolicyTab('refund'); setActiveSection('policies'); }} className="hover:underline hover:text-amber-500 cursor-pointer transition-colors">Refund Policy</button>
            <span className="text-stone-800">|</span>
            <button onClick={() => { setSelectedPolicyTab('return'); setActiveSection('policies'); }} className="hover:underline hover:text-amber-500 cursor-pointer transition-colors">Return Policy</button>
            <span className="text-stone-800">|</span>
            <button onClick={() => { setSelectedPolicyTab('shipping'); setActiveSection('policies'); }} className="hover:underline hover:text-amber-500 cursor-pointer transition-colors">Shipping Policy</button>
            <span className="text-stone-800">|</span>
            <button onClick={() => { setSelectedPolicyTab('privacy'); setActiveSection('policies'); }} className="hover:underline hover:text-amber-500 cursor-pointer transition-colors">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* CASHFREE PAYMENT SECURE CHECKOUT HANDOFF & VERIFICATION */}
      {pendingCashfreeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-6 text-white text-center relative">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                Cashfree PG Secure Checkout Portal
              </span>
              <h2 className="text-xl font-serif font-bold tracking-tight">
                Sri Praharsha Silk Sarees
              </h2>
              <p className="text-[11px] text-amber-200 mt-1 font-mono">
                Order Ref: #{pendingCashfreeOrder.id || pendingCashfreeOrder.orderId || "Pending"}
              </p>
              <div className="mt-3 inline-block bg-emerald-500/20 text-emerald-300 font-mono text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full border border-emerald-500/40">
                🔒 Production Live PG Connection
              </div>
            </div>

            {/* Main summary body info */}
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-semibold">Consignee Customer</span>
                  <span className="text-stone-800 text-xs font-bold">{pendingCashfreeOrder.customerName || "Heritage Customer"}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-stone-950 block font-mono">
                    ₹{Number(pendingCashfreeOrder.totalAmount || orderTotal).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-amber-800 block bg-amber-500/10 py-0.5 px-2 rounded-full inline-block mt-0.5 font-bold">
                    UPI / Card / NetBanking
                  </span>
                </div>
              </div>

              {/* Secure sandbox message */}
              <div className="text-stone-600 text-[11px] leading-relaxed bg-amber-50/20 p-4 rounded-xl border border-amber-900/10 flex gap-2">
                <span className="text-amber-800 text-sm">✨</span>
                <span>
                  Your secure payment session has been successfully mapped on Cashfree's production systems. Please click below to load the secure checkout gateway page and complete your transaction.
                </span>
              </div>

              {/* Action Operations */}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={
                    pendingCashfreeOrder.cashfreeEnv === "production"
                      ? `https://payments.cashfree.com/order/#${pendingCashfreeOrder.payment_session_id}`
                      : `https://payments-test.cashfree.com/order/#${pendingCashfreeOrder.payment_session_id}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold py-3.5 flex items-center justify-center gap-2 rounded-xl text-center text-xs shadow-md transition-all cursor-pointer select-none"
                >
                  <span>👉 Complete Secure Payment on Cashfree</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <div className="text-center py-2">
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest block mb-2">Once payment is completed</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const orderId = pendingCashfreeOrder.id || pendingCashfreeOrder.orderId;
                        const resp = await fetch(getApiUrl('/api/payments/cashfree-verify'), {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderId })
                        });
                        
                        let result: any = {};
                        const contentType = resp.headers.get("content-type");
                        if (contentType && contentType.includes("application/json")) {
                          result = await resp.json();
                        } else {
                          const text = await resp.text();
                          throw new Error(`Validation response is invalid: ${text.substring(0, 150)}`);
                        }

                        if (resp.ok && result.status === 'success') {
                          setPlacedOrderDetails({
                            orderId,
                            items: cart,
                            total: pendingCashfreeOrder.totalAmount,
                            address: shippingAddress,
                            payment: 'Cashfree Secure Gateway (Paid)'
                          });
                          setCheckoutStep('completed');
                          setCart([]); // Clean cart Since checkout completed
                          setAppliedCoupon(null);
                          setPendingCashfreeOrder(null);
                        } else {
                          alert('Payment Status Check: ' + (result.error || 'Payment not verified on gateway yet. Please complete the process on Cashfree first.'));
                        }
                      } catch (err: any) {
                        alert('Transaction check exception: ' + err.message);
                      }
                    }}
                    className="w-full bg-stone-900 hover:bg-black text-white font-bold py-2.5 flex items-center justify-center gap-2 rounded-xl text-center text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Verify Completed Transaction</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPendingCashfreeOrder(null)}
                  className="w-full text-stone-500 hover:text-stone-800 py-1.5 text-center text-[11px] font-medium cursor-pointer"
                >
                  Cancel & Return to Checkout
                </button>
              </div>
            </div>
            
            {/* Secures Footer details */}
            <div className="bg-stone-50 py-3.5 border-t border-stone-150 text-center text-[9px] font-mono text-stone-400 flex items-center justify-center gap-1">
              🔒 PCI-DSS Compliant 256-bit AES End-to-End Secure Gateway Connection
            </div>
          </div>
        </div>
      )}

      {isVerifyingPayment && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-950/95 text-white p-6 backdrop-blur-md">
          <div className="text-center max-w-sm space-y-6 animate-in fade-in zoom-in duration-350">
            <div className="relative w-16 h-16 mx-auto">
              {/* Outer brand spin ring */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-amber-500/50 animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif tracking-wide text-amber-100 font-bold">Verifying Authentic Payment</h2>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Connecting to Cashfree production systems to authenticate your handwoven silk masterpiece transaction. Please do not refresh this page...
              </p>
            </div>
            <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase py-1.5 px-3 bg-stone-900/80 rounded-full border border-stone-800 inline-block">
              🔒 PCI-DSS SECURE GATEWAY CONNECTION
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
