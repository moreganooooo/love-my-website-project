// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
  blobSize: number;
  blobColorStart: string;
  blobColorEnd: string;
  backgroundStart: string;
  backgroundEnd: string;
}

export default function LavaLampGLSL({
  blobCount,
  blobSpeed,
  blobSize,
  blobColorStart,
  blobColorEnd,
  backgroundStart,
  backgroundEnd,
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const safeBlobSpeed = Math.max(blobSpeed, 0.05);
    const safeBlobSize = Math.max(blobSize, 0.01);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const margin = 0.8;
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.18;
      const ampY = 0.8;
      const speedX = 0.22;
      const speedY = 0.55;
      const phase = Math.PI * 2 * (i / blobCount);
      const radius = safeBlobSize;
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
      u_blobColorStart: { value: new THREE.Color(blobColorStart) },
      u_blobColorEnd: { value: new THREE.Color(blobColorEnd) },
      u_bgStart: { value: new THREE.Color(backgroundStart) },
      u_bgEnd: { value: new THREE.Color(backgroundEnd) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_blobColorStart;
        uniform vec3 u_blobColorEnd;
        uniform vec3 u_bgStart;
        uniform vec3 u_bgEnd;

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed};
          float field = 0.0;

          ${blobCode}

          float mask = smoothstep(1.0, 2.0, field);

          // 💡 Radial gradient from bottom center
          float grad = distance(uv, vec2(0.0, -1.0));
          grad = clamp(1.0 - grad, 0.0, 1.0);
          vec3 background = mix(u_bgStart, u_bgEnd, grad);

          // 🟠 Blob gradient vertical blend
          float yGrad = (uv.y + 1.0) / 2.0;
          vec3 blobColor = mix(u_blobColorStart, u_blobColorEnd, yGrad);

          // Final composition
          vec3 finalColor = mix(background, blobColor, mask * 0.5);
          gl_FragColor = vec4(finalColor, 1.0);
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
  }, [
    blobCount,
    blobSpeed,
    blobSize,
    blobColorStart,
    blobColorEnd,
    backgroundStart,
    backgroundEnd,
  ]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
