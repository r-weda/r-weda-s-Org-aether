import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, MeshDistortMaterial } from '@react-three/drei';
import { Box } from 'lucide-react';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
    }
  }
}

const Model = ({ config }: { config: any }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current && config.autoRotate) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <MeshDistortMaterial 
        color={config.color} 
        metalness={config.metalness} 
        roughness={config.roughness}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
};

export const Product3D: React.FC = () => {
  const [config, setConfig] = useState({
    color: '#00f3ff',
    metalness: 0.8,
    roughness: 0.2,
    autoRotate: true
  });

  return (
    <div className="h-full flex flex-col md:flex-row relative">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
          <Stage environment="city" intensity={0.6}>
            <Model config={config} />
          </Stage>
          <OrbitControls makeDefault />
        </Canvas>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-6 left-6 z-10 w-80">
        <div className="glass-panel p-6 rounded-xl backdrop-blur-md">
          <h2 className="text-xl font-display text-white mb-6 flex items-center gap-2">
            <Box className="text-neon-green" /> Artifact Config
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-xs uppercase text-gray-400 mb-2 block">Material Color</label>
              <div className="flex gap-2">
                {['#00f3ff', '#bc13fe', '#0aff68', '#ff0055', '#ffffff'].map(c => (
                  <button
                    key={c}
                    onClick={() => setConfig({ ...config, color: c })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.color === c ? 'border-white scale-110 shadow-lg shadow-white/50' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase text-gray-400 mb-2">
                <span>Metalness</span>
                <span>{Math.round(config.metalness * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={config.metalness}
                onChange={(e) => setConfig({ ...config, metalness: parseFloat(e.target.value) })}
                className="w-full accent-neon-green h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase text-gray-400 mb-2">
                <span>Roughness</span>
                <span>{Math.round(config.roughness * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={config.roughness}
                onChange={(e) => setConfig({ ...config, roughness: parseFloat(e.target.value) })}
                className="w-full accent-neon-green h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-white">Auto Rotation</span>
              <button 
                onClick={() => setConfig({ ...config, autoRotate: !config.autoRotate })}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${config.autoRotate ? 'bg-neon-green' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${config.autoRotate ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-lg text-xs text-neon-green border-neon-green animate-pulse">
           WEBGL ACCELERATED // 60 FPS
        </div>
      </div>
    </div>
  );
};