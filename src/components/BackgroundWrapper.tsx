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

  return (
    <section id={id} className="relative overflow-hidden py-20 px-6">
      {enabled && (
        <LavaLampGLSL
          blobCount={5}
          blobSpeed={1.0}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {toggleable && (
          <div className="flex justify-end mb-6">
            <label className="flex items-center gap-2 text-slate-600 text-sm">
              Lava Lamp Background
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </label>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}