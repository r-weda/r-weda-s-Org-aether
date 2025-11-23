import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon, Zap } from 'lucide-react';
import { useDebounce } from '../constants'; // Implementing custom debounce inside hook or util

const styles = [
  { name: 'Cyberpunk', prompt: 'cyberpunk city, neon lights, futuristic, high detail, 8k' },
  { name: 'Realistic', prompt: 'photorealistic, cinematic lighting, 8k, highly detailed' },
  { name: 'Anime', prompt: 'anime style, studio ghibli, vibrant, detailed' },
  { name: 'Oil Painting', prompt: 'oil painting, textured, artistic, masterpiece' },
  { name: 'Abstract', prompt: 'abstract art, geometric shapes, colorful, digital art' },
];

export const ImageGen: React.FC<{ addXp: (n: number) => void }> = ({ addXp }) => {
  const [prompt, setPrompt] = useState('A futuristic city floating in the clouds');
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Debounce the prompt for the "Live" effect
  const [debouncedPrompt, setDebouncedPrompt] = useState(prompt);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrompt(prompt);
    }, 800); // 800ms delay for "typing" feel without spamming
    return () => clearTimeout(handler);
  }, [prompt]);

  useEffect(() => {
    if (!debouncedPrompt) return;
    
    setLoading(true);
    const fullPrompt = encodeURIComponent(`${debouncedPrompt}, ${selectedStyle.prompt}`);
    // Using Pollinations.ai for "live" instant generation without API Key requirement for the demo
    const url = `https://image.pollinations.ai/prompt/${fullPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
    
    // Preload image
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setLoading(false);
      addXp(5); // Small XP for generating
    };
  }, [debouncedPrompt, selectedStyle]);

  const saveToGallery = () => {
    setHistory(prev => [imageUrl, ...prev]);
    addXp(50);
  };

  return (
    <div className="h-full p-4 flex flex-col lg:flex-row gap-6">
      {/* Controls */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-display text-neon-pink flex items-center gap-2">
            <Sparkles /> Visual Cortex
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-wider">Prompt Input</label>
            <textarea
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-neon-pink outline-none h-32 resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-wider">Style Matrix</label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map(style => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-2 text-sm rounded border transition-all ${
                    selectedStyle.name === style.name 
                    ? 'bg-neon-pink/20 border-neon-pink text-white' 
                    : 'border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 text-neon-blue mb-2">
              <Zap size={16} />
              <span className="font-bold text-xs uppercase">Live Render Engine Active</span>
            </div>
            <p className="text-xs text-gray-400">
              The system is continuously generating visualizations based on your input stream. Typing pauses trigger new renders.
            </p>
          </div>
        </div>

        {/* Mini Gallery */}
        <div className="glass-panel p-4 rounded-xl flex-1 overflow-hidden flex flex-col">
          <h3 className="text-sm font-display mb-4 text-gray-400">Output Buffer</h3>
          <div className="grid grid-cols-3 gap-2 overflow-y-auto">
            {history.map((url, i) => (
              <img key={i} src={url} className="w-full aspect-square object-cover rounded border border-gray-800 hover:border-white transition-all cursor-pointer" onClick={() => setImageUrl(url)} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Display */}
      <div className="flex-1 glass-panel p-1 rounded-xl relative group overflow-hidden flex items-center justify-center bg-black/50">
        {loading && (
          <div className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
             <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mb-4"></div>
             <div className="text-neon-pink font-display animate-pulse">RENDERING PIXELS...</div>
          </div>
        )}
        
        {imageUrl ? (
          <img src={imageUrl} alt="Generated" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center text-gray-500">
            <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
            <p>AWAITING INPUT STREAM</p>
          </div>
        )}

        {/* Overlay Actions */}
        {imageUrl && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={saveToGallery}
              className="bg-black/80 hover:bg-neon-pink text-white px-6 py-3 rounded-full backdrop-blur border border-white/20 flex items-center gap-2 font-display"
            >
              <Download size={18} /> SAVE ASSET
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
