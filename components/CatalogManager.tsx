import React, { useState } from 'react';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  style: string;
  description: string;
  imageUrl?: string;
}

interface CatalogManagerProps {
  catalog: CatalogItem[];
  setCatalog: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}

const CATEGORIES = [
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

export const CatalogManager: React.FC<CatalogManagerProps> = ({ catalog, setCatalog }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [newItem, setNewItem] = useState<Omit<CatalogItem, 'id'>>({
    name: '',
    category: 'Furniture',
    style: 'Modern',
    description: '',
    imageUrl: ''
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description) return;
    
    const item: CatalogItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setCatalog([...catalog, item]);
    setNewItem({ name: '', category: 'Furniture', style: 'Modern', description: '', imageUrl: '' });
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    setCatalog(catalog.filter(item => item.id !== id));
  };

  const filteredCatalog = selectedFilter === 'All' 
    ? catalog 
    : catalog.filter(item => item.category === selectedFilter);

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Product Inventory</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Architectural asset library for high-fidelity vision generation</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center gap-2"
        >
          {isAdding ? (
            'Close Registration'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Register New Asset
            </>
          )}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddItem} className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-2 border-primary-100 dark:border-primary-900 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asset Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:outline-none transition-all font-bold"
                placeholder="e.g. Italian Marble Countertop"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
              <select
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:outline-none transition-all font-bold"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Signature Style Tag</label>
              <input
                type="text"
                value={newItem.style}
                onChange={e => setNewItem({ ...newItem, style: e.target.value })}
                className="w-full p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:outline-none transition-all font-bold"
                placeholder="e.g. Minimalist, Bauhaus"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Asset Reference URL</label>
              <input
                type="url"
                value={newItem.imageUrl}
                onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="w-full p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:outline-none transition-all font-bold"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Material Specification (AI Description)</label>
            <textarea
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:outline-none transition-all font-medium leading-relaxed"
              rows={4}
              placeholder="Describe textures, lighting properties, and exact visual qualities for the AI engine..."
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98]">
            Commit Asset to Global Registry
          </button>
        </form>
      )}

      {/* Navigation Filter Bar */}
      <div className="flex flex-wrap gap-3 pb-8 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSelectedFilter('All')}
          className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full border-2 transition-all ${selectedFilter === 'All' ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-primary-400 hover:text-primary-600'}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full border-2 transition-all ${selectedFilter === cat ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-primary-400 hover:text-primary-600'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCatalog.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col relative">
            
            {/* Action Menu */}
            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <button 
                onClick={() => removeItem(item.id)}
                className="p-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full shadow-2xl transition-colors border border-gray-100 dark:border-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Visual Container */}
            {item.imageUrl && (
              <div className="h-72 w-full overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-primary-600 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                    {item.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight pr-4">
                  {item.name}
                </h3>
                
                {/* Prominent Style Tag with Tooltip */}
                <div className="group/style relative shrink-0">
                  <div className="cursor-help flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800 transition-all hover:bg-amber-100">
                    <span className="text-lg">◆</span>
                    {item.style}
                  </div>
                  {/* Designer Tooltip */}
                  <div className="absolute bottom-full right-0 mb-3 w-64 p-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.5rem] opacity-0 invisible group-hover/style:opacity-100 group-hover/style:visible transition-all duration-300 z-50 shadow-2xl pointer-events-none border border-white/10 dark:border-gray-100">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-2 border-b border-white/20 dark:border-gray-100 pb-2">AI Aesthetic Blueprint</p>
                    <p className="text-xs font-medium leading-relaxed normal-case italic">
                      This "{item.style}" signature instructs the model to prioritize specific geometry, textures, and lighting balances inherent to this architectural movement.
                    </p>
                    <div className="absolute top-full right-6 border-8 border-transparent border-t-gray-900 dark:border-t-white" />
                  </div>
                </div>
              </div>

              {/* Material Specification Block (Description) */}
              <div className="mt-auto relative overflow-hidden bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-primary-500 rounded-2xl p-6 transition-all hover:bg-white dark:hover:bg-gray-900 shadow-inner group/spec">
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '15px 15px' }} />
                
                <div className="flex justify-between items-center mb-4 relative z-10">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                     <p className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">Material Specifications</p>
                   </div>
                   <button 
                     onClick={() => navigator.clipboard.writeText(item.description)}
                     className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                     title="Copy Blueprint"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                     </svg>
                   </button>
                </div>
                
                <div className="relative z-10">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic border-l-2 border-blue-100 dark:border-blue-900/50 pl-4 py-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="text-center py-40 bg-gray-50 dark:bg-gray-800/20 rounded-[4rem] border-4 border-dashed border-gray-200 dark:border-gray-800">
          <div className="mb-6 text-gray-200 dark:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest text-xs">This design vault is currently empty</p>
        </div>
      )}
    </div>
  );
};