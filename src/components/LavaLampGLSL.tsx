// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL({ blobCount = 8, blobSpeed = 0.08 }: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x100438, 0);
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const safeBlobSpeed = Math.max(blobSpeed, 0.02);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const margin = 0.8;
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.15;
      const ampY = 0.7;
      const speedX = 0.15;
      const speedY = 0.3;
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
          float strength${i} = ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.001);
          field += strength${i};
          glow += 0.015 / (dist${i} + 0.03);
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
          float t = u_time * ${safeBlobSpeed};

          float field = 0.0;
          float glow = 0.0;

          ${blobCode}

          float threshold = 1.0;
          float softness = 0.25;
          float mask = smoothstep(threshold - softness, threshold + softness, field);

          // Background: deep warm purple + radial orange from bottom center
          vec2 radialCenter = vec2(0.0, -1.0);
          float radial = distance(uv, radialCenter);
          float glowFactor = smoothstep(1.2, 0.1, radial);
          vec3 bgPurple = vec3(0.15, 0.04, 0.20); // warmer purple
          vec3 bgOrange = vec3(1.0, 0.5, 0.2);    // sunset orange
          vec3 background = mix(bgPurple, bgOrange, glowFactor);

          // Blobs: deep, warm orange-to-purple blend
          vec3 orange = vec3(1.0, 0.4, 0.2);
          vec3 purple = vec3(0.6, 0.3, 0.6);
          vec3 blobColor = mix(orange, purple, (uv.y + 1.0) / 2.0);

          vec3 softGlow = vec3(1.0, 0.7, 0.4) * glow * 0.25;
          vec3 color = mix(background, blobColor, mask * 0.5);
          color += softGlow * mask;

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

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
