import { useState } from 'react';
import LavaLampGLSL from './LavaLampGLSL';
import { Switch } from '@/components/ui/switch';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  id?: string;
  toggleable?: boolean;
}

export default function BackgroundWrapper({ children, id, toggleable = false }: BackgroundWrapperProps) {
  const [enabled, setEnabled] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const [blobCount, setBlobCount] = useState(10);
  const [blobSpeed, setBlobSpeed] = useState(0.15);
  const [blobSize, setBlobSize] = useState(0.18);

  const [blobColorStart, setBlobColorStart] = useState('#ff6600');
  const [blobColorEnd, setBlobColorEnd] = useState('#bb33ff');
  const [backgroundStart, setBackgroundStart] = useState('#160330');
  const [backgroundEnd, setBackgroundEnd] = useState('#ff6600');

  return (
    <section id={id} className="relative overflow-hidden py-20 px-6">
      {enabled && (
        <LavaLampGLSL
          blobCount={blobCount}
          blobSpeed={blobSpeed}
          blobSize={blobSize}
          blobColorStart={blobColorStart}
          blobColorEnd={blobColorEnd}
          backgroundStart={backgroundStart}
          backgroundEnd={backgroundEnd}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {toggleable && (
          <div className="flex justify-between mb-6">
            <label className="flex items-center gap-2 text-slate-200 text-sm">
              Lava Lamp Background
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </label>
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded"
            >
              {showControls ? 'Hide Controls' : 'Show Lava Controls'}
            </button>
          </div>
        )}

        {showControls && enabled && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6 text-white bg-white/10 backdrop-blur-md p-4 rounded-lg">
            <label>Blobs <input type="range" min={0} max={20} value={blobCount} onChange={e => setBlobCount(+e.target.value)} /></label>
            <label>Speed <input type="range" min={0.05} max={0.5} step={0.01} value={blobSpeed} onChange={e => setBlobSpeed(+e.target.value)} /></label>
            <label>Size <input type="range" min={0.05} max={0.3} step={0.01} value={blobSize} onChange={e => setBlobSize(+e.target.value)} /></label>
            <label>Blob Start <input type="color" value={blobColorStart} onChange={e => setBlobColorStart(e.target.value)} /></label>
            <label>Blob End <input type="color" value={blobColorEnd} onChange={e => setBlobColorEnd(e.target.value)} /></label>
            <label>BG Start <input type="color" value={backgroundStart} onChange={e => setBackgroundStart(e.target.value)} /></label>
            <label>BG End <input type="color" value={backgroundEnd} onChange={e => setBackgroundEnd(e.target.value)} /></label>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
