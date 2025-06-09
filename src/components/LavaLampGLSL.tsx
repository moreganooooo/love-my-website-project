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
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const safeBlobSpeed = Math.max(blobSpeed, 0.05);
    const safeBlobCount = Math.max(blobCount, 0);

    const blobParams = Array.from({ length: safeBlobCount }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return {
        baseX: side * 0.8,
        ampX: 0.18,
        ampY: 0.8,
        speedX: 0.15,
        speedY: 0.35,
        phase: (Math.PI * 2 * i) / safeBlobCount,
        radius: 0.17,
      };
    });

    const blobCode =
      safeBlobCount > 0
        ? blobParams
            .map(
              (b, i) => `
          vec2 pos${i} = vec2(
            ${b.baseX} + sin(t * ${b.speedX} + ${b.phase}) * ${b.ampX},
            cos(t * ${b.speedY} + ${b.phase}) * ${b.ampY}
          );
          float dist${i} = length(uv - pos${i});
          field += ${b.radius} * ${b.radius} / (dist${i} * dist${i} + 0.001);
        `
            )
            .join("\n")
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
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${safeBlobSpeed};

          float field = 0.0;
          ${blobCode}

          float mask = smoothstep(1.0, 1.5, field);

          // Radial gradient from bottom center
          vec3 darkPurple = vec3(0.1, 0.03, 0.25); // base
          vec3 sunsetOrange = vec3(1.0, 0.45, 0.15); // glow
          float radial = length(uv - vec2(0.0, -1.2));
          float radialFade = smoothstep(2.5, 0.2, radial);
          vec3 background = mix(darkPurple, sunsetOrange, radialFade * 0.7);

          // Blobs blend into background
          vec3 blobColor = mix(sunsetOrange, darkPurple, uv.y * 0.5 + 0.5);
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
      className="absolute inset-0 -z-10 bg-[#100438]" // visually locked base
    />
  );
}
