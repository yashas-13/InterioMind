import React, { useRef, useState } from 'react';
import { CatalogItem } from './CatalogManager';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onGenerate: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  roomType: string;
  setRoomType: (type: string) => void;
  previewUrl: string | null;
  isLoading: boolean;
  catalog: CatalogItem[];
  selectedItems: CatalogItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}

const stylePresets = [
  { name: 'Modern', prompt: 'Clean lines, neutral palette, oak wood and metal accents' },
  { name: 'Bohemian', prompt: 'Layered rugs, rich textures, vibrant colors, houseplants' },
  { name: 'Industrial', prompt: 'Exposed brick, metal ductwork, distressed wood furniture' },
  { name: 'Scandinavian', prompt: 'Simplicity, light natural wood, airy, cozy textiles' },
  { name: 'Coastal', prompt: 'Breezy white and blue tones, rattan, sandy beige linen' },
];

const roomTypes = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Kitchen', 'Nursery'];

const CATEGORIES = [
  'All',
  'Furniture',
  'Lighting',
  'Decor',
  'Surfaces',
  'Tiles',
  'Textiles',
  'Curtains',
  'Doors',
  'Doors & Windows',
  'Art',
  'Paintings'
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onGenerate,
  prompt,
  setPrompt,
  roomType,
  setRoomType,
  previewUrl,
  isLoading,
  catalog,
  selectedItems,
  setSelectedItems,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleItem = (item: CatalogItem) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const filteredCatalog = activeCategory === 'All' 
    ? catalog 
    : catalog.filter(item => item.category === activeCategory);

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">1. Capture Space</h2>
          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded tracking-tighter uppercase">Step One</span>
        </div>
        
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative w-full h-[450px] border-2 border-dashed rounded-3xl flex justify-center items-center cursor-pointer transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl ${previewUrl ? 'border-transparent' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-primary-400'}`}
        >
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} accept="image/*" className="hidden" />
            {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Room preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold">Replace Photo</span>
                  </div>
                </>
            ) : (
                <div className="text-center p-12">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">Add Empty Room Image</p>
                    <p className="text-sm text-gray-400 mt-2">Professional high-res photos work best</p>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">2. Set Strategy</h2>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded tracking-tighter uppercase">Step Two</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Room Environment</label>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setRoomType(type)}
                    className={`px-4 py-2 text-xs rounded-full border-2 transition-all font-bold ${roomType === type ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Aesthetic Preset</label>
              <div className="flex flex-wrap gap-2">
                {stylePresets.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setPrompt(style.prompt)}
                    className={`px-4 py-2 text-xs rounded-full border-2 transition-all font-bold ${prompt.includes(style.name) || prompt === style.prompt ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-100 dark:border-gray-700 hover:border-primary-100'}`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Inventory Integration</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[240px] scrollbar-none no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-2.5 py-1 text-[8px] font-black uppercase tracking-tighter rounded-md border transition-all ${activeCategory === cat ? 'bg-primary-600 border-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 border-transparent'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50 min-h-[60px]">
              {filteredCatalog.length > 0 ? (
                filteredCatalog.map((item) => {
                  const isSelected = selectedItems.some(i => i.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`px-3 py-1.5 text-[10px] rounded-lg border transition-all ${isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}{item.name}
                    </button>
                  );
                })
              ) : (
                <div className="w-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest italic py-4">
                  No assets in this category
                </div>
              )}
            </div>
          </div>

          <button
              onClick={onGenerate}
              disabled={!previewUrl || isLoading}
              className="w-full bg-primary-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-300 flex items-center justify-center gap-4 group shadow-xl shadow-primary-500/20 uppercase tracking-widest text-sm"
          >
            {isLoading ? 'Architecting...' : 'Generate 8K Vision'}
            {!isLoading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};