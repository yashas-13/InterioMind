
import React, { useState, useRef, useEffect } from 'react';

interface ImageDisplayProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  onReset: () => void;
  onRefine: (prompt: string) => void;
  isRefining: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImageUrl, generatedImageUrl, onReset, onRefine, isRefining }) => {
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `interior-vision-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-12 animate-in slide-in-from-bottom duration-700">
      <div className="relative w-full max-w-4xl group">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border-8 border-white dark:border-gray-800 select-none cursor-ew-resize"
        >
          {/* Before Image */}
          <img 
            src={originalImageUrl} 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* After Image (Clipped) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={generatedImageUrl} 
              alt="Generated" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
            />
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute inset-y-0 w-1 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-2xl flex items-center justify-center border-2 border-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-5 5m0 0l5 5m-5-5h18m-5-5l5 5m0 0l-5 5" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest pointer-events-none">
            Original Space
          </div>
          <div className="absolute bottom-6 right-6 bg-primary-600 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest pointer-events-none">
            AI Vision
          </div>
        </div>

        {/* Download Action */}
        <button 
          onClick={downloadImage}
          className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors z-20 group-hover:scale-110"
          title="Download High-Res"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-2xl p-10 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-inner">
        <h3 className="text-xl font-black text-center mb-8 text-gray-900 dark:text-white uppercase tracking-tighter">
          Refine Your Vision
        </h3>
        <div className="flex flex-col gap-6">
            <div className="relative">
              <textarea
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                  placeholder="e.g. 'Add a large monstera plant by the window' or 'Change the rug to a dark teal'"
                  rows={3}
                  className="w-full p-6 border-2 border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 focus:outline-none shadow-sm transition-all text-sm leading-relaxed"
                  disabled={isRefining}
              />
              {isRefining && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                   <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                  onClick={() => onRefine(refinementPrompt)}
                  disabled={isRefining || !refinementPrompt.trim()}
                  className="bg-primary-600 text-white font-black py-4 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20 uppercase tracking-widest text-xs"
              >
                {isRefining ? 'Polishing...' : 'Update Design'}
              </button>
              <button
                onClick={onReset}
                disabled={isRefining}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 font-black py-4 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
              >
                New Project
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
