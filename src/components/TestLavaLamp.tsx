import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// --- Minimal Shader Material (no custom uniforms for now) ---
const LavaLampMaterial = shaderMaterial(
  { uTime: 0 },
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
    void main() {
      // Animated sunset gradient, just to test
      vec3 top = vec3(0.43, 0.12, 0.56);
      vec3 bottom = vec3(0.93, 0.40, 0.18);
      float t = vUv.y + 0.05*sin(uTime);
      gl_FragColor = vec4(mix(bottom, top, t), 1.0);
    }
  `
);

extend({ LavaLampMaterial });

function LavaLampBlobs() {
  const ref = useRef<any>();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.uTime = clock.getElapsedTime();
  });
  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      {/* THIS TAG NAME IS CRUCIAL */}
      <lavaLampMaterial ref={ref} />
    </mesh>
  );
}

export default function LavaLampTest() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
        <LavaLampBlobs />
      </Canvas>
    </div>
  );
}
