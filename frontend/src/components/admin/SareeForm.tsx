import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Sparkles, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Saree, SareeType } from '../../types';
import { getApiUrl } from '../../utils/api';

interface SareeFormProps {
  saree: Saree | null;
  onClose: () => void;
  onSave: () => void;
  token: string;
}

const STANDARD_CATEGORIES = [
  "Kanjivaram", "Banarasi", "Paithani", "Pochampally", 
  "Mysore Silk", "Patola", "Gadwal", "Chanderi", 
  "Tussar", "Jamdani", "Organza", "Kerala Kasavu", 
  "Baluchari", "Sambalpuri", "Tanchoi", "Venkatagiri", 
  "Dharmavaram", "Mangalagiri", "Sungudi", "Ilkal", 
  "Narayanpet", "Kota Doria", "Arani Silk", "Kuppadam", 
  "Chettinad", "Uppada", "Muga Silk", "Assam Muga", 
  "Kantha Tussar", "Custom"
];

export default function SareeForm({ saree, onClose, onSave, token }: SareeFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Saree data details state
  const [name, setName] = useState('');
  const [selectType, setSelectType] = useState('Kanjivaram');
  const [customType, setCustomType] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [color, setColor] = useState('');
  const [colorHex, setColorHex] = useState('#8C1C24');
  const [contrastColor, setContrastColor] = useState('');
  const [contrastColorHex, setContrastColorHex] = useState('#12482F');
  const [zariType, setZariType] = useState<any>('Pure Gold Zari');
  const [silkMarkApproved, setSilkMarkApproved] = useState(true);
  const [weight, setWeight] = useState('800');
  const [warpCount, setWarpCount] = useState('3-Ply Pure Mulberry Silk');
  const [origin, setOrigin] = useState('Kanchipuram, Tamil Nadu');
  const [weavingTime, setWeavingTime] = useState('20');
  const [stock, setStock] = useState('5');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (saree) {
      setName(saree.name);
      if (STANDARD_CATEGORIES.filter(c => c !== 'Custom').includes(saree.type)) {
        setSelectType(saree.type);
        setCustomType('');
      } else {
        setSelectType('Custom');
        setCustomType(saree.type);
      }
      setPrice(String(saree.price));
      setOriginalPrice(saree.originalPrice ? String(saree.originalPrice) : '');
      setDescription(saree.description);
      setImage(saree.image);
      setGallery(saree.gallery || []);
      setColor(saree.color);
      setColorHex(saree.colorHex || '#8C1C24');
      setContrastColor(saree.contrastColor || '');
      setContrastColorHex(saree.contrastColorHex || '#12482F');
      setZariType(saree.zariType);
      setSilkMarkApproved(saree.silkMarkApproved);
      setWeight(String(saree.weight || 800));
      setWarpCount(saree.warpCount || '3-Ply Pure Mulberry Silk');
      setOrigin(saree.origin || '');
      setWeavingTime(String(saree.weavingTime || 20));
      setStock(String(saree.stock || 5));
      setTagsInput(saree.tags ? saree.tags.join(', ') : '');
    } else {
      // Setup Defaults
      setName('');
      setSelectType('Kanjivaram');
      setCustomType('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
      setGallery([]);
      setColor('Sovereign Red');
      setColorHex('#8C1C24');
      setContrastColor('Emerald Green');
      setContrastColorHex('#12482F');
      setZariType('Pure Gold Zari');
      setSilkMarkApproved(true);
      setWeight('820');
      setWarpCount('3-Ply Pure Mulberry Silk');
      setOrigin('Kanchipuram, Tamil Nadu');
      setWeavingTime('25');
      setStock('4');
      setTagsInput('Bridal, Pure Gold Zari, Hot Release');
    }
  }, [saree]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('images', file as Blob);
    });

    try {
      const resp = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed uploading files');
      }

      if (data.fileUrls && data.fileUrls.length > 0) {
        // Set first uploaded file as primary, rest as gallery
        setImage(data.fileUrls[0]);
        setGallery(prev => [...prev, ...data.fileUrls]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload connection error.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    Array.from(e.dataTransfer.files).forEach(file => {
      formData.append('images', file as Blob);
    });

    try {
      const resp = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed uploading files');
      }

      if (data.fileUrls && data.fileUrls.length > 0) {
        setImage(data.fileUrls[0]);
        setGallery(prev => [...prev, ...data.fileUrls]);
      }
    } catch (err: any) {
      setError(err.message || 'Image drop connection error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const finalType = selectType === 'Custom' ? customType.trim() : selectType;
    if (!finalType) {
      setError('Please specify a custom saree type / category.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      type: finalType,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      image,
      gallery,
      color,
      colorHex,
      contrastColor,
      contrastColorHex,
      zariType,
      silkMarkApproved,
      weight: Number(weight),
      warpCount,
      origin,
      weavingTime: Number(weavingTime),
      stock: Number(stock),
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    try {
      const endpoint = saree ? `/api/sarees/${saree.id}` : '/api/sarees';
      const method = saree ? 'PUT' : 'POST';

      const resp = await fetch(getApiUrl(endpoint), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to persist saree');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-end bg-stone-900/60 backdrop-blur-sm">
      <div id="saree-form-slideout" className="w-full max-w-2xl bg-stone-50 min-h-screen border-l border-stone-200 shadow-2xl flex flex-col justify-between">
        
        {/* Header bar */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              {saree ? `Edit Weave: ${saree.name.split(' ')[0]}` : 'Catalog New Heritage Saree'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5.5 h-5.5 text-stone-400 hover:text-stone-800" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-grow p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs leading-relaxed flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Core Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Saree Name / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Swarna Mayil Kanjivaram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:ring-1 focus:ring-amber-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Weaving Category *</label>
              <select
                value={selectType}
                onChange={(e) => setSelectType(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              >
                {STANDARD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {selectType === 'Custom' && (
                <input
                  type="text"
                  required
                  placeholder="Enter custom category name (e.g., Mysore Silk)"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 mt-2 focus:ring-1 focus:ring-amber-900 focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Price (INR ₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 18500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Original Price (Strikeout)</label>
              <input
                type="number"
                placeholder="e.g. 21000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                placeholder="5"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Detailed Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Highlight the weave details, pallu patterns, body motifs, thread configurations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-900"
            />
          </div>

          {/* Image Drag & Drop Uploader */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Saree Image Catalog *</label>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-stone-300 hover:border-amber-900/60 bg-white rounded-xl p-6 text-center cursor-pointer transition-colors relative"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center gap-2">
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
                    <p className="text-xs font-bold text-stone-800">Uploading loom pictures to inventory...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-stone-400" />
                    <p className="text-xs font-bold text-stone-700">Drag & Drop saree photography here, or click to browse</p>
                    <p className="text-[10px] text-stone-400">Supports PNG, JPG, JPEG up to 5 files at once</p>
                  </>
                )}
              </div>
            </div>

            {/* Uploaded Previews */}
            {image && (
              <div className="mt-4 bg-stone-100 p-4 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">Previews:</span>
                <div className="flex flex-wrap gap-2.5">
                  <div className="relative w-20 h-20 bg-stone-200 rounded-lg overflow-hidden border border-stone-300">
                    <img src={image} className="w-full h-full object-cover" alt="Primary" />
                    <span className="absolute bottom-0 inset-x-0 bg-stone-900/75 text-white text-[8px] font-sans font-semibold py-0.5 text-center">Primary</span>
                  </div>
                  {gallery.filter(g => g !== image).map((g, idx) => (
                    <div key={idx} className="relative w-20 h-20 bg-stone-200 rounded-lg overflow-hidden border border-stone-300">
                      <img src={g} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                      <button 
                        type="button" 
                        onClick={() => setGallery(prev => prev.filter(item => item !== g))}
                        className="absolute top-0.5 right-0.5 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded-full"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Details and presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
            <div>
              <span className="text-xs font-sans font-bold text-amber-950 uppercase block mb-3">Saree Body Base Tone</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Color Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Ruby Red"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded text-xs px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Hex Code</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-8 h-7 cursor-pointer border-0 rounded p-0"
                    />
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded text-xs px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-sans font-bold text-amber-950 uppercase block mb-3">Contrast Border/Pallu Tone</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Contrast Color Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mango Yellow"
                    value={contrastColor}
                    onChange={(e) => setContrastColor(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded text-xs px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Contrast Hex Code</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={contrastColorHex}
                      onChange={(e) => setContrastColorHex(e.target.value)}
                      className="w-8 h-7 cursor-pointer border-0 rounded p-0"
                    />
                    <input
                      type="text"
                      value={contrastColorHex}
                      onChange={(e) => setContrastColorHex(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded text-xs px-2 py-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loom Specific Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Zari Quality Spec</label>
              <select
                value={zariType}
                onChange={(e) => setZariType(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              >
                <option value="Pure Gold Zari">Pure Gold Zari</option>
                <option value="Tested Zari">Tested Zari</option>
                <option value="Silver Zari">Silver Zari</option>
                <option value="Antique Zari">Antique Zari</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Warp and Weft Count</label>
              <input
                type="text"
                required
                value={warpCount}
                onChange={(e) => setWarpCount(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Weaving Time (Days)</label>
              <input
                type="number"
                required
                placeholder="25"
                value={weavingTime}
                onChange={(e) => setWeavingTime(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Weight (Grams)</label>
              <input
                type="number"
                required
                placeholder="850"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Authentic Saree Origin</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">Search Keywords / Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="Bridal, Pure Gold Zari"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded text-xs p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="silkMarkCheckbox"
                checked={silkMarkApproved}
                onChange={(e) => setSilkMarkApproved(e.target.checked)}
                className="w-4 h-4 text-amber-950 border-stone-300 rounded focus:ring-0 focus:outline-none"
              />
              <label htmlFor="silkMarkCheckbox" className="text-xs font-bold text-stone-700 cursor-pointer">
                Authentic Silk Mark Approved (100% Genuine Mulberry)
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 hover:bg-stone-100 rounded text-stone-600 font-bold text-xs"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="bg-amber-900 border border-amber-950 text-stone-50 hover:bg-amber-950 font-bold text-xs px-6 py-2.5 rounded shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Weaving into catalogs...</span>
              </>
            ) : (
              <span>Save Masterpiece Spec</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
