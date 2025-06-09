// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL({ blobCount = 8, blobSpeed = 0.05 }: LavaLampGLSLProps) {
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

    const safeBlobSpeed = Math.max(blobSpeed, 0.01);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const margin = 0.8;
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.18;
      const ampY = 0.8;
      const speedX = 0.12;
      const speedY = 0.25;
      const phase = Math.PI * 2 * (i / blobCount);
      const radius = 0.14;
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
      transparent: true,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed.toFixed(2)};
          float field = 0.0;

          ${blobCode}

          float mask = smoothstep(1.0, 2.0, field);

          // Gradient background (deep purple to warm orange glow from bottom center)
          vec3 basePurple = vec3(0.16, 0.06, 0.28);  // warmer purple
          vec3 warmOrange = vec3(1.0, 0.6, 0.2);
          float r = length(uv - vec2(0.0, -1.2));
          float g = smoothstep(1.5, 0.0, r);
          vec3 background = mix(basePurple, warmOrange, g);

          // Lava blobs: deeper richer orange/purple mix, semi-transparent
          vec3 blobColor = mix(vec3(0.9, 0.5, 0.2), vec3(0.5, 0.2, 0.6), (uv.y + 1.0) * 0.5);

          vec3 finalColor = mix(background, blobColor, mask);
          float alpha = 0.5 * mask;

          gl_FragColor = vec4(finalColor, alpha);
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

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
