import React, { useRef, useEffect, useState } from 'react';
import { Undo, Trash2, Save, PenTool, MousePointer2 } from 'lucide-react';

export const CollabBoard: React.FC<{ addXp: (n: number) => void }> = ({ addXp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00f3ff');
  const [lineWidth, setLineWidth] = useState(2);
  
  // Basic history implementation
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Resize handling
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Black background
      saveState();
    }

    const handleResize = () => {
        // In a real app we'd redraw the image data, simpler here to just reset or keep size
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      if (historyRef.current.length > 10) historyRef.current.shift();
      historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && historyRef.current.length > 1) {
      historyRef.current.pop(); // Remove current state
      const previousState = historyRef.current[historyRef.current.length - 1];
      ctx.putImageData(previousState, 0, 0);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get correct coordinates
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    // Neon glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
      addXp(2);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 relative">
      <div className="glass-panel p-2 rounded-xl flex justify-between items-center z-10">
        <div className="flex gap-2 items-center">
            <PenTool className="text-neon-blue mx-2" />
            {[ '#00f3ff', '#bc13fe', '#0aff68', '#ff0055', '#ffffff' ].map(c => (
                <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
                />
            ))}
            <div className="w-px h-8 bg-gray-700 mx-2" />
            <input 
                type="range" min="1" max="20" 
                value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-24 accent-white"
            />
        </div>
        <div className="flex gap-2">
            <button onClick={undo} className="p-2 hover:bg-white/10 rounded-lg text-white"><Undo size={20} /></button>
            <button onClick={clear} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500"><Trash2 size={20} /></button>
            <button className="p-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black font-bold flex items-center gap-2">
                <Save size={18} /> EXPORT
            </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl overflow-hidden relative cursor-crosshair">
         <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
         />
         <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 text-xs text-gray-500">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             LIVE SESSION ACTIVE
         </div>
      </div>
    </div>
  );
};
