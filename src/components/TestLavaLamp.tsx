import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// 1. Define the shader material
const LavaLampMaterial = shaderMaterial(
  {
    uTime: 0,
    uBlobs: new Float32Array(5 * 4),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec4 uBlobs[5];
    void main() {
      vec2 uv = vUv;
      float field = 0.0;
      for (int i = 0; i < 5; i++) {
        vec2 pos = uBlobs[i].xy;
        float r = uBlobs[i].z;
        float d = length(uv - pos);
        field += r*r/(d*d+0.01);
      }
      float mask = smoothstep(1.0 - 0.14, 1.0 + 0.10, field);
      vec3 color = mix(vec3(0.43,0.12,0.56), vec3(0.93,0.40,0.18), uv.y);
      color = mix(color, vec3(0.9,0.3,0.4), mask*0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ LavaLampMaterial });

const TestLavaLamp = () => {
  const ref = useRef<any>();
  const baseBlobs = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: 0.5 + 0.13 * Math.sin(i * 1.3),
      y: 0.17 + i * 0.165,
      r: 0.12 + 0.04 * Math.cos(i),
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const blobs = [];
    for (let i = 0; i < 5; i++) {
      let y = (baseBlobs[i].y + 0.18 * Math.abs(Math.sin(t * 0.18 + i)));
      y = (y + 0.12 * Math.sin(t * 0.38 + i * 1.2)) % 1.08;
      let x = baseBlobs[i].x + 0.07 * Math.sin(t * 0.47 + i * 1.7);
      let r = baseBlobs[i].r + 0.022 * Math.sin(t * 0.65 + i);
      blobs.push(x, y, r, 0);
    }
    if (ref.current) {
      ref.current.uTime = t;
      ref.current.uBlobs = new Float32Array(blobs);
    }
  });

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
        <mesh>
          <planeGeometry args={[1, 1]} />
          {/* @ts-ignore */}
          <lavaLampMaterial ref={ref} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default TestLavaLamp;
