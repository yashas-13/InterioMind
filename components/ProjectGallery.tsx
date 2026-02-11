
import React from 'react';

export interface DesignProject {
  id: string;
  timestamp: number;
  roomType: string;
  style: string;
  originalImage: string; // Base64 or ObjectURL (using base64 for persistence)
  generatedImage: string;
}

interface ProjectGalleryProps {
  projects: DesignProject[];
  onDelete: (id: string) => void;
  onSelect: (project: DesignProject) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, onDelete, onSelect }) => {
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(ts);
  };

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-32 bg-gray-50 dark:bg-gray-800/20 rounded-[3rem] border-4 border-dotted border-gray-200 dark:border-gray-800">
        <div className="mb-6 text-gray-200 dark:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Gallery Empty</h3>
        <p className="text-gray-400 dark:text-gray-600 mt-2 font-medium">Generate your first design to see it here.</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      {projects.sort((a, b) => b.timestamp - a.timestamp).map((project) => (
        <div 
          key={project.id}
          className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
        >
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
             <button 
              onClick={() => onDelete(project.id)}
              className="p-3 bg-white/95 dark:bg-black/60 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full shadow-xl transition-colors"
              title="Delete Project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Visual Comparison Area */}
          <div 
            className="relative h-60 w-full cursor-pointer overflow-hidden"
            onClick={() => onSelect(project)}
          >
            <img 
              src={project.generatedImage} 
              alt="Generated" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Split View Indicator Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Generated</p>
                  <p className="text-sm font-black text-white leading-tight">{project.roomType}</p>
               </div>
               <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl">
                  <img src={project.originalImage} className="w-full h-full object-cover" alt="Source" />
               </div>
            </div>
          </div>

          <div className="p-7 flex-grow flex flex-col space-y-4">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-lg">
                    {project.style.split(',')[0]}
                  </span>
               </div>
               <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                {formatDate(project.timestamp)}
               </p>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic leading-relaxed">
              "{project.style}"
            </p>

            <button 
              onClick={() => onSelect(project)}
              className="mt-auto w-full py-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-500 hover:text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-800"
            >
              Open Project Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
