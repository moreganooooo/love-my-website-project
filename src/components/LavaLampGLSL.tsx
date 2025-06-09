// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL({ blobCount = 10, blobSpeed = 0.1 }: LavaLampGLSLProps) {
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

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return {
        baseX: side * 0.8,
        ampX: 0.2,
        ampY: 0.9,
        speedX: 0.15 + Math.random() * 0.1,
        speedY: 0.2 + Math.random() * 0.2,
        phase: (i / blobCount) * Math.PI * 2,
        radius: 0.16,
      };
    });

    const blobCode = blobParams.map((b, i) => `
      vec2 pos${i} = vec2(
        ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
        cos(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampY.toFixed(2)}
      );
      float dist${i} = length(uv - pos${i});
      field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.001);
    `).join("\n");

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
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed.toFixed(2)};
          float field = 0.0;

          ${blobCode}

          float mask = smoothstep(0.9, 1.3, field);

          // Gradient background: radial from bottom center
          vec3 purple = vec3(0.12, 0.03, 0.25);  // warm purple
          vec3 orange = vec3(1.0, 0.4, 0.15);    // brightened orange
          float radial = length(uv - vec2(0.0, -1.2));
          float glowFactor = smoothstep(2.4, 0.0, radial);
          vec3 background = mix(purple, orange, glowFactor * 0.8);

          // Blob color
          vec3 blobColor = mix(orange, purple, (uv.y + 1.0) * 0.5);
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
  }, [blobCount, blobSpeed]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 -z-10 bg-[#100438]"
    />
  );
}
