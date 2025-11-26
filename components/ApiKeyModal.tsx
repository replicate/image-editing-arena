import React, { useState, useEffect } from 'react';
import { Key, Lock, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose?: () => void;
  currentKey?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, currentKey = '' }) => {
  const [key, setKey] = useState(currentKey);

  // Update key when modal opens with current key
  useEffect(() => {
    if (isOpen) {
      setKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const isEditing = currentKey.length > 0;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#111] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-gray-200 dark:border-[#333] relative">
        {/* Close button - only show if onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Update API Key' : 'Enter Replicate API Key'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isEditing 
              ? 'Update your Replicate API key. It is stored locally in your browser.'
              : 'Enter your Replicate API key to get started. It is stored locally in your browser and never sent to our servers.'}
          </p>
          
          <div className="w-full relative">
            <Key className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="r8_..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>

          <button
            onClick={() => onSave(key)}
            disabled={!key.startsWith('r8_')}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold py-3 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'Update Key' : 'Start Editing Images'}
          </button>
          
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Don't have a key? <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-300">Get one here</a>
          </p>
        </div>
      </div>
    </div>
  );
};