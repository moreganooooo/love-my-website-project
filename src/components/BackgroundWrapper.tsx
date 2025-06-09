// src/components/BackgroundWrapper.tsx

import { useState } from "react";
import LavaLampGLSL from "./LavaLampGLSL";
import { Switch } from "@/components/ui/switch";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  id?: string;
  toggleable?: boolean;
}

export default function BackgroundWrapper({ children, id, toggleable = false }: BackgroundWrapperProps) {
  const [enabled, setEnabled] = useState(true);
  const [blobCount, setBlobCount] = useState(10);
  const [blobSpeed, setBlobSpeed] = useState(0.1);
  const [blobSize, setBlobSize] = useState(0.16);

  const [blobColorStart, setBlobColorStart] = useState("#f9b890"); // warm light orange
  const [blobColorEnd, setBlobColorEnd] = useState("#b76bf2");     // rich lavender
  const [backgroundStart, setBackgroundStart] = useState("#6f0e7b"); // warm deep purple
  const [backgroundEnd, setBackgroundEnd] = useState("#f9b890");     // glowing orange

  const resetToGorgeous = () => {
    setBlobCount(10);
    setBlobSpeed(0.1);
    setBlobSize(0.16);
    setBlobColorStart("#f9b890");
    setBlobColorEnd("#b76bf2");
  };

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

      <div className="max-w-8xl mx-auto relative z-10">
        {toggleable && (
            <details className="grid grid-cols-1 md:grid-cols-2 w-full text-white">
              <summary className="cursor-pointer select-none py-1 px-2 rounded bg-white/10 hover:bg-white/20 transition w-max">
                Customize ♥︎
              </summary>

            <div className="flex flex-col items-end gap-4 mb-6">
              <label className="flex items-center gap-2 text-white text-sm">
                Lava On/Off
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-white/10 backdrop-blur rounded-lg">
                <label>
                  <span className="text-sm">Lava Count: {blobCount}</span>
                  <input type="range" min={1} max={20} value={blobCount}
                    onChange={e => setBlobCount(parseInt(e.target.value))} className="w-full" />
                </label>

                <label>
                  <span className="text-sm">Lava Speed: {blobSpeed.toFixed(2)}</span>
                  <input type="range" min={0.05} max={1.0} step={0.01} value={blobSpeed}
                    onChange={e => setBlobSpeed(Math.max(0.05, parseFloat(e.target.value)))} className="w-full" />
                </label>

                <label>
                  <span className="text-sm">Lava Size: {blobSize.toFixed(2)}</span>
                  <input type="range" min={0.05} max={0.4} step={0.01} value={blobSize}
                    onChange={e => setBlobSize(parseFloat(e.target.value))} className="w-full" />
                </label>

                <label>
                  <span className="text-sm">Bottom Lava</span>
                  <input type="color" value={blobColorStart} onChange={e => setBlobColorStart(e.target.value)} className="w-full" />
                </label>

                <label>
                  <span className="text-sm"> Top Lava</span>
                  <input type="color" value={blobColorEnd} onChange={e => setBlobColorEnd(e.target.value)} className="w-full" />
                </label>

                <button
                  onClick={resetToGorgeous}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-md py-1.5 text-sm font-semibold hover:brightness-110 transition"
                >
                  Reset to Gorgeous
                </button>
              </div>
            </div>
            </details>
        )}

        {children}
      </div>
    </section>
  );
}
