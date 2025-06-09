import { useState, useEffect } from "react";
import LavaLampGLSL from "./LavaLampGLSL";

const STORAGE_KEY = "lavaLampSettings";

export default function LavaLampControls() {
  const [blobCount, setBlobCount] = useState(8);
  const [blobSpeed, setBlobSpeed] = useState(0.2);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { blobCount, blobSpeed } = JSON.parse(stored);
      setBlobCount(blobCount);
      setBlobSpeed(blobSpeed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ blobCount, blobSpeed })
    );
  }, [blobCount, blobSpeed]);

  const resetSettings = () => {
    setBlobCount(8);
    setBlobSpeed(0.2);
  };

  return (
    <div className="relative w-full h-screen">
      <LavaLampGLSL
        blobCount={blobCount}
        blobSpeed={blobSpeed}
      />

      <div className="absolute bottom-4 left-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg space-y-3 w-64">
        <label className="block">
          <span className="text-sm font-medium">Blob Count: {blobCount}</span>
          <input
            type="range"
            min="3"
            max="20"
            value={blobCount}
            onChange={(e) => setBlobCount(parseInt(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Blob Speed: {blobSpeed}</span>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.01"
            value={blobSpeed}
            onChange={(e) => setBlobSpeed(Math.max(0.05, parseFloat(e.target.value)))}
            className="w-full"
          />
        </label>

        <button
          onClick={resetSettings}
          className="w-full mt-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md py-1.5 text-sm font-semibold hover:brightness-110 transition"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
