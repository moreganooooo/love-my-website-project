// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

// NOTE: Blob count and visual consistency must not be changed per user request.
export interface LavaLampGLSLProps {
  blobCount: number;
  blobSpeed: number;
}

export default function LavaLampGLSL(props: LavaLampGLSLProps) {
  const { blobCount = 8, blobSpeed = 0.2 } = props;
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    console.log('LavaLampGLSL mounted');

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Use alpha: false for opaque canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      const margin = 0.7 + Math.random() * 0.2;
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * margin;
      const ampX = 0.15 + Math.random() * 0.1;
      const ampY = 0.7 + Math.random() * 0.3;
      const speedX = 0.2 + Math.random() * 0.2;
      const speedY = 0.5 + Math.random() * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const radius = 0.12 + Math.random() * 0.08;
      return { baseX, ampX, ampY, speedX, speedY, phase, radius };
    });

    const blobCode = blobCount > 0
      ? blobParams.map((b, i) => `
          vec2 pos${i} = vec2(
            ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
            mod(${b.ampY.toFixed(2)} * t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}, 2.0) - 1.0);
          float dist${i} = length(uv - pos${i});
          field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.0001);
        `).join("\n")
      : "// no blobs";

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: false,
      fragmentShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${blobSpeed.toFixed(2)};

          // DEBUG: Output a solid color to verify shader is running
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red
          return;

          float field = 0.0;

          ${blobCode}

          float threshold = 1.0;
          float edge = 0.05;
          float maskBase = smoothstep(threshold - edge, threshold + edge, field);
          float fadeY = smoothstep(1.0, 0.6, uv.y);
          float mask = maskBase * fadeY;

          vec3 baseColor = vec3(0.06, 0.015, 0.18);
          vec3 glow = vec3(1.0, 0.5, 0.15);
          float glowFactor = smoothstep(2.4, -0.6, length(uv - vec2(0.0, -1.3)));
          vec3 background = mix(baseColor, glow, glowFactor);

          vec3 purple = vec3(0.65, 0.4, 0.95);
          vec3 orange = vec3(0.95, 0.4, 0.2);
          float grad = clamp((uv.y + 1.0) / 2.0, 0.0, 1.0);
          vec3 blobColor = mix(orange, purple, grad);
          float blobAlpha = 0.45 + 0.15 * sin(t + uv.x * 2.0);

          vec3 finalColor = mix(background, blobColor, mask * blobAlpha);
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
  }, [blobCount, blobSpeed]);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: -10, border: '4px solid lime', height: '100vh', width: '100vw' }} className="bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700" />;
}
