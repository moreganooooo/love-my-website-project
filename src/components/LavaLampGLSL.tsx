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
  backgroundStart = '#2e003e',
  backgroundEnd = '#ff8c42',
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    mount.style.position = 'relative';
    mount.style.minHeight = '300px';
    mount.style.zIndex = '0';

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    console.log('Canvas size:', width, height);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.debug.checkShaderErrors = true;

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    mount.appendChild(canvas);

    console.log('Renderer appended:', canvas);

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

          // Radial gradient background from cranberry (bottom) to orange (outer)
          vec3 bgCranberry = vec3(0.18, 0.0, 0.24);
          vec3 bgOrange = vec3(1.0, 0.55, 0.26);
          vec2 center = vec2(0.5, 0.2);
          float distToCenter = distance(uv, center);
          vec3 bgColor = mix(bgOrange, bgCranberry, smoothstep(0.0, 1.0, distToCenter));

          float field = 0.0;

          for (int i = 0; i < 10; i++) {
            float fi = float(i);
            float speed = 0.5 + 0.3 * sin(fi + u_time * 0.5);
            float radius = 0.08 + 0.04 * sin(fi + u_time * 0.8);

            vec2 offset = vec2(
              sin(fi + u_time * 0.3 + fi * 1.2) * 0.7,
              cos(fi + u_time * 0.4 + fi * 1.5) * 0.6
            );
            vec2 blobUV = uv * 2.0 - 1.0 - offset;
            float dist = length(blobUV);
            field += radius * radius / (dist * dist + 0.001);
          }

          float mask = smoothstep(0.7, 1.2, field);

          vec3 blobStart = vec3(1.0, 0.0, 0.0);
          vec3 blobEnd = vec3(0.1, 0.0, 0.2);
          vec3 blobColor = mix(blobStart, blobEnd, uv.y);

          vec3 finalColor = mix(bgColor, blobColor, mask);
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
        width: '100%',
        height: '300px',
        position: 'relative',
        backgroundColor: 'black',
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  );
}
