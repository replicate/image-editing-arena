import React, { useState, useRef, useEffect } from 'react';
import { ModelSelector } from './components/ModelSelector';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExampleCarousel } from './components/ExampleCarousel';
import { AVAILABLE_MODELS } from './constants';
import { createPrediction, pollPrediction } from './services/replicateService';
import { PredictionResult } from './types';
import { Wand2, Download, Upload, Trash2, AlertTriangle, Clock, ChevronRight, X, Maximize2, Moon, Sun, Menu } from 'lucide-react';

const App: React.FC = () => {
  // Initialize API key from localStorage if available
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('replicateApiKey') || '';
    }
    return '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [prompt, setPrompt] = useState<string>("Turn the fire into water");
  
  // Default Input Image
  const [inputImage, setInputImage] = useState<string | null>("https://replicate.delivery/xezq/4beTwubF9v02fEIJkEYuunozbfQVuyHeBHXktj1Zjve1olntC/tmpml1_e_vj0_ZjYSm_q36J4KChdn.jpg");
  
  // Default Selected Models (matching the default results)
  const [selectedModels, setSelectedModels] = useState<string[]>([
    'nano-banana-pro', 
    'nano-banana', 
    'flux-2-pro', 
    'seedream-4', 
    'qwen-image-edit-plus', 
    'reve-edit'
  ]);

  // Default Results (Pre-populated)
  const [results, setResults] = useState<PredictionResult[]>([
    { 
        modelId: 'nano-banana-pro', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/z8G8FOT83f2lGi8GPNXNm6IhJcvD56Kg4HAT7ZdzbOL9WesVA/tmpqn9ml4jk.png", 
        inferenceTime: 1.2 
    },
    { 
        modelId: 'nano-banana', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/HfA9TENhjW0ucSWcnLsgd8TL46D9Ux2uqZBQrHqlj2kGYesVA/tmpclck0hw1.jpeg", 
        inferenceTime: 0.8 
    },
    { 
        modelId: 'flux-2-pro', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/nK0aDjfKnxXjZKSIjJAyW8K0frkFnPLrb6D8pduwbUGvt8sVA/tmpsahfz8u_.webp", 
        inferenceTime: 5.4 
    },
    { 
        modelId: 'seedream-4', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/e12sIpfLZLnfDo7R1BPWUYh5G7xJ7YKnbgJ8yDwnkm51c5ZrA/tmp9i8be17_.jpg", 
        inferenceTime: 3.1 
    },
    { 
        modelId: 'qwen-image-edit-plus', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/vnqpR28jUErNNRXAefhJaLa5TU19fTo41nAH24tqvUtoc5ZrA/out-0.webp", 
        inferenceTime: 4.2 
    },
    { 
        modelId: 'reve-edit', 
        status: 'succeeded', 
        output: "https://replicate.delivery/xezq/m2aLeWlcWzwAeUNUu9U29Ffpq1OAsTQhJiw2Qh2ouFVnd5ZrA/tmpb2cqskeu.png", 
        inferenceTime: 2.5 
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Initialize dark mode from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply dark mode class to document root and persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setInputImage(reader.result as string);
      setValidationError(null); // Clear error on upload
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
      if (selectedModels.length === AVAILABLE_MODELS.length) {
          setSelectedModels([]);
      } else {
          setSelectedModels(AVAILABLE_MODELS.map(m => m.id));
      }
  };

  // Calculate total cost of selected models
  const totalCost = selectedModels.reduce((sum, modelId) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    return sum + (model?.price || 0);
  }, 0);

  const handleRun = async () => {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }
    
    // Strict Validation: Image AND Prompt are required
    const isImageMissing = !inputImage;
    const isPromptMissing = !prompt.trim();

    if (isImageMissing || isPromptMissing) {
      if (isImageMissing && isPromptMissing) {
          setValidationError("Image and Prompt required");
      } else if (isImageMissing) {
          setValidationError("Image required");
      } else {
          setValidationError("Prompt required");
      }
      return;
    }

    if (selectedModels.length === 0) return;

    setValidationError(null);
    setIsProcessing(true);
    // Initialize results for selected models
    setResults(selectedModels.map(id => ({ modelId: id, status: 'starting' })));

    // Create a promise for each model
    const promises = selectedModels.map(async (modelId) => {
      const model = AVAILABLE_MODELS.find(m => m.id === modelId);
      if (!model) return;

      const startTime = Date.now();
      
      try {
        setResults(prev => prev.map(r => r.modelId === modelId ? { ...r, status: 'processing' } : r));
        
        const prediction = await createPrediction(apiKey, model, {
            prompt,
            image: inputImage || undefined,
            aspect_ratio: "4:3"
        });

        const finalPrediction = await pollPrediction(apiKey, prediction.urls.get);
        const duration = (Date.now() - startTime) / 1000;
        
        setResults(prev => prev.map(r => 
          r.modelId === modelId 
            ? { ...r, status: 'succeeded', output: finalPrediction.output, inferenceTime: duration } 
            : r
        ));

      } catch (error: any) {
        console.error(`Error with model ${modelId}:`, error);
        setResults(prev => prev.map(r => 
          r.modelId === modelId 
            ? { ...r, status: 'failed', error: error.message || "Unknown error occurred" } 
            : r
        ));
      }
    });

    await Promise.all(promises);
    setIsProcessing(false);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('replicateApiKey', key);
    setShowKeyModal(false);
  };

  const handleExampleChange = (examplePrompt: string, exampleImage: string, exampleResults: PredictionResult[], selectedModelIds: string[]) => {
    setPrompt(examplePrompt);
    setInputImage(exampleImage);
    setResults(exampleResults);
    setSelectedModels(selectedModelIds); // Update selected models to match example
    setShowMobileSidebar(false); // Close mobile sidebar if open
  };

  // Load first example on mount
  useEffect(() => {
    // This will be triggered by the ExampleCarousel's initial render
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F9FAFB] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      <ApiKeyModal 
        isOpen={showKeyModal} 
        onSave={handleSaveApiKey} 
        onClose={() => setShowKeyModal(false)}
        currentKey={apiKey} 
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-[#222] z-30">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <svg viewBox="0 0 831 192" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto text-black dark:text-white">
          <path d="M197.3 64.2C220.5 64.2 240 79.6 240 108.2C240 110.1 240 111.7 239.8 114.6H170.1C171 129.1 182.7 138.7 197.4 138.7C209.8 138.7 218.1 133 222.7 125.2L237.6 135.8C229.6 148.4 215.8 156.4 197.2 156.4C170.3 156.4 150.9 137.3 150.9 110.3C151 84.2 170.4 64.2 197.3 64.2ZM171.1 100.3H220.4C218.3 87.5 208 80.6 196.6 80.6C185.2 80.6 173.7 87.2 171.1 100.3Z" fill="currentColor"/>
          <path d="M259.8 65.9H279.3V77.8C284.3 70.7 295.1 64.2 307.8 64.2C332.1 64.2 350.5 84.9 350.5 110.3C350.5 135.6 332.1 156.4 307.8 156.4C295 156.4 284.2 149.8 279.3 142.7V191.6H259.8V65.9ZM304.3 81.9C288.5 81.9 277.7 94.3 277.7 110.3C277.7 126.3 288.5 138.7 304.3 138.7C319.9 138.7 330.7 126.3 330.7 110.3C330.7 94.3 319.9 81.9 304.3 81.9Z" fill="currentColor"/>
          <path d="M389.9 21.6H370.4V154.5H389.9V21.6Z" fill="currentColor"/>
          <path d="M425.9 46.6C418.8 46.6 412.8 40.8 412.8 33.5C412.8 26.4 418.8 20.6 425.9 20.6C433.2 20.6 438.8 26.5 438.8 33.5C438.8 40.8 433.2 46.6 425.9 46.6ZM416.2 65.9H435.7V154.5H416.2V65.9Z" fill="currentColor"/>
          <path d="M502.3 156.3C475.7 156.3 455.5 136.4 455.5 110.2C455.5 84 475.7 64.1 502.3 64.1C520.6 64.1 536 73.9 543.6 88.6L526.6 97.8C522.3 88.8 513.7 82.2 502.3 82.2C486.5 82.2 475.4 94.4 475.4 110.2C475.4 126 486.6 138.2 502.3 138.2C513.6 138.2 522.3 131.6 526.6 122.6L543.6 131.8C536 146.6 520.5 156.3 502.3 156.3Z" fill="currentColor"/>
          <path d="M597.8 64.2C610.6 64.2 621.2 70.8 626.2 77.8V65.9H645.7V154.5H626.2V142.6C621.2 149.7 610.6 156.3 597.8 156.3C573.5 156.3 555.1 135.6 555.1 110.2C555.1 84.9 573.5 64.2 597.8 64.2ZM601.4 81.9C585.6 81.9 575 94.3 575 110.3C575 126.3 585.6 138.7 601.4 138.7C617.2 138.7 627.8 126.3 627.8 110.3C627.8 94.3 617.1 81.9 601.4 81.9Z" fill="currentColor"/>
          <path d="M679.1 154.6V83.3H660.6V65.9H679.1V41.3H698.6V65.9H732.2V83.3H698.6V137.1H732.2V154.6H679.1Z" fill="currentColor"/>
          <path d="M141.8 65.9V83.4H94V154.6H74.5V65.9H141.8Z" fill="currentColor"/>
          <path d="M141.8 33V50.4H57.2V154.6H37.7V33H141.8Z" fill="currentColor"/>
          <path d="M141.8 0V17.4H20.4V154.6H0.899994V0H141.8Z" fill="currentColor"/>
          <path d="M787.8 64.2C811 64.2 830.5 79.6 830.5 108.2C830.5 110.1 830.5 111.7 830.3 114.6H760.6C761.5 129.1 773.2 138.7 787.9 138.7C800.3 138.7 808.6 133 813.2 125.2L828.1 135.8C820.1 148.4 806.3 156.4 787.7 156.4C760.8 156.4 741.4 137.3 741.4 110.3C741.6 84.2 760.9 64.2 787.8 64.2ZM761.6 100.3H810.9C808.8 87.5 798.5 80.6 787.1 80.6C775.8 80.6 764.3 87.2 761.6 100.3Z" fill="currentColor"/>
        </svg>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button 
            onClick={() => setShowKeyModal(true)}
            className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors bg-gray-50 dark:bg-[#1a1a1a] px-2 py-1.5 border border-gray-100 dark:border-[#333] rounded"
          >
            {apiKey ? 'Key' : 'Set'}
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-8" onClick={() => setPreviewImage(null)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setPreviewImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* LEFT SIDEBAR - Inputs & Configuration */}
      <aside className={`
        fixed md:relative
        w-full md:w-[360px]
        h-full
        bg-white dark:bg-[#0f0f0f] 
        border-r border-gray-200 dark:border-[#222] 
        flex flex-col 
        z-40 md:z-20
        shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] 
        shrink-0 
        transition-all duration-300
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header - Hidden on mobile (shown in top bar instead) */}
        <div className="hidden md:flex px-5 py-6 border-b border-gray-100 dark:border-[#222] items-center justify-between shrink-0 transition-colors">
            <div className="flex flex-col gap-1.5 items-start">
               {/* Full Replicate Wordmark SVG */}
               <svg viewBox="0 0 831 192" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto text-black dark:text-white transition-colors">
                  <path d="M197.3 64.2C220.5 64.2 240 79.6 240 108.2C240 110.1 240 111.7 239.8 114.6H170.1C171 129.1 182.7 138.7 197.4 138.7C209.8 138.7 218.1 133 222.7 125.2L237.6 135.8C229.6 148.4 215.8 156.4 197.2 156.4C170.3 156.4 150.9 137.3 150.9 110.3C151 84.2 170.4 64.2 197.3 64.2ZM171.1 100.3H220.4C218.3 87.5 208 80.6 196.6 80.6C185.2 80.6 173.7 87.2 171.1 100.3Z" fill="currentColor"/>
                  <path d="M259.8 65.9H279.3V77.8C284.3 70.7 295.1 64.2 307.8 64.2C332.1 64.2 350.5 84.9 350.5 110.3C350.5 135.6 332.1 156.4 307.8 156.4C295 156.4 284.2 149.8 279.3 142.7V191.6H259.8V65.9ZM304.3 81.9C288.5 81.9 277.7 94.3 277.7 110.3C277.7 126.3 288.5 138.7 304.3 138.7C319.9 138.7 330.7 126.3 330.7 110.3C330.7 94.3 319.9 81.9 304.3 81.9Z" fill="currentColor"/>
                  <path d="M389.9 21.6H370.4V154.5H389.9V21.6Z" fill="currentColor"/>
                  <path d="M425.9 46.6C418.8 46.6 412.8 40.8 412.8 33.5C412.8 26.4 418.8 20.6 425.9 20.6C433.2 20.6 438.8 26.5 438.8 33.5C438.8 40.8 433.2 46.6 425.9 46.6ZM416.2 65.9H435.7V154.5H416.2V65.9Z" fill="currentColor"/>
                  <path d="M502.3 156.3C475.7 156.3 455.5 136.4 455.5 110.2C455.5 84 475.7 64.1 502.3 64.1C520.6 64.1 536 73.9 543.6 88.6L526.6 97.8C522.3 88.8 513.7 82.2 502.3 82.2C486.5 82.2 475.4 94.4 475.4 110.2C475.4 126 486.6 138.2 502.3 138.2C513.6 138.2 522.3 131.6 526.6 122.6L543.6 131.8C536 146.6 520.5 156.3 502.3 156.3Z" fill="currentColor"/>
                  <path d="M597.8 64.2C610.6 64.2 621.2 70.8 626.2 77.8V65.9H645.7V154.5H626.2V142.6C621.2 149.7 610.6 156.3 597.8 156.3C573.5 156.3 555.1 135.6 555.1 110.2C555.1 84.9 573.5 64.2 597.8 64.2ZM601.4 81.9C585.6 81.9 575 94.3 575 110.3C575 126.3 585.6 138.7 601.4 138.7C617.2 138.7 627.8 126.3 627.8 110.3C627.8 94.3 617.1 81.9 601.4 81.9Z" fill="currentColor"/>
                  <path d="M679.1 154.6V83.3H660.6V65.9H679.1V41.3H698.6V65.9H732.2V83.3H698.6V137.1H732.2V154.6H679.1Z" fill="currentColor"/>
                  <path d="M141.8 65.9V83.4H94V154.6H74.5V65.9H141.8Z" fill="currentColor"/>
                  <path d="M141.8 33V50.4H57.2V154.6H37.7V33H141.8Z" fill="currentColor"/>
                  <path d="M141.8 0V17.4H20.4V154.6H0.899994V0H141.8Z" fill="currentColor"/>
                  <path d="M787.8 64.2C811 64.2 830.5 79.6 830.5 108.2C830.5 110.1 830.5 111.7 830.3 114.6H760.6C761.5 129.1 773.2 138.7 787.9 138.7C800.3 138.7 808.6 133 813.2 125.2L828.1 135.8C820.1 148.4 806.3 156.4 787.7 156.4C760.8 156.4 741.4 137.3 741.4 110.3C741.6 84.2 760.9 64.2 787.8 64.2ZM761.6 100.3H810.9C808.8 87.5 798.5 80.6 787.1 80.6C775.8 80.6 764.3 87.2 761.6 100.3Z" fill="currentColor"/>
               </svg>
               
               <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Image Editing Arena</span>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-[#1a1a1a] p-1.5 border border-gray-100 dark:border-[#333]"
                >
                    {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
                <button 
                  onClick={() => setShowKeyModal(true)}
                  className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors bg-gray-50 dark:bg-[#1a1a1a] px-2 py-1.5 border border-gray-100 dark:border-[#333]"
                >
                  {apiKey ? 'API Key' : 'Set Key'}
                </button>
            </div>
        </div>

        {/* Mobile Close Button */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#222]">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Configure</span>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area - Removed padding and gaps for flush look */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            
            {/* 1. IMAGE UPLOAD - Full width, no gaps */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full aspect-square bg-gray-50 dark:bg-[#121212] cursor-pointer overflow-hidden group transition-all border-b border-gray-100 dark:border-[#222] shrink-0 
                  ${!inputImage && 'hover:bg-gray-100 dark:hover:bg-[#181818]'} 
                  ${validationError && !inputImage ? 'ring-2 ring-red-500 ring-inset z-10' : ''} 
                  ${isDragging ? 'ring-4 ring-blue-500 ring-inset bg-blue-50 dark:bg-blue-950/20' : ''}`}
            >
                {inputImage ? (
                    <>
                    <img src={inputImage} alt="Input" className="w-full h-full object-cover" />
                    <button 
                        onClick={(e) => { e.stopPropagation(); setInputImage(null); }} 
                        className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 hover:bg-black/70 text-white p-2 md:p-1.5 backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-lg touch-manipulation active:scale-95"
                    >
                        <Trash2 size={16} className="md:w-3.5 md:h-3.5" />
                    </button>
                    {/* Hover overlay - darker when dragging */}
                    <div className={`absolute inset-0 pointer-events-none transition-colors ${isDragging ? 'bg-blue-500/30' : 'bg-black/0 group-hover:bg-black/5'}`} />
                    {/* Drag overlay with icon */}
                    {isDragging && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-blue-500 text-white p-4 rounded-full shadow-lg animate-bounce">
                          <Upload size={32} />
                        </div>
                      </div>
                    )}
                    </>
                ) : (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center transition-colors ${isDragging ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        <Upload size={isDragging ? 32 : 24} className={`mb-2 transition-all ${validationError && !inputImage ? 'text-red-500' : isDragging ? 'text-blue-500 animate-bounce' : 'opacity-50'}`} />
                        <span className={`text-xs font-medium uppercase tracking-wider text-center px-4 ${validationError && !inputImage ? 'text-red-500' : isDragging ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                        {validationError && !inputImage 
                          ? 'Image Required' 
                          : isDragging 
                            ? 'Drop Image Here' 
                            : 'Upload or Drag Image'}
                        </span>
                    </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* 2. PROMPT INPUT - Full width */}
            <div className={`bg-white dark:bg-[#0f0f0f] border-b shrink-0 ${validationError && !prompt.trim() ? 'border-red-500 ring-1 ring-red-500 z-10' : 'border-gray-100 dark:border-[#222]'}`}>
                <textarea 
                    className={`w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none outline-none min-h-[100px] leading-relaxed p-5 ${validationError && !prompt.trim() ? 'placeholder-red-300' : ''}`}
                    placeholder={validationError && !prompt.trim() ? "A prompt is required to run the models..." : "Describe your edit or generation..."}
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        if (validationError) setValidationError(null);
                    }}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleRun();
                        }
                    }}
                />
            </div>

            {/* 3. MODEL SELECTOR - Flush, fills remaining space */}
            <ModelSelector 
                selectedIds={selectedModels} 
                onToggle={toggleModel} 
                onSelectAll={handleSelectAll}
                className="" 
            />

        </div>

        {/* Footer / Generate Button */}
        <div className="p-0 shrink-0">
            <button 
                onClick={() => {
                  handleRun();
                  setShowMobileSidebar(false);
                }}
                disabled={isProcessing || selectedModels.length === 0}
                className="w-full bg-black dark:bg-gray-300 text-white dark:text-black h-14 md:h-16 font-bold text-sm hover:bg-gray-900 dark:hover:bg-gray-100 disabled:bg-gray-100 dark:disabled:bg-[#1a1a1a] disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                        <span className="hidden sm:inline">Running Inference...</span>
                        <span className="sm:hidden">Running...</span>
                    </>
                ) : (
                    <>
                        <span className="hidden sm:inline">Run Selected Models</span>
                        <span className="sm:hidden">Run ({selectedModels.length})</span>
                        {selectedModels.length > 0 && (
                            <span className="text-xs font-mono opacity-70">
                                (~${totalCost.toFixed(2)})
                            </span>
                        )}
                        <ChevronRight size={16} />
                    </>
                )}
            </button>
        </div>
      </aside>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform touch-manipulation"
      >
        <Wand2 size={24} />
      </button>

      {/* RIGHT MAIN AREA - Output Gallery */}
      <main className="flex-1 bg-[#F5F5F5] dark:bg-[#0a0a0a] overflow-y-auto custom-scrollbar transition-colors duration-300 flex flex-col">
          
          {/* Example Carousel */}
          <ExampleCarousel onExampleChange={handleExampleChange} />
          
          {/* Results Grid */}
          <div className="flex-1 p-4 md:p-8">
          {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <Wand2 size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-400 dark:text-gray-600 text-sm">Select an image and run models to see results</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                  {results.map((result) => {
                      const model = AVAILABLE_MODELS.find(m => m.id === result.modelId);
                      const imageUrl = result.status === 'succeeded' && result.output 
                          ? (Array.isArray(result.output) ? result.output[0] : result.output) 
                          : null;

                      return (
                          <div key={result.modelId} className="group flex flex-col bg-white dark:bg-[#0f0f0f] shadow-sm hover:shadow-lg transition-all duration-300 aspect-[6/7] border border-transparent dark:border-[#222]">
                              {/* Card Header - always visible */}
                              <div className="px-4 py-3 bg-white dark:bg-[#0f0f0f] border-b border-gray-50 dark:border-[#222] flex items-center justify-between shrink-0 transition-colors">
                                  <div className="flex flex-col overflow-hidden mr-2">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight truncate">
                                        {model?.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate">{model?.owner}</span>
                                  </div>
                                  
                                  {result.status === 'succeeded' ? (
                                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1a1a1a] px-1.5 py-0.5 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-[#222]">
                                          <Clock size={10} />
                                          <span className="text-[10px] font-mono">
                                              {result.inferenceTime?.toFixed(2)}s
                                          </span>
                                      </div>
                                  ) : result.status === 'processing' || result.status === 'starting' ? (
                                      <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-ping" />
                                  ) : result.status === 'failed' ? (
                                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                                  ) : null}
                              </div>
                              
                              {/* Card Body */}
                              <div className="flex-1 relative flex items-center justify-center bg-gray-100 dark:bg-[#050505] overflow-hidden">
                                  {result.status === 'succeeded' && imageUrl ? (
                                      <>
                                          <img 
                                              src={imageUrl} 
                                              alt="Result" 
                                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                                              onClick={() => setPreviewImage(imageUrl)}
                                          />
                                                          <div className="absolute top-2 right-2 md:top-3 md:right-3 flex gap-1.5 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                                <button 
                                                    onClick={() => setPreviewImage(imageUrl)}
                                                    className="p-2 md:p-2 bg-white/90 dark:bg-black/90 text-black dark:text-white hover:bg-white dark:hover:bg-black backdrop-blur-sm shadow-sm rounded-lg touch-manipulation active:scale-95 transition-transform"
                                                >
                                                    <Maximize2 size={18} className="md:w-4 md:h-4" />
                                                </button>
                                                <a 
                                                    href={imageUrl} 
                                                    download 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="p-2 md:p-2 bg-white/90 dark:bg-black/90 text-black dark:text-white hover:bg-white dark:hover:bg-black backdrop-blur-sm shadow-sm rounded-lg touch-manipulation active:scale-95 transition-transform"
                                                >
                                                    <Download size={18} className="md:w-4 md:h-4" />
                                                </a>
                                          </div>
                                      </>
                                  ) : result.status === 'failed' ? (
                                      <div className="p-6 text-center w-full">
                                          <AlertTriangle size={24} className="text-red-400 mx-auto mb-2" />
                                          <p className="text-[10px] font-mono text-red-600 break-words">
                                              {result.error}
                                          </p>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-3">
                                          <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin" />
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}
          </div>
      </main>
    </div>
  );
};

export default App;