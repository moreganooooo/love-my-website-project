// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LavaLampGLSLProps {
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

    const toVec3 = (hex: string) => {
      const c = new THREE.Color(hex);
      return `vec3(${c.r.toFixed(3)}, ${c.g.toFixed(3)}, ${c.b.toFixed(3)})`;
    };

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return {
        baseX: side * (0.7 + Math.random() * 0.2),
        ampX: 0.15 + Math.random() * 0.05,
        ampY: 0.6 + Math.random() * 0.2,
        speedX: 0.2 + Math.random() * 0.1,
        speedY: 0.3 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        radius: blobSize,
      };
    });

    const blobCode = blobParams.map((b, i) => `
      vec2 pos${i} = vec2(
        ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
        fract(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * 2.0 - 1.0
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
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
          float t = u_time * ${blobSpeed.toFixed(2)};
          float field = 0.0;

          ${blobCode}

          float mask = smoothstep(1.0, 2.0, field);

          vec3 start = ${toVec3(backgroundStart)};
          vec3 end = ${toVec3(backgroundEnd)};
          vec2 center = vec2(0.0, -1.0);
          float radial = 1.0 - smoothstep(0.0, 1.5, distance(uv, center));
          vec3 bg = mix(start, end, radial);

          vec3 blobStart = ${toVec3(blobColorStart)};
          vec3 blobEnd = ${toVec3(blobColorEnd)};
          vec3 blobColor = mix(blobStart, blobEnd, (uv.y + 1.0) / 2.0);

          vec3 finalColor = mix(bg, blobColor, mask * 0.5);
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
  }, [blobCount, blobSpeed, blobSize, blobColorStart, blobColorEnd, backgroundStart, backgroundEnd]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
