// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL({ blobCount, blobSpeed }: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Fully transparent canvas
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const safeBlobSpeed = Math.max(blobSpeed, 0.05);
    const safeBlobCount = Math.max(blobCount, 0);

    const blobParams = Array.from({ length: safeBlobCount }, (_, i) => {
      const margin = 0.8;
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.18;
      const ampY = 0.8;
      const speedX = 0.15;
      const speedY = 0.35;
      const phase = Math.PI * 2 * (i / safeBlobCount);
      const radius = 0.17;
      return { baseX, ampX, ampY, speedX, speedY, phase, radius };
    });

    const blobCode = safeBlobCount > 0
      ? blobParams.map((b, i) => `
          vec2 pos${i} = vec2(
            ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
            cos(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampY.toFixed(2)}
          );
          float dist${i} = length(uv - pos${i});
          field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.001);
        `).join("\n")
      : "// no blobs";

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed};

          float field = 0.0;
          ${blobCode}
          float mask = smoothstep(1.0, 2.0, field);

          // Warm gradient background from bottom center
          vec3 basePurple = vec3(0.16, 0.05, 0.24);     // deep warm purple
          vec3 sunsetOrange = vec3(0.9, 0.45, 0.2);     // soft warm orange
          float r = length(uv - vec2(0.0, -1.25));
          float glowFactor = smoothstep(2.0, 0.2, r);
          float yFade = smoothstep(-1.0, -0.3, uv.y);
          vec3 background = basePurple + glowFactor * yFade * 0.35 * (sunsetOrange - basePurple);

          // Blobs with transparency and deeper tones
          vec3 blobColor = mix(sunsetOrange, basePurple, uv.y * 0.5 + 0.5);
          float blobAlpha = 0.5;
          vec3 color = mix(background, blobColor, mask * blobAlpha);

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

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 -z-10 bg-[#100438]" // matches base purple
    />
  );
}
