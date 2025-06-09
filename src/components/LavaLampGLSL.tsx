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
          vec2 centeredUv = uv * 2.0 - 1.0;

          float dist = length(centeredUv);
          float pulse = 0.1 + 0.05 * sin(u_time * 2.0);
          float blob = smoothstep(pulse, 0.0, dist);

          vec3 color = mix(vec3(0.1, 0.0, 0.2), vec3(1.0, 0.0, 0.0), blob);
          gl_FragColor = vec4(color, 1.0);
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
