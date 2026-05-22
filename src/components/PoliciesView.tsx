/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Scale, ShieldAlert, RotateCcw, Truck, Lock, ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface PoliciesViewProps {
  onBackToStore: () => void;
  initialTab?: 'terms' | 'refund' | 'return' | 'shipping' | 'privacy';
}

const POLICIES_TABS = [
  { id: 'terms', label: 'Terms & Conditions', icon: Scale, subtitle: 'Rules, licensing, and handloom variation declarations' },
  { id: 'refund', label: 'Refund Policy', icon: ShieldAlert, subtitle: 'Secure payment reversals and wire parameters' },
  { id: 'return', label: 'Return Policy', icon: RotateCcw, subtitle: 'Our 7-day weaver protection rules and guidelines' },
  { id: 'shipping', label: 'Shipping Policy', icon: Truck, subtitle: 'Secure air cargo transit times and values' },
  { id: 'privacy', label: 'Privacy Policy', icon: Lock, subtitle: 'Data encryption, cookies, and anti-spam guarantee' },
] as const;

export default function PoliciesView({ onBackToStore, initialTab = 'terms' }: PoliciesViewProps) {
  const [activeTab, setActiveTab] = React.useState<'terms' | 'refund' | 'return' | 'shipping' | 'privacy'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  return (
    <div id="policies-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      
      {/* Editorial Header */}
      <div className="border-b border-amber-900/15 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button 
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-bold uppercase tracking-wider mb-3 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Boutique Collection</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2F1D15] tracking-tight">
            Assurances & Legal Policies
          </h1>
          <p className="text-xs sm:text-sm text-stone-505 mt-2 font-sans max-w-xl">
            At Sri Praharsha Silk Sarees, our operations are framed by transparent weavers’ community covenants designed to guarantee absolute trust.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-150 rounded-xl px-4 py-2.5 text-emerald-850 self-start md:self-auto shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-[11px] leading-tight font-sans">
            <span className="font-bold block">100% Genuine Handloom</span>
            <span className="text-emerald-750">Registered Co-op Registry Agreement</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Panel */}
        <div id="policies-sidebar-nav" className="lg:col-span-1 space-y-2">
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 mb-4 lg:mb-0 lg:sticky lg:top-24">
            <h3 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest px-2.5 mb-3">Policy Directory</h3>
            <div className="space-y-1">
              {POLICIES_TABS.map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all group cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-900 text-stone-50 shadow-md font-medium'
                        : 'hover:bg-amber-900/5 text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-800'}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block">{tab.label}</span>
                      <span className={`text-[9px] line-clamp-1 mt-0.5 ${isCurrent ? 'text-amber-100/80' : 'text-stone-400'}`}>
                        {tab.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-stone-200 px-2 text-[11px] text-stone-550 leading-relaxed">
              <span className="font-bold block text-stone-800 mb-1">Direct Assistance Hub</span>
              Got specific questions about our legal guidelines? Call our master weavers: <strong className="text-amber-900 font-sans block mt-1">+91 98765 43210</strong>
            </div>
          </div>
        </div>

        {/* Content Details Sheet */}
        <div id="policies-content-panel" className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* 1. TERMS & CONDITIONS SHEET */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-4 mb-4">
                <div className="p-2.5 bg-amber-900/10 rounded-xl text-amber-900">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Terms & Conditions of Service</h2>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Last updated: May 20, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone text-xs text-stone-600 leading-relaxed space-y-5">
                <p>
                  Welcome to the **SPS SAREES (Sri Praharsha Silk Sarees)** digital storefront. By accessing this web portal or placing commercial orders, you express absolute concurrence with the administrative, operational, and craft-guarantee regulations listed herein.
                </p>

                <div className="space-y-3 bg-amber-50/50 p-4 border border-amber-900/10 rounded-xl">
                  <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-800" /> Handloom Variation & Craft Honesty Affirmation
                  </h4>
                  <p className="text-[11px] leading-relaxed text-stone-650">
                    SPS Sarees is deeply committed to preserving legacy pit-looms. Because our sarees are authentic handwoven works of art, slight variations in yarn thickness, thread counts (slubs), and color boundaries are standard characteristics of true human weaving. These variations are not defects but are legal proof of pure handloom pedigree.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">1. Customer Eligibility & Account Registrations</h3>
                  <p>
                    Standard clients can access this portal both as guest purchasers and authenticated profile holders. To access the checkout pipeline, you must yield authentic contact coordinates, and we reserve absolute discretion to cancel fake inquiries immediately to preserve weaver dispatch times.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">2. Pricing, Local Taxes, and Duties</h3>
                  <p>
                    All price matrix figures are denoted in Indian Rupees (INR) and represent real-time loom direct values. Goods are inclusive of standard local Indian Handloom craft taxes. Any customized tailoring, such as bespoke contrast blouse designs compiled via our Blouse Match Studio, is billed independently at Checkout.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">3. Safe Usage of Interactive Features</h3>
                  <p>
                    Interactive features, including custom blouse selection sliders, instant mockups, GI tag registrations, and direct loom reservation charts, must be utilized for lawful personal styling queries only. Bulk scraping of our artisan photography archives is strictly prohibited.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">4. Limitation of Liability</h3>
                  <p>
                    We hold no responsibilities for slight hue offsets displayed on individual OLED or LCD mobile screens. We verify all pure material compositions via mandatory Government Silk Mark standards prior to delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. REFUND POLICY SHEET */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-4 mb-4">
                <div className="p-2.5 bg-rose-900/10 rounded-xl text-rose-900">
                  <ShieldAlert className="w-6 h-6 text-rose-800" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Refund Policy & Reversals</h2>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Last updated: May 20, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone text-xs text-stone-600 leading-relaxed space-y-5">
                <p>
                  Our monetary operations operate on swift, automated refund matrices to make sure your capital remains secure at all times.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="font-bold text-stone-850 block mb-1">Standard Card & UPI Refunds</span>
                    <p className="text-[11px] leading-relaxed text-stone-505">
                      Reversed back directly to your source financial instrument (Mastercard, Visa, RuPay, GPay, Paytm) within **5 to 7 operational bank days** of inventory verification at our Pochampally workshop.
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="font-bold text-stone-850 block mb-1">Cash on Delivery (COD)</span>
                    <p className="text-[11px] leading-relaxed text-stone-505">
                      For cash-placed cargo dispatches, we securely transfer the refund amounts electronically via direct NEFT wire. We will request your IFSC and Account Number securely via our official WhatsApp or profile desk.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Bespoke Cancelation Penalty Schedules</h3>
                  <p>
                    Because pure raw mulberry silk yarn is custom-dyed for bespoke orders created on our **Custom Weave Form**, cancellation penalties are configured as follows:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-505">
                    <li><strong className="text-stone-800">Cancelled within 24 hours of submission:</strong> 100% full refund.</li>
                    <li><strong className="text-stone-800">Cancelled post 24 hours (Yarn setup phase):</strong> 30% retention to cover weaver compensation and dye materials setup.</li>
                    <li><strong className="text-stone-800">Post weave-dispatch:</strong> No cancellations possible on raw custom commissioned handlooms.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Discrepancy Inspections</h3>
                  <p>
                    If sarees arrive with certified weaving errors or in an physically damaged parcel, we authorize 100% immediate capital refunds, refunding all associated postal charges without hesitation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. RETURN POLICY SHEET */}
          {activeTab === 'return' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-4 mb-4">
                <div className="p-2.5 bg-amber-900/10 rounded-xl text-amber-900">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Artisan Return Policy</h2>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Last updated: May 20, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone text-xs text-stone-600 leading-relaxed space-y-5">
                <p>
                  We strive to establish complete trust. Therefore, we offer our customers an easy-to-use **7-Day Weaver Return Guarantee** to protect your luxury saree acquisitions.
                </p>

                <div className="bg-amber-50/50 p-4 border border-amber-900/10 rounded-xl space-y-2">
                  <h4 className="font-serif font-bold text-stone-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-amber-800" /> Return Prerequisite Checklist
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-stone-650 list-none pl-0">
                    <li className="flex items-start gap-2">✓ <span className="text-stone-700">Must be requested within **7 calendar days** of verified package arrival.</span></li>
                    <li className="flex items-start gap-2">✓ <span className="text-stone-700">The product must remain completely unworn, unwashed, and unpleated.</span></li>
                    <li className="flex items-start gap-2">✓ <span className="text-stone-700">All original fabric labels, security tags, and the Government Silk Mark certificate hologram card must remain attached.</span></li>
                    <li className="flex items-start gap-2">✓ <span className="text-stone-700">The saree must be returned in its luxurious protective storage box with original moisture-absorbing panels.</span></li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Non-Returnable Bespoke Exclusions</h3>
                  <p>
                    Please note that we cannot process returns or order exchanges for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-500">
                    <li>Sarees which have had their blouses customized, cut, or stitched to order.</li>
                    <li>Custom commissioned textiles compiled via the Bespoke Weaver consultation pipeline.</li>
                    <li>Products explicitly marked as "Loom Sale Masterpiece" with non-refundable tags active during booking.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Initiating a Reverse Pickup</h3>
                  <p>
                    Simply call our direct handloom desk at **+91 98765 43210** or email support@spssarees.com. If your area code supports it, we will arrange a complimentary luxury courier pickup straight from your doorstep. If reverse pick-up is unavailable in small rural pins, we provide up to ₹400 cargo allowance for self-mailing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. SHIPPING POLICY SHEET */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-4 mb-4">
                <div className="p-2.5 bg-amber-900/10 rounded-xl text-amber-900">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Secure Air Cargo Shipping</h2>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Last updated: May 20, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone text-xs text-stone-600 leading-relaxed space-y-5">
                <p>
                  Because handwoven sarees represent precious cultural heritage, we secure custom insured courier routes to make sure orders arrive safely at your doorstep.
                </p>

                <table className="min-w-full divide-y divide-stone-200 text-[11px] font-sans my-4 border border-stone-150">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-stone-800">Order Tier</th>
                      <th className="px-3 py-2 text-left font-bold text-stone-800">Cargo Charges</th>
                      <th className="px-3 py-2 text-left font-bold text-stone-800">Transit Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-600">
                    <tr>
                      <td className="px-3 py-2 font-bold">Standard Storefront (Below ₹50,000)</td>
                      <td className="px-3 py-2 text-amber-900 font-bold">₹350 Flat Rate</td>
                      <td className="px-3 py-2">3 to 5 dispatch shipping days</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-bold text-emerald-800">Premium Heritage (₹50,000 + Above)</td>
                      <td className="px-3 py-2 text-emerald-800 font-bold">FREE Express Delivery</td>
                      <td className="px-3 py-2 font-semibold text-emerald-700">2 to 4 priority shipping days</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-bold">Bespoke Custom Weaves</td>
                      <td className="px-3 py-2">Free Secure Insured Air</td>
                      <td className="px-3 py-2">15 to 45 days (Depends on weave craft)</td>
                    </tr>
                  </tbody>
                </table>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Full Premium Insurance</h3>
                  <p>
                    Every package dispatched is 100% insured. If a logistics partner loses your saree, we will immediately fast-track a master weaver replacement on our central Pochampally looms or issue an immediate full credit.
                  </p>
                </div>

                <div className="space-y-2 bg-emerald-50/40 p-4 border border-emerald-200/50 rounded-xl">
                  <span className="font-bold text-emerald-900 block mb-1">Weaver Protection Packaging</span>
                  <p className="text-[11px] leading-relaxed text-emerald-800">
                    Our luxury boxes are designed to be moisture-proof and impact-resistant, shielding precious gold zari work and natural dyes from heat, humidity, and pressure changes during air travel.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Tracking Parameters</h3>
                  <p>
                    As soon as the loom master releases your package to Air Cargo, a direct SMS tracking link will be sent to your verified mobile number so you can track its journey in real-time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. PRIVACY POLICY SHEET */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-4 mb-4">
                <div className="p-2.5 bg-amber-900/10 rounded-xl text-amber-900">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Privacy & Ledger Protections</h2>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Last updated: May 20, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone text-xs text-stone-600 leading-relaxed space-y-5">
                <p>
                  At SPS Sarees, we protect your personal and financial data. We never sell, lease, or distribute our customer ledger tables to advertisement companies or data brokers.
                </p>

                <div className="space-y-3 bg-stone-50 p-4 border border-stone-250 rounded-xl">
                  <h4 className="font-serif font-bold text-stone-850 text-xs uppercase tracking-wider">What Data We Handle Safely:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-stone-700 font-sans">
                    <li><strong className="text-stone-900">Coordinates:</strong> Full name, electronic mail addresses, secure shipping coordinates, and phone numbers.</li>
                    <li><strong className="text-stone-900">Blouse Dimensions:</strong> Tailoring parameters, shoulder sizes, and chest profiles stored inside the Blouse Match Studio.</li>
                    <li><strong className="text-stone-900">Financial Tokens:</strong> Cryptographically encrypted bank tokens required for secure payments. We never store raw credit card numbers.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Secure Socket Layer (SSL) Integrations</h3>
                  <p>
                    All API communications and payment checkouts are protected by high-grade TLS 1.3 encryption mechanisms, keeping your personal details safe from interception.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Cookies and Device Store Parameters</h3>
                  <p>
                    We utilize small browser cookie keys strictly to remember your active wishlisted items, products in the shopping bag, and customized blouse layouts across standard browser sessions.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-stone-905 text-sm">Right to Erasure</h3>
                  <p>
                    You have the right to request the complete deletion of your customer profile, dimensions database, or orders logs by sending a direct request to privacy@spssarees.com.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
