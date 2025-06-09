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
  blobCount = 32,
  blobSpeed = 0.48,
  blobSize = 0.16,
  blobColorStart = '#6e285f',
  blobColorEnd = '#b15d6a',
  backgroundStart = '#2e003e',
  backgroundEnd = '#ff8c42',
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.offsetWidth;
    const height = mount.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const blobCode = Array.from({ length: blobCount }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * 0.8;
      const ampX = 0.15;
      const ampY = 1.4;
      const speedX = 0.3 + Math.random() * 0.15;
      const speedY = 0.5 + Math.random() * 0.25;
      const phase = (i / blobCount) * Math.PI * 2;
      const radius = 0.1 + Math.random() * (blobSize - 0.1);
      const stretch = 0.85 + Math.random() * 0.3;
      const wobbleFreq = 1.0 + Math.random();
      const wobbleAmp = 0.02 + Math.random() * 0.03;
      const shade = 0.3 + Math.random() * 0.4;
      return `
        vec2 pos${i} = vec2(
          ${baseX.toFixed(2)} + sin(t * ${speedX.toFixed(2)} + ${phase.toFixed(2)}) * ${ampX.toFixed(2)},
          cos(t * ${speedY.toFixed(2)} + ${phase.toFixed(2)}) * ${ampY.toFixed(2)}
        );
        vec2 diff${i} = uv - pos${i};
        float angle${i} = sin(t * ${wobbleFreq.toFixed(2)} + ${phase.toFixed(2)}) * ${wobbleAmp.toFixed(2)};
        mat2 rot${i} = mat2(cos(angle${i}), -sin(angle${i}), sin(angle${i}), cos(angle${i}));
        diff${i} = rot${i} * diff${i};
        diff${i}.y *= ${stretch.toFixed(2)};
        float dist${i} = length(diff${i});
        field += ${radius.toFixed(2)} * ${radius.toFixed(2)} / (dist${i} * dist${i} + 0.0003);
        blobShade += ${shade.toFixed(2)} / (dist${i} * dist${i} + 0.001);
      `;
    }).join('\n');

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
          float t = u_time * ${blobSpeed.toFixed(2)};
          float field = 0.0;
          float blobShade = 0.0;

          ${blobCode}

          float mask = smoothstep(1.05, 1.2, field);

          vec3 purple = vec3(0.12, 0.03, 0.25);
          vec3 orange = vec3(1.0, 0.4, 0.15);
          float radial = length(uv - vec2(0.0, -1.2));
          float glowFactor = smoothstep(2.4, 0.0, radial);
          vec3 background = mix(purple, orange, glowFactor * 0.8);

          vec3 blobColor = mix(orange, purple, (uv.y + 1.0) * 0.5);
          blobColor *= 0.6 + 0.4 * clamp(blobShade, 0.0, 1.0);

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
      mount.removeChild(canvas);
    };
  }, [blobCount, blobSpeed, blobSize]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
