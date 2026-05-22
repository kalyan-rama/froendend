/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Saree, Review } from './types';

export const SAREES_DATA: Saree[] = [
  {
    id: 'saree-kanjivaram-royal',
    name: 'Swarna Mayil Kanjivaram Silk Saree',
    type: 'Kanjivaram',
    price: 24500,
    originalPrice: 28500,
    description: 'Woven with absolute precision near Kanchipuram, this masterpiece features exquisite swarna (gold) and velli (silver) zari peacock and rudraksha motifs gracefully running across the premium mulberry silk canvas. A heavy contrast pallu and a traditional Korvai border make it a premium heritage jewel, suitable for grand celebrations and bridal heirlooms.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Temple Gold',
    colorHex: '#C5A059',
    contrastColor: 'Deep Crimson Red',
    contrastColorHex: '#8C1C24',
    zariType: 'Pure Gold Zari',
    silkMarkApproved: true,
    weight: 850,
    warpCount: '3-Ply Pure Mulberry Silk',
    origin: 'Kanchipuram, Tamil Nadu',
    weavingTime: 28,
    stock: 2,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Bridal', 'Bestseller', 'Pure Gold Zari']
  },
  {
    id: 'saree-banarasi-crimson',
    name: 'Rajkumari Shikargah Banarasi Silk',
    type: 'Banarasi',
    price: 18900,
    originalPrice: 22000,
    description: 'An architectural fantasy woven in fine silk, depicting the highly revered Shikargah layout — featuring a dense hunting scene with birds, animals, and floral creepers. The crimson silk weft is entirely overlaid with intricate, fine gold zari threads, creating a shimmering royal veil with exceptional drape and luxurious weight.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Crimson Red',
    colorHex: '#A2101F',
    contrastColor: 'Classic Forest Green',
    contrastColorHex: '#12482F',
    zariType: 'Antique Zari',
    silkMarkApproved: true,
    weight: 920,
    warpCount: 'Katan Silk (Pure Mulberry)',
    origin: 'Varanasi, Uttar Pradesh',
    weavingTime: 36,
    stock: 3,
    rating: 4.8,
    reviewsCount: 22,
    tags: ['Royal Weave', 'Rich Brocade', 'Silk Mark']
  },
  {
    id: 'saree-paithani-blue',
    name: 'Mayur Pankh Paithani Silk Saree',
    type: 'Paithani',
    price: 21500,
    originalPrice: 25000,
    description: 'A stellar Maharashtrian masterpiece in electric royal blue, defined by a lavish, multi-colored oblique silk-woven pallu showcasing fine peacock motifs sitting on floral branches. The iconic border is heavily set with pure gold zari base lines (Narali border), handwoven meticulously on standard pit looms.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Indigo Royal Blue',
    colorHex: '#123D7F',
    contrastColor: 'Vibrant Magenta Pink',
    contrastColorHex: '#BD1162',
    zariType: 'Pure Gold Zari',
    silkMarkApproved: true,
    weight: 790,
    warpCount: 'Filature Silk × Organzine Silk',
    origin: 'Paithan, Maharashtra',
    weavingTime: 22,
    stock: 4,
    rating: 4.9,
    reviewsCount: 15,
    tags: ['Peacock Pallu', 'Traditional Caret']
  },
  {
    id: 'saree-pochampally-coral',
    name: 'Telia Rumal Pochampally Ikat Silk',
    type: 'Pochampally',
    price: 14200,
    originalPrice: 17000,
    description: 'This Pochampally Ikat features geometric symmetry that is both ancient and amazingly modern. Using the tie-and-dye double ikat process, both the warp and weft silk yarns are dyed multiple times after precise binding, resulting in sharp, feathered brick-red and coal-black motifs with exceptional texture.',
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Terracotta Coral',
    colorHex: '#D5563D',
    contrastColor: 'Sovereign Midnight Blue',
    contrastColorHex: '#0D2040',
    zariType: 'Tested Zari',
    silkMarkApproved: true,
    weight: 680,
    warpCount: 'Charka Hand-reeled Silk',
    origin: 'Pochampally, Telangana',
    weavingTime: 14,
    stock: 5,
    rating: 4.7,
    reviewsCount: 29,
    tags: ['Double Ikat', 'Geometric', 'Lightweight Silk']
  },
  {
    id: 'saree-kanjivaram-mint',
    name: 'Vaidurya Mint Kanjivaram Silk',
    type: 'Kanjivaram',
    price: 22800,
    originalPrice: 26500,
    description: 'A charming soft pastel alternative to dark temple colors, this mint green mulberry silk is matched with a solid magenta-rose border. It is double-warped and highlights small concentric gold buttis (dots) across the body, leading to an incredibly heavy, gold-covered border illustrating sacred temple spires (Gopuram designs).',
    image: 'https://images.unsplash.com/photo-1610045053151-5184b29bb8f9?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610045053151-5184b29bb8f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Mint Sage Green',
    colorHex: '#7AA38A',
    contrastColor: 'Deep Fuchsia Pink',
    contrastColorHex: '#BB185A',
    zariType: 'Pure Gold Zari',
    silkMarkApproved: true,
    weight: 810,
    warpCount: '2-Ply Pure Mulberry Silk',
    origin: 'Kanchipuram, Tamil Nadu',
    weavingTime: 25,
    stock: 1,
    rating: 5.0,
    reviewsCount: 16,
    tags: ['Pastel Heritage', 'Silk Mark Only']
  },
  {
    id: 'saree-banarasi-silver',
    name: 'Kshitiz Shweta Banarasi Silver Brocade',
    type: 'Banarasi',
    price: 19500,
    originalPrice: 23000,
    description: 'An ethereal white-ivory silk saree woven with a high density of sterling silver zari threads. Popularly called "Alfi Brocade", this style represents a traditional Persian vine arrangement layout. Its clean, pristine color combination makes it exceptionally elegant for summer weddings, receptions, and fine luxury styling.',
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'
    ],
    color: 'Pure Ivory White',
    colorHex: '#F6F3EC',
    contrastColor: 'Regal Royal Blue',
    contrastColorHex: '#14316F',
    zariType: 'Silver Zari',
    silkMarkApproved: true,
    weight: 880,
    warpCount: 'Double Twist Katan Silk',
    origin: 'Varanasi, Uttar Pradesh',
    weavingTime: 30,
    stock: 3,
    rating: 4.9,
    reviewsCount: 14,
    tags: ['Silver Zari', 'Ivory Glamour']
  }
];

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Sunitha Krishnan',
    rating: 5,
    date: '2026-04-12',
    comment: 'The quality of the mulberry silk is phenomenal. The borders have neat, tight stitching and the gold zari shimmer is subtle, and not cheap-looking. Extremely pleased with the authentic Silk Mark certificate that came inside the box!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Priya Deshmukh',
    rating: 5,
    date: '2026-04-20',
    comment: 'Wore the Mayur Pankh Paithani for my daughter’s wedding. Received an incredible amount of compliments on the peacock pallu. Highly recommended for authentic Maharashtrian looms.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Meenakshii S.',
    rating: 4,
    date: '2026-05-01',
    comment: 'The temple gold color is extremely rich and luxurious. Weighs substantial but drapes like butter. Highly professional customer service and quick tracking updates inside India.',
    verified: true
  }
];

