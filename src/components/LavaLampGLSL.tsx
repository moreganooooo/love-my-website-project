// src/components/LavaLampGLSL.tsx

import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LavaLampGLSLProps {
  blobCount?: number;
  blobSpeed?: number;
  blobSize?: number;
  blobColorStart?: string;
  blobColorEnd?: string;
  backgroundStart?: string;
  backgroundEnd?: string;
}

export default function LavaLampGLSL({
  blobCount = 10,
  blobSpeed = 0.1,
  blobSize = 0.16,
  blobColorStart = '#ff7a45',
  blobColorEnd = '#9b4dcb',
  backgroundStart = '#2e003e', // deep cranberry purple
  backgroundEnd = '#ff8c42',   // soft orange
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    console.log('Canvas size:', width, height);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.debug.checkShaderErrors = true;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mount.appendChild(canvas);

    console.log('Renderer appended:', canvas);

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
        1.0 - fract(t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}) * 2.0 // flip upward
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
          vec2 uv = gl_FragCoord.xy / u_resolution;
          uv.y = 1.0 - uv.y;
          vec2 centeredUv = uv * 2.0 - 1.0;
          float t = u_time * ${blobSpeed.toFixed(2)};
          float field = 0.0;

          ${blobCode}

          float mask = smoothstep(0.7, 1.8, field);

          vec3 bgStart = ${toVec3(backgroundStart)};
          vec3 bgEnd = ${toVec3(backgroundEnd)};
          vec2 center = vec2(0.0, -1.0);
          float radial = smoothstep(1.5, 0.0, distance(centeredUv, center));
          vec3 bg = mix(bgStart, bgEnd, radial);

          vec3 blobStart = ${toVec3(blobColorStart)};
          vec3 blobEnd = ${toVec3(blobColorEnd)};
          vec3 blobColor = mix(blobStart, blobEnd, uv.y);

          vec3 finalColor = mix(bg, blobColor, mask * 0.4);

          gl_FragColor = vec4(finalColor, mask * 0.6 + 0.2);
        }
      `,
      depthTest: false,
      depthWrite: false,
      transparent: false,
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
      mount.removeChild(canvas);
    };
  }, [blobCount, blobSpeed, blobSize, blobColorStart, blobColorEnd, backgroundStart, backgroundEnd]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'black',
        zIndex: -1,
      }}
    />
  );
}
