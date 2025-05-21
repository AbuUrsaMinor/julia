import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useState } from 'react';
import './App.css';
import JuliaSet from './components/fractal/JuliaSet';
import CRTEffect from './components/ui/CRTEffect';

function App() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [mode, setMode] = useState<'julia' | 'mandelbrot'>('julia');

  const handleToggleRotation = useCallback(() => {
    setAutoRotate(!autoRotate);
  }, [autoRotate]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* UI Controls - Now positioned above Canvas */}
      <div className="fixed top-0 left-0 p-4 z-50 flex flex-col gap-4 pointer-events-auto">
        <div className="group">
          <div className="px-4 py-2 bg-[#121212] border-2 border-[#00ffff] text-[#00ffff] shadow-[0_0_10px_#00ffff]">
            Fractal Viewer
          </div>
        </div>
        <button
          onClick={() => setMode(mode === 'julia' ? 'mandelbrot' : 'julia')}
          className="group px-4 py-2 bg-[#121212] border-2 border-[#00ffff] text-[#00ffff] hover:shadow-[0_0_10px_#00ffff] transition-all"
        >
          Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
        <button
          className="group px-4 py-2 bg-[#121212] border-2 border-[#00ffff] text-[#00ffff] hover:shadow-[0_0_10px_#00ffff] transition-all"
          onClick={handleToggleRotation}
        >
          {autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        </button>
      </div>

      {/* Canvas container with pointer-events-none */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none">
        <Canvas className="w-screen h-screen !pointer-events-auto" style={{ width: '100vw', height: '100vh' }}>
          <color attach="background" args={['#121212']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight position={[-5, -5, 3]} intensity={0.2} color="#ff00ff" />
          <JuliaSet position={[0, 0, 0]} mode={mode} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* CRT Effect Overlay */}
      <CRTEffect />
    </div>
  );
}

export default App;
