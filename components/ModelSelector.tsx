import React from 'react';
import { AVAILABLE_MODELS } from '../constants';
import { Check } from 'lucide-react';

interface ModelSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll?: () => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedIds, onToggle, onSelectAll, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="px-5 py-3 border-b border-gray-100 dark:border-[#222] flex items-center justify-between bg-gray-50/80 dark:bg-[#111]/90 sticky top-0 backdrop-blur-sm z-10 transition-colors">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available Models</h3>
            <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-gray-500 bg-gray-200/50 dark:bg-[#222] px-1.5 py-0.5">{selectedIds.length}</span>
        </div>
        {onSelectAll && (
            <button 
                onClick={onSelectAll}
                className="text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors uppercase tracking-wider"
            >
                Select All
            </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-50 dark:divide-[#222]">
        {AVAILABLE_MODELS.map((model) => {
          const isSelected = selectedIds.includes(model.id);
          return (
            <div
              key={model.id}
              onClick={() => onToggle(model.id)}
              className={`group relative flex items-start px-5 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${
                isSelected ? 'bg-gray-50/50 dark:bg-[#161616]' : 'bg-white dark:bg-[#0f0f0f]'
              }`}
            >
              <div
                className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center mr-3 transition-all shrink-0 ${
                  isSelected 
                    ? 'border-black bg-black dark:border-white dark:bg-white' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0f0f] group-hover:border-gray-400 dark:group-hover:border-gray-500'
                }`}
              >
                {isSelected && <Check size={8} className="text-white dark:text-black" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className={`font-mono text-xs font-semibold truncate ${isSelected ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {model.name}
                    </h4>
                    <span className={`text-[10px] font-mono tracking-tight ${isSelected ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                        ~${model.price.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-600">
                        {model.owner}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};