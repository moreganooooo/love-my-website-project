import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ---- SHADER MATERIAL ----
const LavaLampMaterial = shaderMaterial(
  {
    uTime: 0,
    uBlobCount: 5,
    uBlobs: new Float32Array(5 * 4),
    uColors: [
      [0.88, 0.24, 0.52], // Deep pink
      [0.93, 0.40, 0.18], // Orange
      [0.43, 0.12, 0.56], // Purple
      [0.99, 0.60, 0.34], // Light orange
      [0.75, 0.29, 0.49], // Cranberry
    ]
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  // Fragment Shader (GLSL)
  `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform int uBlobCount;
    uniform vec4 uBlobs[5];
    uniform vec3 uColors[5];

    // --- Background Gradient: orange bottom-center, fades to purple ---
    vec3 backgroundGradient(vec2 uv) {
      // Orange glow just off the bottom edge
      vec2 orangeCenter = vec2(0.5, 1.12);
      float orangeGlow = smoothstep(0.68, 0.01, length(uv - orangeCenter));
      vec3 cranberry = vec3(0.43, 0.12, 0.56);
      vec3 orange = vec3(0.93, 0.40, 0.18);

      vec3 color = mix(cranberry, orange, orangeGlow * 1.12);

      // Dreamy vignette (extra cozy)
      float vignette = smoothstep(0.98, 0.73, length(uv - vec2(0.5, 0.53)));
      color = mix(color, cranberry, 1.0 - vignette);

      return color;
    }

    // Metaball field function
    float metaball(vec2 uv, vec2 pos, float r) {
      float dist = length(uv - pos);
      return r * r / (dist * dist + 0.01);
    }

    void main() {
      vec2 uv = vUv;

      // --- Background ---
      vec3 bg = backgroundGradient(uv);

      float field = 0.0;
      vec3 color = vec3(0.0);
      float threshold = 1.0;
      float opacity = 0.5;

      // Control blob size
      float blobScale = 1.5; // tweak to taste

      // --- Main Metaball Loop ---
      for (int i = 0; i < 5; i++) {
        vec4 blob = uBlobs[i];
        vec2 pos = blob.xy;
        float r = blob.z * blobScale;
        int cIdx = int(blob.w);

        float f = metaball(uv, pos, r);
        field += f;

        // --- Realistic shading! ---
        float dist = length(uv - pos) / r;
        // Highlight: upper left
        float highlight = pow(max(0.0, 1.0 - length(uv - (pos + vec2(-r * 0.16, -r * 0.10))) / (r * 0.6)), 2.8);
        // Shadow: lower right
        float shadow = pow(max(0.0, 1.0 - length(uv - (pos + vec2(r * 0.22, r * 0.19))) / (r * 0.7)), 2.1);

        vec3 base = uColors[cIdx];
        vec3 shaded = base + 0.27 * highlight - 0.14 * shadow;
        shaded = clamp(shaded, 0.0, 1.0);

        color += shaded * clamp(f, 0.0, 1.0);
      }

      color /= float(uBlobCount);

      // Metaball shape
      float mask = smoothstep(threshold - 0.14, threshold + 0.10, field);

      // Mix blobs over background with 0.5 opacity
      vec3 finalColor = mix(bg, color, mask * opacity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ LavaLampMaterial });

const LavaLamp = ({ blobCount = 5 }: { blobCount?: number }) => {
  const ref = useRef<any>();

  // Custom colors and radii—tweak as desired!
  const colors = [
    [0.88, 0.24, 0.52],
    [0.93, 0.40, 0.18],
    [0.43, 0.12, 0.56],
    [0.99, 0.60, 0.34],
    [0.75, 0.29, 0.49],
  ];

  // Initial blobs setup (bigger radius!)
  const baseBlobs = useMemo(() => {
    return Array.from({ length: blobCount }, (_, i) => ({
      x: 0.5 + 0.13 * Math.sin(i * 1.3),
      y: 0.17 + i * 0.165,
      r: 0.12 + 0.04 * Math.cos(i), // <--- LARGER
      colorIdx: i % colors.length
    }));
  }, [blobCount, colors.length]);

  // Animate blobs
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const blobs = [];

    for (let i = 0; i < blobCount; i++) {
      // Wobble up, wrap, float horizontally
      let y = (baseBlobs[i].y + 0.18 * Math.abs(Math.sin(t * 0.18 + i)));
      y = (y + 0.12 * Math.sin(t * 0.38 + i * 1.2)) % 1.08;
      let x = baseBlobs[i].x + 0.07 * Math.sin(t * 0.47 + i * 1.7);

      // Breathing radius
      let r = baseBlobs[i].r + 0.022 * Math.sin(t * 0.65 + i);

      blobs.push(x, y, r, baseBlobs[i].colorIdx);
    }
    if (ref.current) {
      ref.current.uTime = t;
      ref.current.uBlobCount = blobCount;
      ref.current.uBlobs = new Float32Array(blobs);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <lavaLampMaterial ref={ref} />
    </mesh>
  );
};

export default function LavaLampSection() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400, // ensures it fills the area
        position: "relative",
        overflow: "hidden",
        borderRadius: "36px"
      }}
    >
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
