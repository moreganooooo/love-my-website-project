// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL({ blobCount = 8, blobSpeed = 0.1 }: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const safeBlobSpeed = Math.max(blobSpeed, 0.01);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * 0.8;
      const ampX = 0.15;
      const ampY = 0.6;
      const speedX = 0.1;
      const speedY = 0.2;
      const phase = Math.PI * 2 * (i / blobCount);
      const radius = 0.12;
      return { baseX, ampX, ampY, speedX, speedY, phase, radius };
    });

    const blobCode = blobCount > 0
      ? blobParams.map((b, i) => `
        vec2 pos${i} = vec2(
          ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
          cos(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampY.toFixed(2)}
        );
        float dist${i} = length(uv - pos${i});
        float strength${i} = ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.0003);
        field += strength${i};
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
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed};

          float field = 0.0;

          ${blobCode}

          float threshold = 0.6;
          float softness = 0.05;
          float mask = smoothstep(threshold - softness, threshold + softness, field);

          vec3 baseColor = vec3(0.12, 0.04, 0.25); // warmer purple

          vec2 glowOrigin = vec2(0.0, -1.0);
          float glowDist = length(uv - glowOrigin);
          float glowStrength = smoothstep(1.4, 0.2, glowDist);
          vec3 glowColor = vec3(1.0, 0.5, 0.2); // warm orange
          vec3 background = mix(baseColor, glowColor, glowStrength * 0.8);

          vec3 blobOrange = vec3(1.0, 0.4, 0.2);
          vec3 blobPurple = vec3(0.6, 0.3, 0.7);
          vec3 blobColor = mix(blobOrange, blobPurple, uv.y * 0.5 + 0.5);

          vec3 color = mix(background, blobColor, mask * 0.5);
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

  return <div ref={mountRef} className="absolute inset-0 -z-10 bg-[#100438]" />;
}
