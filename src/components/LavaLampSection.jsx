import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// --------- SHADER MATERIAL FOR LAVA EFFECT ---------
const LavaLampMaterial = shaderMaterial(
  {
    uTime: 0,
    uBlobCount: 5,
    uBlobs: new Array(5 * 4).fill(0), // [x, y, r, colorIndex, ...]
    uColors: [
      [0.88, 0.24, 0.52], // Deep pink
      [0.93, 0.40, 0.18], // Orange
      [0.43, 0.12, 0.56], // Purple
      [0.99, 0.60, 0.34], // Lighter orange
      [0.75, 0.29, 0.49], // Cranberry
    ]
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4( position, 1.0 );
    }
  `,
  // Fragment Shader
  `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform int uBlobCount;
    uniform vec4 uBlobs[5];
    uniform vec3 uColors[5];

    // Lava lamp background gradient
    vec3 backgroundGradient(vec2 uv) {
      vec2 center = vec2(0.5, 0.1);
      float r = length(uv - center);
      float radial = smoothstep(0.8, 0.0, r);

      // Smooth sunset blend: purple on top/side, orange in center/bottom
      vec3 cranberry = vec3(0.43, 0.12, 0.56);
      vec3 orange = vec3(0.93, 0.40, 0.18);

      // Interpolate color
      vec3 color = mix(cranberry, orange, radial * 1.2);
      // Add subtle vignette
      float vignette = smoothstep(0.98, 0.7, r);
      color *= vignette * 0.95 + 0.05;
      return color;
    }

    // Metaball field function
    float metaball(vec2 uv, vec2 pos, float r) {
      float dist = length(uv - pos);
      return r * r / (dist * dist + 0.01);
    }

    void main() {
      vec2 uv = vUv;

      // Background
      vec3 bg = backgroundGradient(uv);

      // Metaball field & color blend
      float field = 0.0;
      vec3 color = vec3(0.0);

      // Parameters for how "blobby" and smooth the blending is
      float threshold = 1.0;
      float opacity = 0.5;

      for (int i = 0; i < 5; i++) {
        vec4 blob = uBlobs[i];
        vec2 pos = blob.xy;
        float r = blob.z;
        int cIdx = int(blob.w);

        float f = metaball(uv, pos, r);
        field += f;

        // Each blob adds color, weighted by its field strength
        color += uColors[cIdx] * clamp(f, 0.0, 1.0);
      }

      color /= float(uBlobCount);

      // Smooth metaball contour
      float mask = smoothstep(threshold - 0.12, threshold + 0.10, field);

      // Output: blend blobs over the gradient, at 50% opacity
      vec3 finalColor = mix(bg, color, mask * opacity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

const LavaLamp = ({ width = 600, height = 800 }) => {
  const ref = useRef();

  // Blob config: You can tweak these!
  const blobCount = 5;
  const colors = [
    [0.88, 0.24, 0.52],
    [0.93, 0.40, 0.18],
    [0.43, 0.12, 0.56],
    [0.99, 0.60, 0.34],
    [0.75, 0.29, 0.49],
  ];

  // Initial positions/radii/colors for the blobs
  const baseBlobs = useMemo(() => {
    return Array.from({ length: blobCount }, (_, i) => ({
      x: 0.5 + 0.13 * Math.sin(i * 1.3),
      y: 0.2 + i * 0.16,
      r: 0.09 + 0.03 * Math.cos(i),
      colorIdx: i % colors.length
    }));
  }, [blobCount, colors.length]);

  // Animate the blobs
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const blobs = [];

    for (let i = 0; i < blobCount; i++) {
      // Wobbly vertical movement + wrap-around at the top
      let y = (baseBlobs[i].y + 0.16 * Math.abs(Math.sin(t * 0.15 + i)));
      y = (y + 0.1 * Math.sin(t * 0.4 + i * 1.2)) % 1.1;

      // Gentle horizontal swaying
      let x = baseBlobs[i].x + 0.05 * Math.sin(t * 0.5 + i * 1.7);

      // Breathing radius
      let r = baseBlobs[i].r + 0.015 * Math.sin(t * 0.7 + i);

      blobs.push(x, y, r, baseBlobs[i].colorIdx);
    }
    if (ref.current) {
      ref.current.uTime = t;
      ref.current.uBlobCount = blobCount;
      ref.current.uBlobs = blobs;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <lavaLampMaterial ref={ref} />
    </mesh>
  );
};

// Register shader material
const LavaLampMaterialComponent = React.memo(LavaLampMaterial);
extend({ LavaLampMaterial: LavaLampMaterialComponent });

export default function LavaLampSection() {
  return (
    <div style={{
      width: "100%",
      height: "600px",
      position: "relative",
      overflow: "hidden",
      borderRadius: "36px",
      boxShadow: "0 10px 32px rgba(0,0,0,0.14)"
    }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 5] }}
        style={{ width: "100%", height: "100%" }}
      >
        <LavaLamp />
      </Canvas>
    </div>
  );
}
