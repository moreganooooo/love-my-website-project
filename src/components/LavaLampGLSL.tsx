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
  blobCount = 24,
  blobSpeed = 0.1,
  blobSize = 0.1,
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

    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        float random(float x) {
          return fract(sin(x) * 43758.5453);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;

          vec3 bgStart = vec3(0.18, 0.0, 0.24);
          vec3 bgEnd = vec3(1.0, 0.55, 0.26);
          vec2 center = vec2(0.5, 0.2);
          float distToCenter = distance(uv, center);
          vec3 bgColor = mix(bgEnd, bgStart, smoothstep(0.0, 1.0, distToCenter));

          float field = 0.0;

          for (int i = 0; i < 24; i++) {
            float fi = float(i);
            float phase = fi * 1.2;
            float side = mod(fi, 2.0) * 2.0 - 1.0;
            float baseX = mix(0.05, 0.25, random(fi)) + 0.7 * step(0.0, side);
            float y = mod(u_time * 0.05 * (0.8 + 0.2 * sin(phase)), 1.2);
            vec2 pos = vec2(baseX, y);

            vec2 delta = uv - pos;
            float dist = length(delta);
            float radius = 0.05;
            field += radius / (dist * 12.0 + 0.005);
          }

          float mask = smoothstep(0.96, 1.0, field);

          vec3 blobColor = mix(vec3(0.43, 0.15, 0.38), vec3(0.69, 0.36, 0.41), uv.y);
          vec3 finalColor = mix(bgColor, blobColor, mask);

          float fadeTop = smoothstep(1.0, 0.95, uv.y);
          float fadeBottom = smoothstep(0.0, 0.05, uv.y);
          float alpha = fadeTop * fadeBottom;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      depthTest: false,
      depthWrite: false,
      transparent: true,
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
