// src/components/BackgroundWrapper.tsx

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

  // Default gorgeous values
  const blobCount = 10;
  const blobSpeed = 0.1;
  const blobSize = 0.16;
  const blobColorStart = '#ff7a45';
  const blobColorEnd = '#9b4dcb';
  const backgroundStart = '#110224';
  const backgroundEnd = '#f9b890';

  return (
    <section id={id} className="relative overflow-hidden py-20 px-6 bg-[#110224] min-h-[100dvh]">
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
          <div className="flex justify-end mb-6">
            <label className="flex items-center gap-2 text-white text-sm">
              Lava Lamp On/Off
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </label>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
