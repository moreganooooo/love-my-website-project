// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from 'react';
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
  backgroundStart = '#110224',
  backgroundEnd = '#f9b890',
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    console.log('Canvas size:', width, height);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.debug.checkShaderErrors = true;
    mount.appendChild(renderer.domElement);

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
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // RED
        }
      `,
      depthTest: false,
      depthWrite: false,
      transparent: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add test geometry to verify rendering
    const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const testGeo = new THREE.PlaneGeometry(1, 1);
    const testMesh = new THREE.Mesh(testGeo, testMaterial);
    testMesh.position.set(0, 0, 0);
    // scene.add(testMesh); // optional debug

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

  return <div ref={mountRef} className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }} />;
}
