/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SareeType = string;

export interface Saree {
  id: string;
  name: string;
  type: SareeType;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  gallery: string[];
  color: string;
  colorHex: string;
  contrastColor: string;
  contrastColorHex: string;
  zariType: 'Pure Gold Zari' | 'Tested Zari' | 'Silver Zari' | 'Antique Zari';
  silkMarkApproved: boolean;
  weight: number; // in grams
  warpCount: string;
  origin: string;
  weavingTime: number; // in days
  stock: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CartItem {
  saree: Saree;
  quantity: number;
  customBlouseStyle?: CustomBlouseConfig;
}

export interface CustomBlouseConfig {
  colorName: string;
  colorHex: string;
  borderType: 'None' | 'Zari Border' | 'Thread Work' | 'Elbow Mesh Border';
  neckStyle: 'Classic Round' | 'Deep U-Neck' | 'Royal Boat-Neck' | 'Backless Cutout' | 'Elegant Pot-Neck';
  sleeveLength: 'Sleeveless' | 'Short Sleeve' | 'Elbow Length' | 'Full Sleeve';
  measurementNotes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface WeavingConsultation {
  name: string;
  email: string;
  phone: string;
  sareeType: SareeType;
  colorPreference: string;
  zariPreference: string;
  budgetMin: number;
  budgetMax: number;
  eventDate: string;
  specialInstructions?: string;
}
