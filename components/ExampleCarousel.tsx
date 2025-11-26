import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Example {
  id: number;
  prompt: string;
  inputImage: string;
  results: {
    modelId: string;
    output: string;
  }[];
}

const EXAMPLES: Example[] = [
  {
    id: 1,
    prompt: "Turn the fire into water",
    inputImage: "https://replicate.delivery/xezq/4beTwubF9v02fEIJkEYuunozbfQVuyHeBHXktj1Zjve1olntC/tmpml1_e_vj0_ZjYSm_q36J4KChdn.jpg",
    results: [
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/z8G8FOT83f2lGi8GPNXNm6IhJcvD56Kg4HAT7ZdzbOL9WesVA/tmpqn9ml4jk.png' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/HfA9TENhjW0ucSWcnLsgd8TL46D9Ux2uqZBQrHqlj2kGYesVA/tmpclck0hw1.jpeg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/e12sIpfLZLnfDo7R1BPWUYh5G7xJ7YKnbgJ8yDwnkm51c5ZrA/tmp9i8be17_.jpg' },
      { modelId: 'qwen-image-edit-plus', output: 'https://replicate.delivery/xezq/vnqpR28jUErNNRXAefhJaLa5TU19fTo41nAH24tqvUtoc5ZrA/out-0.webp' },
      { modelId: 'reve-edit', output: 'https://replicate.delivery/xezq/m2aLeWlcWzwAeUNUu9U29Ffpq1OAsTQhJiw2Qh2ouFVnd5ZrA/tmpb2cqskeu.png' },
      { modelId: 'seededit-3.0', output: 'https://replicate.delivery/xezq/iwlKMifByuXUQK3jFxTealPFah3ni1SwUxusTkvnR1iI6eZrA/tmpg8apbp6w.jpg' },
    ]
  },
  {
    id: 2,
    prompt: "Change 'This is fine' to 'May I meet you'",
    inputImage: "https://replicate.delivery/xezq/4beTwubF9v02fEIJkEYuunozbfQVuyHeBHXktj1Zjve1olntC/tmpml1_e_vj0_ZjYSm_q36J4KChdn.jpg",
    results: [
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/7nWeP3AKnOy2cCT9E5UNR8MiegnjtxUAiMXk93Eb6zCQ4eZrA/tmpu58vb02e.jpeg' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/P5YzhOHnSVL0ItUYBDrzNDcjuU2zexDuEhOrH87fo1G23eZrA/tmpwsr0hh77.jpeg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/cxv3bugfe5lo6EKxvdGsbnnuWfKfxjLGbCdejfdGWiVLLuPbF/tmpdr8aivx5.jpg' },
      { modelId: 'qwen-image-edit', output: 'https://replicate.delivery/xezq/u72ctY7ICibZNJTOZZCsqRkfX3XIfmfepBZ829b9WefEOuPbF/out-0.jpg' },
      { modelId: 'reve-edit-fast', output: 'https://replicate.delivery/xezq/Ebv45yOvfI1TRqMx2Q2KDBvJuS2JW2XaoHu7SNK6CSnqcfsVA/tmpts63tyjc.png' },
      { modelId: 'seededit-3.0', output: 'https://replicate.delivery/xezq/iwlKMifByuXUQK3jFxTealPFah3ni1SwUxusTkvnR1iI6eZrA/tmpg8apbp6w.jpg' },
    ]
  },
  {
    id: 3,
    prompt: "Turn into lego",
    inputImage: "https://replicate.delivery/xezq/4beTwubF9v02fEIJkEYuunozbfQVuyHeBHXktj1Zjve1olntC/tmpml1_e_vj0_ZjYSm_q36J4KChdn.jpg",
    results: [
      { modelId: 'flux-2-dev', output: 'https://replicate.delivery/xezq/erMQ1NfF8YvQeIFeOSjs7Gk09ieyFeMfTw2M62SXa5SiXqfsVA/tmpu4d2kdee.jpg' },
      { modelId: 'flux-2-flex', output: 'https://replicate.delivery/xezq/jDB2TqWkbg45Eph4vGnsVIY2MfVxf4TqhwdRMCTciZwvVfZrA/tmpgh4_ty2s.jpg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/seQXZqjTac05MCr1hf0Ssl9mBjeQ3sU8iDgspCz5TJsCqezWB/tmpgz4d3ul4.jpg' },
      { modelId: 'qwen-image-edit', output: 'https://replicate.delivery/xezq/MhWE4PUfAmVSOCuXMasD0BJnWKq1eDPJjmIjiRalFmgBVfZrA/out-0.jpg' },
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/78KJTAXN5173ClNzNh0DbEKXAro2fPamlKN2NDFDFfloVfZrA/tmpig1o0_yf.jpeg' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/H707V4TSxqaTJNwpsVvf72WJGHr4yrngDAH2YDKLIeMUVfZrA/tmpi728flpp.jpeg' },
    ]
  },
  {
    id: 4,
    prompt: "Turn this into an oil painting",
    inputImage: "https://replicate.delivery/xezq/xgWutHIxy5p7G1BrJq3kXpeT8k06fkyY8sQqf73yknSofE0WB/tmploucp6c1Screenshot%202025-11-24%20at%2011.22.01%E2%80%AFPM.png",
    results: [
      { modelId: 'flux-2-dev', output: 'https://replicate.delivery/xezq/22U56e1lFZRnf0JKbge1GfTB6LftPcyMxNfgxOGNtXnZefAtVA/output_24510.jpeg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/e2jeMqTWuZn1ZU0glkXTctF0cueokrqyXUcmIJim6QsgfD0WB/tmp2ptugsiz.jpg' },
      { modelId: 'flux-2-flex', output: 'https://replicate.delivery/xezq/XzZgwdk0TKbuFBZUR2FvH9oNrGizJLUaAuLswCPc9aBTQQbF/tmpnf49ie9t.jpg' },
    ]
  },
  {
    id: 5,
    prompt: "Make the background blue",
    inputImage: "https://replicate.delivery/xezq/xgWutHIxy5p7G1BrJq3kXpeT8k06fkyY8sQqf73yknSofE0WB/tmploucp6c1Screenshot%202025-11-24%20at%2011.22.01%E2%80%AFPM.png",
    results: [
      { modelId: 'flux-2-flex', output: 'https://replicate.delivery/xezq/4LzWObXZSFJXGxgE2xKTjsHY8pQvRjhWcctCleThshKOhg2KA/tmp384ip82d.jpg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/aYiMumqxeO1HD65MVZm2QiH5niDKUzRzf0TmrQUWYJXPCBtVA/tmpsot0964h.jpg' },
      { modelId: 'flux-2-dev', output: 'https://replicate.delivery/xezq/1FysmW2oxfQKJK05fuK3mw8jArTNlRQUYuqi4mpTHptTCBtVA/output_159717.jpeg' },
      { modelId: 'qwen-image-edit-plus', output: 'https://replicate.delivery/xezq/fqPF9IXhw2w4e091LQCAPY2TcPf2gPodkAZP177Cv1F3FCarA/out-0.jpg' },
      { modelId: 'reve-edit-fast', output: 'https://replicate.delivery/xezq/Roe906O21MTyXqjpQijgd42wybp2hqxtKiATYnmrih3Dig2KA/tmp8yviibvt.png' },
      { modelId: 'reve-edit', output: 'https://replicate.delivery/xezq/RIykdXP7bVaKNJSCjO4ueuzfOo51sO1bTE4c2mZDdGWVEBtVA/tmpi1md5qm5.png' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/fyyYfQRHclsgC0o3q9R6a6YQYdqpwlltn1tN4j3FfWfjaE0WB/tmpw2ih5f40.jpeg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/ebxeHvtRphmYZkQX5S8MbewJWLhpt1cvmBHRsPx1CyP5NCarA/tmpykrbnqsy.jpg' },
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/BlsJMXeD7BxtASfiPW2vMgfSlFguOL2Uthgefi0jwVh74IotC/tmpnje5y9l4.jpeg' },
    ]
  },
  {
    id: 6,
    prompt: "Add the text 'Image Editing' in the center",
    inputImage: "https://replicate.delivery/xezq/xgWutHIxy5p7G1BrJq3kXpeT8k06fkyY8sQqf73yknSofE0WB/tmploucp6c1Screenshot%202025-11-24%20at%2011.22.01%E2%80%AFPM.png",
    results: [
      { modelId: 'qwen-image-edit-plus', output: 'https://replicate.delivery/xezq/cQRd6miEAXZPLBHz9wbQZ1Bbjnoe9cfnozG7jnQNuFvsIBtVA/out-0.jpg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/OOsXBayBi5qaF1MTkhT5AnFuyDvS6VTPDp0fyDWKoG3Ukg2KA/tmpy2gnk7tb.jpg' },
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/Lte5z3URl7TaDCZ6w1vXwScb9fHQwSENfMeKJo4tsotilE0WB/tmphhq5sgcl.jpeg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/cdBEKcRKkhI6NReKvvV5TJVJvcTeFy8omjSdp0Gg7eSMcCarA/tmpp27vv4io.webp' },
    ]
  },
  {
    id: 7,
    prompt: "Colorize",
    inputImage: "https://replicate.delivery/xezq/Lc2fDuvodNUYDq5l9sxhxQV9Ii0DemNU8giMZv2sdzeCvCarA/tmpw194oua8.jpg",
    results: [
      { modelId: 'flux-2-flex', output: 'https://replicate.delivery/xezq/6ZpsQnMxUALEFNhFuCHPQZVYJRFeidLrI7fOu9nXFyWtZBtVA/tmpnufecmrl.webp' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/Lq8btJPxFQaYNVwSRfCNaPPmUqu0HRL7mkh0ELr731hysg2KA/tmp9qoah95a.webp' },
      { modelId: 'flux-2-dev', output: 'https://replicate.delivery/xezq/H7dqqFE6F6J8MBawOIDWhyJFyj9LU3XJCKUgwnooSCbYWQbF/output_370380.webp' },
      { modelId: 'reve-edit', output: 'https://replicate.delivery/xezq/P6pEUYgADvooAJ6ZaxK0wznQuK2h9PDVaShyOJLp1fULtg2KA/tmpniba0prk.png' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/wJr5NFD6GQKsDJYnbPChkzkPDrJ4mgUFBP37WkNh4DVoWQbF/tmpwxhw_o1x.jpg' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/pgrrMVJcmipvO5j63aFbqk3eHnPpfCeU54PaUBpxre9fcLotC/tmppq8qd2f1.jpeg' },
    ]
  },
  {
    id: 8,
    prompt: "Upscale",
    inputImage: "https://replicate.delivery/xezq/Lc2fDuvodNUYDq5l9sxhxQV9Ii0DemNU8giMZv2sdzeCvCarA/tmpw194oua8.jpg",
    results: [
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/oylOvV4IXRIRItNmMfr7nm1alEHuWTYjbrECe8kYu8TPcBtVA/tmpuhyfwdl7.jpeg' },
      { modelId: 'nano-banana-pro', output: 'https://replicate.delivery/xezq/8wdez152R91Zdan9MPEXsXhRG0NOLkkCgPY25PZFc5wbug2KA/tmpqifv4bth.jpeg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/kCUyVe93YrRjHixZRYy6v1n6Evh05uHDDDJnAz7Db6WPug2KA/tmp68ib5jbv.jpg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/Rlws3Rlg16Jeda5rZdWa7GjZcygiJ8vuuJJPqrREiZemcBtVA/tmp6j2vkkjx.jpg' },
      { modelId: 'qwen-image-edit-plus', output: 'https://replicate.delivery/xezq/xnWYWcT0p8ITNtfUNFcKmAgUA10UfiPWZmrr7Vv2bvE5cBtVA/out-0.jpg' },
    ]
  },
  {
    id: 9,
    prompt: "Show a side view of her running",
    inputImage: "https://replicate.delivery/xezq/Lc2fDuvodNUYDq5l9sxhxQV9Ii0DemNU8giMZv2sdzeCvCarA/tmpw194oua8.jpg",
    results: [
      { modelId: 'qwen-image-edit-plus', output: 'https://replicate.delivery/xezq/uKDAKLvmEbKhJpAxJTiezB8AEIII4ANImHKTzNFNJ5oBxg2KA/out-0.jpg' },
      { modelId: 'flux-2-pro', output: 'https://replicate.delivery/xezq/egNhkbMi7l1FZ6a5h4T7jteHCsVEYzjVns9gzicOV1WOoBtVA/tmpvq89c44d.jpg' },
      { modelId: 'flux-2-flex', output: 'https://replicate.delivery/xezq/ohoMEE6Rcpr8MlJIX4N3ED7UnsAyLFwK2XZeqfYiutRhoBtVA/tmpli4ejpma.jpg' },
      { modelId: 'seedream-4', output: 'https://replicate.delivery/xezq/zRXTyCwUWXJJPV9trUIPNVEJIVoN3UpAU3ruQuIFiKsHaQbF/tmpsrdyno3b.jpg' },
      { modelId: 'nano-banana', output: 'https://replicate.delivery/xezq/KGle750LFT18ViKfuxTkDKS1RistCH6dghKe6oFsZx8BRDarA/tmpum9go0qi.jpeg' },
      { modelId: 'seededit-3.0', output: 'https://replicate.delivery/xezq/qB6isuEXurJKDp4Cenk4ub7pAwvbBT6R6NlyHtyPZvFs0g2KA/tmp5enhe4k4.jpg' },
    ]
  }
];

// Model inference times for default examples (in seconds)
const MODEL_INFERENCE_TIMES: Record<string, number> = {
  'nano-banana': 10.22,
  'flux-2-dev': 7.00,
  'flux-2-flex': 26.41,
  'flux-2-pro': 13.48,
  'seedream-4': 13.27,
  'qwen-image-edit': 5.38,
  'qwen-image-edit-plus': 11.82,
  'seededit-3.0': 11.95,
  'nano-banana-pro': 75.01,
  'reve-edit': 19.95,
  'reve-edit-fast': 8.7,
};

interface ExampleCarouselProps {
  onExampleChange: (prompt: string, inputImage: string, results: any[], selectedModels: string[]) => void;
}

export const ExampleCarousel: React.FC<ExampleCarouselProps> = ({ onExampleChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadExample = (index: number) => {
    const example = EXAMPLES[index];
    const formattedResults = example.results.map(r => ({
      modelId: r.modelId,
      status: 'succeeded' as const,
      output: r.output,
      inferenceTime: MODEL_INFERENCE_TIMES[r.modelId] || 0
    }));
    
    // Extract model IDs from the example results
    const selectedModelIds = example.results.map(r => r.modelId);
    
    onExampleChange(example.prompt, example.inputImage, formattedResults, selectedModelIds);
  };

  const nextExample = () => {
    const newIndex = (currentIndex + 1) % EXAMPLES.length;
    setCurrentIndex(newIndex);
    loadExample(newIndex);
  };

  const prevExample = () => {
    const newIndex = (currentIndex - 1 + EXAMPLES.length) % EXAMPLES.length;
    setCurrentIndex(newIndex);
    loadExample(newIndex);
  };

  const goToExample = (index: number) => {
    setCurrentIndex(index);
    loadExample(index);
  };

  const currentExample = EXAMPLES[currentIndex];

  // Load first example on mount
  useEffect(() => {
    loadExample(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-b border-orange-100 dark:border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Dots indicator */}
          <div className="flex gap-1.5">
            {EXAMPLES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToExample(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-6 bg-orange-600 dark:bg-orange-400' 
                    : 'w-1.5 bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-orange-600'
                }`}
                aria-label={`Go to example ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Right: Navigation with page number */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevExample}
              className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors touch-manipulation active:scale-95"
              aria-label="Previous example"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentIndex + 1}
            </span>
            <button
              onClick={nextExample}
              className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors touch-manipulation active:scale-95"
              aria-label="Next example"
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

