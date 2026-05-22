/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Landmark, Coins, Check, Send, AlertCircle } from 'lucide-react';
import { WeavingConsultation, SareeType } from '../types';

export default function CustomWeaveForm() {
  const [formData, setFormData] = useState<WeavingConsultation>({
    name: '',
    email: '',
    phone: '',
    sareeType: 'Kanjivaram',
    colorPreference: 'Midnight Emerald & Coral',
    zariPreference: 'Pure Gold Zari',
    budgetMin: 15000,
    budgetMax: 30000,
    eventDate: '',
    specialInstructions: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Dynamic loom time estimator based on form properties
  const calculateEstimatedDays = () => {
    let baseDays = 15;
    if (formData.sareeType === 'Kanjivaram') baseDays += 14;
    else if (formData.sareeType === 'Banarasi') baseDays += 20;
    else if (formData.sareeType === 'Paithani') baseDays += 10;
    else if (formData.sareeType === 'Pochampally') baseDays += 4;

    if (formData.zariPreference === 'Pure Gold Zari') baseDays += 10;
    else if (formData.zariPreference === 'Silver Zari') baseDays += 7;

    return baseDays;
  };

  const estimatedDays = calculateEstimatedDays();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({
      ...prev,
      budgetMax: value,
      budgetMin: Math.round(value * 0.7)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Kindly fill out your contact coordinates so our weave masters can reach out.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-800/20 text-xs font-mono font-bold text-amber-900 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Loom Commission Service</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold tracking-tight">
          Bespoke Custom Weaves
        </h2>
        <p className="mt-2 text-stone-600 text-sm leading-relaxed">
          Commission a dedicated pit loom for your special day. Work side-by-side with our legacy weavers to formulate color combinations, pattern motifs, and personalized zari densities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COMPONENT: Interactive form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 lg:p-8">
          
          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-6 border border-emerald-200 shadow-md">
                <Check className="w-8 h-8 font-extrabold" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Loom Proposal Received!
              </h3>
              <p className="text-stone-600 text-xs max-w-md mx-auto leading-relaxed mb-6">
                Thank you, <strong>{formData.name}</strong>. Your custom weaving proposal has been submitted to our Co-operative Weaving Directors in <strong>{formData.sareeType === 'Kanjivaram' ? 'Kanchipuram' : formData.sareeType === 'Banarasi' ? 'Varanasi' : formData.sareeType === 'Paithani' ? 'Paithan' : 'Pochampally'}</strong>. 
                Our design coordinator will reach out to you within the next 24 hours.
              </p>

              <div className="bg-stone-100 border border-stone-200 text-stone-800 p-4 rounded-xl text-left text-xs max-w-lg mb-8 space-y-2">
                <div><span className="font-bold">Proposed Saree:</span> Bespoke {formData.sareeType} Saree</div>
                <div><span className="font-bold">Thread Colorway:</span> {formData.colorPreference}</div>
                <div><span className="font-bold">Zari Config:</span> {formData.zariPreference}</div>
                <div><span className="font-bold">Target Timeframe:</span> Weave starts in 3 days, estimated completion in {estimatedDays} days.</div>
              </div>

              <button
                id="reset-consultation-btn"
                onClick={() => setSubmitted(false)}
                className="text-xs bg-amber-900 text-stone-50 font-semibold px-6 py-2 rounded-lg hover:bg-amber-950 transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">Commission Intake Form</h3>
                <p className="text-stone-500 text-xs">Enter your coordinates and specifications to compute weaver time estimates.</p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Radhika Iyer"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Loom Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Saree Family Clan</label>
                  <select
                    name="sareeType"
                    value={formData.sareeType}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800"
                  >
                    {['Kanjivaram', 'Banarasi', 'Paithani', 'Pochampally'].map(fam => (
                      <option key={fam} value={fam}>{fam}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Zari Selection Spec</label>
                  <select
                    name="zariPreference"
                    value={formData.zariPreference}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800"
                  >
                    {['Pure Gold Zari', 'Tested Zari', 'Silver Zari', 'Antique Zari', 'No Zari'].map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Requested Delivery Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-1 text-xs text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Color details */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Preferred Colorway Schema</label>
                <input
                  type="text"
                  name="colorPreference"
                  value={formData.colorPreference}
                  onChange={handleInputChange}
                  placeholder="e.g. Deep Forest Green base color with traditional contrast Mustard borders"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-800"
                />
              </div>

              {/* Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-stone-600">Maximum Budget Limit</label>
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-800/20">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(formData.budgetMax)}
                  </span>
                </div>
                <input
                  type="range"
                  min="12000"
                  max="60000"
                  step="1000"
                  value={formData.budgetMax}
                  onChange={handleBudgetChange}
                  className="w-full accent-amber-900"
                />
                <span className="block mt-1 text-[10px] text-stone-400">
                  Target Price Range: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(formData.budgetMin)} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(formData.budgetMax)}
                </span>
              </div>

              {/* Special specs notes */}
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Tell us about preferred motifs or pattern scenes</label>
                <textarea
                  name="specialInstructions"
                  rows={3}
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g. Please incorporate small silver-lined elephant buttis inside the border grids, and write a custom initials embroidery under the pallu weave."
                  className="w-full bg-white border border-stone-300 rounded p-2 text-xs focus:outline-none text-stone-800 focus:ring-1 focus:ring-amber-900"
                />
              </div>

              <button
                id="submit-consultation-btn"
                type="submit"
                className="w-full bg-amber-900 hover:bg-amber-950 text-stone-50 text-xs font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Loom Proposal</span>
              </button>

            </form>
          )}

        </div>

        {/* RIGHT COLUMN: Real-Time Live Loom Estimator Calculations (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-stone-900 rounded-2xl p-6 text-stone-100 flex flex-col justify-between shadow-xl border border-stone-800">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-500 font-mono block mb-1">
              Active Loom Engine Calculations
            </span>
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Real-time Pit Loom Estimator
            </h3>

            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              Our estimators translate thread counts, hand dye requirements, and layout difficulty into direct weaver calendar days. Choose combinations to coordinate the optimal delivery timeframe.
            </p>

            <div className="space-y-4 bg-stone-800/60 border border-stone-700/50 p-4 rounded-xl">
              
              <div className="flex justify-between items-center border-b border-stone-720 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-400 font-mono uppercase">Weaving Origin Site</span>
                  <span className="text-white text-xs font-bold">
                    {formData.sareeType === 'Kanjivaram' && 'Kanchipuram, TN'}
                    {formData.sareeType === 'Banarasi' && 'Varanasi, UP'}
                    {formData.sareeType === 'Paithani' && 'Paithan, MH'}
                    {formData.sareeType === 'Pochampally' && 'Pochampally, TS'}
                  </span>
                </div>
                <Landmark className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex justify-between items-center border-b border-stone-720 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-400 font-mono uppercase">Est. Labor Days Required</span>
                  <span className="text-white text-xs font-bold">{estimatedDays} Business Days</span>
                </div>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex justify-between items-center pb-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-400 font-mono uppercase">Indicative Quota Cost</span>
                  <span className="text-white text-xs font-bold">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(formData.budgetMin)} - {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(formData.budgetMax)}
                  </span>
                </div>
                <Coins className="w-5 h-5 text-amber-500" />
              </div>

            </div>

            <div className="mt-6 flex items-start gap-2 text-stone-400 text-xs bg-stone-850 p-3 rounded-lg border border-stone-700/20">
              <Calendar className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-[11px] block">Wedding Delivery Lock</span>
                <span>
                  {formData.eventDate ? (
                    `Proposal requested for delivery before ${formData.eventDate}. If accepted, our weaver is guaranteed to deploy starting this week.`
                  ) : (
                    'Input desired event date above to verify if weaver schedules permit completion.'
                  )}
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-800 pt-5 mt-6 text-[10px] text-stone-400 flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              All custom sarees are handcrafted following ancient, authorized handloom protocols. Pure silk yarns are naturally dyed. Slight variations in borders are indicative of organic hand movements.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
