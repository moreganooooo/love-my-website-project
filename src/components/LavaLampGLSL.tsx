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

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;

          vec3 bgCranberry = vec3(0.18, 0.0, 0.24);
          vec3 bgOrange = vec3(1.0, 0.55, 0.26);
          vec2 center = vec2(0.5, 0.2);
          float distToCenter = distance(uv, center);
          vec3 bgColor = mix(bgOrange, bgCranberry, smoothstep(0.0, 1.0, distToCenter));

          float field = 0.0;

          for (int i = 0; i < 10; i++) {
            float fi = float(i);
            float phase = fi * 1.2;

            float side = mod(fi, 2.0) * 2.0 - 1.0;
            float x = 0.1 + 0.8 * step(0.0, side) + 0.01 * sin(u_time * 0.15 + phase);
            float y = mod(0.05 * sin(u_time * 0.1 + phase) + u_time * 0.07 * (0.5 + 0.5 * sin(phase)), 1.2);
            vec2 pos = vec2(x, y);

            vec2 delta = uv - pos;
            float dist = length(delta);
            float radius = 0.07 + 0.03 * sin(u_time + fi * 0.5);
            field += radius * radius / (dist * dist + 0.0005);
          }

          float mask = smoothstep(0.6, 1.3, field);
          float softEdge = smoothstep(0.85, 1.1, field);

          vec3 blobStart = vec3(0.43, 0.15, 0.38);
          vec3 blobEnd = vec3(0.69, 0.36, 0.41);
          vec3 blobColor = mix(blobStart, blobEnd, uv.y);

          vec3 blended = mix(bgColor, blobColor, mask);
          vec3 finalColor = mix(blended, blobColor, softEdge * 0.08);

          if (uv.y > 1.0) discard;

          gl_FragColor = vec4(finalColor, 1.0);
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
