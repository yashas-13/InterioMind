import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { CatalogManager, CatalogItem } from './components/CatalogManager';
import { ProjectGallery, DesignProject } from './components/ProjectGallery';
import { ProblemSolution } from './components/ProblemSolution';
import { generateFurnishedImage } from './services/geminiService';

// --- IndexedDB Utility ---
const DB_NAME = 'InteriorAI_Projects';
const STORE_NAME = 'images';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const storeBlob = async (key: string, blob: Blob) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = resolve;
    tx.onerror = reject;
  });
};

const getBlob = async (key: string): Promise<Blob | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = reject;
  });
};

const deleteBlob = async (key: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(key);
};

// --- Helpers ---
const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'catalog' | 'gallery' | 'insights'>('design');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [prompt, setPrompt] = useState<string>('Modern minimalist with oak wood and neutral tones');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  const [catalog, setCatalog] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('interior_catalog');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'furn-1', name: 'Cloud Modular Sofa', category: 'Furniture', style: 'Modern', description: 'Plush white modular sofa with deep seating and soft linen upholstery', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
      { id: 'furn-2', name: 'Velvet Emerald Armchair', category: 'Furniture', style: 'Modern', description: 'Deep emerald green velvet armchair with gold-tipped tapered legs and vertical tufting', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' },
      { id: 'furn-3', name: 'Brutalist Concrete Table', category: 'Furniture', style: 'Industrial', description: 'Low-profile circular coffee table made of raw grey concrete with smooth finish', imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400' },
      { id: 'furn-4', name: 'Noguchi Style Table', category: 'Furniture', style: 'Mid-Century', description: 'Iconic sculptural coffee table with a heavy glass top and balanced wooden base', imageUrl: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=400' },
      { id: 'light-1', name: 'Aurelia Brass Pendant', category: 'Lighting', style: 'Contemporary', description: 'Large architectural pendant light in brushed brass with soft diffused warm light', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=400' },
      { id: 'light-2', name: 'Orbital Floor Lamp', category: 'Lighting', style: 'Minimalist', description: 'Slender black stem lamp with a large floating hand-blown glass sphere', imageUrl: 'https://images.unsplash.com/photo-1507473884658-c70b6559995f?auto=format&fit=crop&q=80&w=400' },
      { id: 'dec-1', name: 'Wabi-Sabi Ceramic Vase', category: 'Decor', style: 'Minimalist', description: 'Hand-crafted stone ceramic vase with textured earthy glaze and dried eucalyptus', imageUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400' },
      { id: 'dec-3', name: 'Monstera Deliciosa', category: 'Decor', style: 'Tropical', description: 'Large architectural Swiss cheese plant in a textured white ceramic pot', imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400' },
      { id: 'surf-1', name: 'Oak Herringbone Floor', category: 'Surfaces', style: 'Classic', description: 'Natural white oak floor in a classic herringbone pattern with a matte oil finish', imageUrl: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&q=80&w=400' },
      { id: 'tile-1', name: 'Emerald Zellige Tiles', category: 'Tiles', style: 'Moroccan', description: 'Hand-glazed clay tiles with irregular edges and rich emerald variations, high-gloss finish', imageUrl: 'https://images.unsplash.com/photo-1523413555809-0fb1d4da238d?auto=format&fit=crop&q=80&w=400' },
      { id: 'text-1', name: 'Merino Wool Throw', category: 'Textiles', style: 'Luxury', description: 'Hand-knitted chunky merino wool throw in cream, placed casually over furniture', imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400' },
      { id: 'curt-1', name: 'Belgian Linen Drapes', category: 'Curtains', style: 'Scandi', description: 'Floor-to-ceiling sheer linen curtains in off-white, creating soft diffused daylight', imageUrl: 'https://images.unsplash.com/photo-1516524538183-059008882b54?auto=format&fit=crop&q=80&w=400' },
      { id: 'door-1', name: 'Steel Pivot Door', category: 'Doors', style: 'Industrial', description: 'Large matte black steel-framed pivot door with clear architectural glass panels', imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=400' },
      { id: 'art-1', name: 'Bauhaus Geometric Print', category: 'Art', style: 'Mid-Century', description: 'Bold geometric abstract art with primary colors in a thin black gallery frame', imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
      { id: 'paint-1', name: 'Ethereal Cloud Scape', category: 'Paintings', style: 'Impressionist', description: 'Large oil painting of soft clouds in pastel blue and pink, creating a peaceful atmosphere', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400' }
    ];
  });

  const [selectedItems, setSelectedItems] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      const savedMeta = localStorage.getItem('interior_projects_meta');
      if (!savedMeta) {
        setIsGalleryLoading(false);
        return;
      }

      try {
        const meta: Omit<DesignProject, 'originalImage' | 'generatedImage'>[] = JSON.parse(savedMeta);
        const fullProjects: DesignProject[] = [];

        for (const p of meta) {
          const origBlob = await getBlob(`${p.id}_orig`);
          const genBlob = await getBlob(`${p.id}_gen`);
          
          if (origBlob && genBlob) {
            fullProjects.push({
              ...p,
              originalImage: URL.createObjectURL(origBlob),
              generatedImage: URL.createObjectURL(genBlob)
            } as DesignProject);
          }
        }
        setProjects(fullProjects);
      } catch (err) {
        console.error("Failed to rehydrate projects", err);
      } finally {
        setIsGalleryLoading(false);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    localStorage.setItem('interior_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    if (!originalFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(originalFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [originalFile]);

  const saveProject = async (orig: Blob, gen: Blob, rType: string, pStyle: string) => {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      
      await storeBlob(`${id}_orig`, orig);
      await storeBlob(`${id}_gen`, gen);

      const originalBlobUrl = URL.createObjectURL(orig);
      const generatedBlobUrl = URL.createObjectURL(gen);

      const newProject: DesignProject = {
        id,
        timestamp: Date.now(),
        roomType: rType,
        style: pStyle,
        originalImage: originalBlobUrl,
        generatedImage: generatedBlobUrl
      };

      setProjects(prev => {
        const updated = [newProject, ...prev];
        const meta = updated.map(({ originalImage, generatedImage, ...rest }) => rest);
        localStorage.setItem('interior_projects_meta', JSON.stringify(meta));
        return updated;
      });

      return newProject;
    } catch (e) {
      console.error("Critical storage failure:", e);
      setError("Project generated but permanent saving failed.");
      return null;
    }
  };

  const handleImageUpload = (file: File) => {
    setOriginalFile(file);
    if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedImageUrl(null);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!originalFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedImageUrl(null);

    const itemsContext = selectedItems.length > 0 
      ? `Specifically integrate these catalog products: ${selectedItems.map(i => `${i.name} (${i.description})`).join(', ')}.`
      : 'Select high-end furniture and architectural finishes appropriate for this space.';
    
    const finalPrompt = `Room Type: ${roomType}. Style: ${prompt}. ${itemsContext}`;

    try {
      const base64ImageUrl = await generateFurnishedImage(originalFile, finalPrompt);
      const genBlob = dataURLtoBlob(base64ImageUrl);
      const blobUrl = URL.createObjectURL(genBlob);
      
      setGeneratedImageUrl(blobUrl);
      await saveProject(originalFile, genBlob, roomType, prompt);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, prompt, selectedItems, roomType, generatedImageUrl]);

  const handleRefine = useCallback(async (refinementPrompt: string) => {
    if (!generatedImageUrl || !originalFile) return;
    setIsRefining(true);
    setError(null);
    
    try {
        const fullRefPrompt = `${prompt}. Refinement: ${refinementPrompt}`;
        const base64ImageUrl = await generateFurnishedImage(originalFile, fullRefPrompt);
        const genBlob = dataURLtoBlob(base64ImageUrl);
        const blobUrl = URL.createObjectURL(genBlob);

        if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(generatedImageUrl);
        }
        setGeneratedImageUrl(blobUrl);
        await saveProject(originalFile, genBlob, roomType, fullRefPrompt);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? `Refinement failed: ${err.message}` : 'Refinement error.');
    } finally {
        setIsRefining(false);
    }
  }, [generatedImageUrl, originalFile, prompt, roomType]);

  const handleReset = () => {
    setOriginalFile(null);
    setPreviewUrl(null);
    if (generatedImageUrl && generatedImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedImageUrl);
    }
    setGeneratedImageUrl(null);
    setError(null);
    setIsLoading(false);
    setIsRefining(false);
    setSelectedItems([]);
  };

  const handleDeleteProject = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      URL.revokeObjectURL(project.originalImage);
      URL.revokeObjectURL(project.generatedImage);
    }
    await deleteBlob(`${id}_orig`);
    await deleteBlob(`${id}_gen`);
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const meta = filtered.map(({ originalImage, generatedImage, ...rest }) => rest);
      localStorage.setItem('interior_projects_meta', JSON.stringify(meta));
      return filtered;
    });
  };

  const handleSelectProject = (project: DesignProject) => {
    setGeneratedImageUrl(project.generatedImage);
    setPreviewUrl(project.originalImage);
    setRoomType(project.roomType);
    setPrompt(project.style);
    setActiveTab('design');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center selection:bg-primary-100 selection:text-primary-900">
      <Header />
      
      <nav className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex justify-center space-x-2 sm:space-x-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
          {[
            { id: 'insights', label: 'Methodology' },
            { id: 'design', label: 'Design Studio' },
            { id: 'catalog', label: 'Inventory' },
            { id: 'gallery', label: isGalleryLoading ? 'Loading Gallery...' : `Gallery (${projects.length})` }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-8 py-4 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 mb-12">
        {activeTab === 'insights' && (
           <ProblemSolution />
        )}
        {activeTab === 'catalog' && (
          <CatalogManager catalog={catalog} setCatalog={setCatalog} />
        )}
        {activeTab === 'gallery' && (
          <ProjectGallery 
            projects={projects} 
            onDelete={handleDeleteProject} 
            onSelect={handleSelectProject} 
          />
        )}
        {activeTab === 'design' && (
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-6 sm:p-10 w-full transition-all duration-500 border border-gray-100 dark:border-gray-700">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 mb-6 rounded-xl flex items-center gap-3" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {generatedImageUrl && previewUrl ? (
                  <ImageDisplay
                    originalImageUrl={previewUrl}
                    generatedImageUrl={generatedImageUrl}
                    onReset={handleReset}
                    onRefine={handleRefine}
                    isRefining={isRefining}
                  />
                ) : (
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    onGenerate={handleGenerate}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    roomType={roomType}
                    setRoomType={setRoomType}
                    previewUrl={previewUrl}
                    isLoading={isLoading}
                    catalog={catalog}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
      <footer className="w-full text-center py-10 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Interior AI Pro • Binary Storage v1.2
        </p>
      </footer>
    </div>
  );
};

export default App;