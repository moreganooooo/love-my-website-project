// src/components/BackgroundWrapper.tsx

import { useState, useEffect } from "react";
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

  const [blobColorStart, setBlobColorStart] = useState("#ff7a45");
  const [blobColorEnd, setBlobColorEnd] = useState("#9b4dcb");
  const [backgroundStart, setBackgroundStart] = useState("#110224");
  const [backgroundEnd, setBackgroundEnd] = useState("#fc8b51");

  const resetToGorgeous = () => {
    setBlobCount(10);
    setBlobSpeed(0.1);
    setBlobSize(0.16);
    setBlobColorStart("#ff7a45");
    setBlobColorEnd("#9b4dcb");
    setBackgroundStart("#110224");
    setBackgroundEnd("#fc8b51");
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

      <div className="max-w-6xl mx-auto relative z-10">
        {toggleable && (
          <div className="flex flex-col items-end gap-4 mb-6">
            <label className="flex items-center gap-2 text-white text-sm">
              Lava Lamp Background
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </label>

            <details className="w-full text-white">
              <summary className="cursor-pointer select-none py-1 px-2 rounded bg-white/10 hover:bg-white/20 transition w-max">
                Customize Lava Lamp
              </summary>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-white/10 backdrop-blur rounded-lg">
                <label>
                  <span className="text-sm">Blob Count: {blobCount}</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={blobCount}
                    onChange={e => setBlobCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Blob Speed: {blobSpeed.toFixed(2)}</span>
                  <input
                    type="range"
                    min={0.05}
                    max={1.0}
                    step={0.01}
                    value={blobSpeed}
                    onChange={e => setBlobSpeed(Math.max(0.05, parseFloat(e.target.value)))}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Blob Size: {blobSize.toFixed(2)}</span>
                  <input
                    type="range"
                    min={0.05}
                    max={0.4}
                    step={0.01}
                    value={blobSize}
                    onChange={e => setBlobSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Blob Color Start</span>
                  <input
                    type="color"
                    value={blobColorStart}
                    onChange={e => setBlobColorStart(e.target.value)}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Blob Color End</span>
                  <input
                    type="color"
                    value={blobColorEnd}
                    onChange={e => setBlobColorEnd(e.target.value)}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Background Color Start</span>
                  <input
                    type="color"
                    value={backgroundStart}
                    onChange={e => setBackgroundStart(e.target.value)}
                    className="w-full"
                  />
                </label>

                <label>
                  <span className="text-sm">Background Color End</span>
                  <input
                    type="color"
                    value={backgroundEnd}
                    onChange={e => setBackgroundEnd(e.target.value)}
                    className="w-full"
                  />
                </label>
              </div>

              <button
                onClick={resetToGorgeous}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-md py-1.5 text-sm font-semibold hover:brightness-110 transition"
              >
                Reset to Gorgeous
              </button>
            </details>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
