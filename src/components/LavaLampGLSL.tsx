// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

// NOTE: Blob count and visual consistency must not be changed per user request.
export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL(props: LavaLampGLSLProps) {
  console.log('LavaLampGLSL rendered');
  const { blobCount = 8, blobSpeed = 0.2 } = props;
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    console.log('LavaLampGLSL mounted');

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Use alpha: true for transparent canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x100438, 0); // transparent, fallback for unsupported alpha
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Clamp blobSpeed to a minimum value to prevent white/NaN output
    const safeBlobSpeed = Math.max(blobSpeed, 0.05);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const margin = 0.8; // less randomness
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.18; // fixed amplitude for smoothness
      const ampY = 0.8;
      const speedX = 0.22; // fixed speed for smoothness
      const speedY = 0.55;
      const phase = Math.PI * 2 * (i / blobCount); // evenly distributed phases
      const radius = 0.14; // fixed radius for smoothness
      return { baseX, ampX, ampY, speedX, speedY, phase, radius };
    });

    const blobCode = blobCount > 0
      ? blobParams.map((b, i) => `
          vec2 pos${i} = vec2(
            ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
            cos(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampY.toFixed(2)}
          );
          float dist${i} = length(uv - pos${i});
          field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.001);
        `).join("\n") : "// no blobs";

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: false,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed.toFixed(2)};
          float field = 0.0;

           // Blobs
           ${blobCode}

          // Soft mask for natural blob blending
          float threshold = 1.0;
          float softness = 0.2;
          float fadeY = smoothstep(1.0, 0.6, uv.y); // fade out at top
          float maskBase = smoothstep(threshold - softness, threshold + softness, field);
          float mask = maskBase * fadeY;

          // Rich background: deep purple + radial orange glow
         vec3 baseColor = vec3(0.06, 0.015, 0.18); // dark purple
         vec3 glowColor = vec3(1.0, 0.45, 0.15);   // warm orange
         float glowFactor = smoothstep(2.4, -0.6, length(uv - vec2(0.0, -1.3)));
         vec3 background = mix(baseColor, glowColor, glowFactor);

          // Lava blob color blending
          vec3 blobColor = mix(glowColor, vec3(0.65, 0.4, 0.95), clamp(uv.y * 0.5 + 0.5, 0.0, 1.0));

          // Final composite
          vec3 color = mix(background, blobColor, mask);
          gl_FragColor = vec4(color, 1.0);
        }
      `,

    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [blobCount, blobSpeed]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 bg-[#100438] bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700" />;
}