export interface StainCareRecipe {
  stainType: string;
  remedyType: string;
  steps: string[];
}

export const SILK_CARE_RECIPES: StainCareRecipe[] = [
  {
    stainType: 'Water Stains',
    remedyType: 'Self-Damping or Professional Ironing',
    steps: [
      'Never rub local spots as this will displace physical silk fibers.',
      'Dampen the complete saree with a light water spray mist evenly.',
      'Place a thin cotton protective cloth over the damp silk.',
      'Iron on low/medium silk heat settings from selvage to selvage until completely dry.'
    ]
  },
  {
    stainType: 'Tea or Coffee',
    remedyType: 'Absorbent Blotting',
    steps: [
      'Immediately blot the spill using dry white paper towels to absorb absolute excess liquid.',
      'Mix equal parts of mild hand wash detergent and white vinegar.',
      'Lightly dab with a soft microfiber cloth. DO NOT rub or scrub!',
      'Hand over to premium dry-cleaners as soon as possible, mentioning the specific spot.'
    ]
  },
  {
    stainType: 'Oily / Curry Spots',
    remedyType: 'Starch or Talcum Powder Blotting',
    steps: [
      'Sprinkle plain white talcum powder or cornstarch heavily over the fresh oily patch.',
      'Leave it untouched for 30 minutes to allow the fine powder to draw out the grease.',
      'Gently vacuum or brush off the powder using soft bristles.',
      'If stain remains, dry cleaners must treat with safe petroleum-based solvents.'
    ]
  },
  {
    stainType: 'Perfume or Deodorant',
    remedyType: 'Alcohol Flushing (By Professionals Only)',
    steps: [
      'Perfumes contain alcohol and oils that break down silk color dyes when heated.',
      'Never iron directly over a fresh perfume spot.',
      'Gently press a clean sponge with lukewarm water, wiping gently outward.',
      'Always apply scent on clothing before wearing, or strictly on skin surfaces instead.'
    ]
  }
];

export const CONTRAST_COLORS_PRESET = [
  { name: 'Sovereign Crimson Red', hex: '#8C1C24' },
  { name: 'Vibrant Magenta Pink', hex: '#BD1162' },
  { name: 'Emerald Forest Green', hex: '#12482F' },
  { name: 'Regal Royal Blue', hex: '#14316F' },
  { name: 'Sunset Terracotta Orange', hex: '#D5563D' },
  { name: 'Midnight Charcoal Black', hex: '#242426' },
  { name: 'Charming Teal Peacock', hex: '#0B4E58' },
];
