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
  blobCount = 40,
  blobSpeed = 0.6,
  blobSize = 0.14,
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
    renderer.setPixelRatio(window.devicePixelRatio);
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

    const handleResize = () => {
      const newWidth = mount.offsetWidth;
      const newHeight = mount.offsetHeight;
      renderer.setSize(newWidth, newHeight);
      uniforms.u_resolution.value.set(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    const blobSnippets: string[] = [];

    for (let i = 0; i < blobCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * 0.8;
      const ampX = 0.15;
      const ampY = 1.4;
      const speedX = 0.3 + Math.random() * 0.25;
      const speedY = 0.7 + Math.random() * 0.5;
      const phase = (i / blobCount) * Math.PI * 2;
      const radius = 0.06 + Math.random() * 0.14;
      const stretch = 0.85 + Math.random() * 0.3;
      const wobbleFreq = 1.0 + Math.random();
      const wobbleAmp = 0.02 + Math.random() * 0.03;
      const shade = 0.3 + Math.random() * 0.7;

      blobSnippets.push(`
        {
          vec2 pos = vec2(
            ${baseX.toFixed(2)} + sin(t * ${speedX.toFixed(2)} + ${phase.toFixed(2)}) * ${ampX.toFixed(2)},
            mod(t * ${speedY.toFixed(2)} + ${phase.toFixed(2)}, 2.5) - 1.25
          );
          vec2 diff = uv - pos;
          float angle = sin(t * ${wobbleFreq.toFixed(2)} + ${phase.toFixed(2)}) * ${wobbleAmp.toFixed(2)};
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          diff = rot * diff;
          diff.y *= ${stretch.toFixed(2)};
          float dist = length(diff);
          
          // More realistic 3D shading
          float lightAngle = atan(diff.y, diff.x) + t * 0.1;
          float lightIntensity = 0.5 + 0.5 * sin(lightAngle);
          float highlight = exp(-dist * 25.0) * lightIntensity;
          float midtone = exp(-dist * 8.0);
          float shadow = smoothstep(0.15, 0.05, dist) * (1.0 - lightIntensity * 0.3);
          
          // Combine lighting for 3D effect
          float lighting = highlight * 0.8 + midtone * 0.6 + shadow * 0.4;
          
          field += ${radius.toFixed(2)} * ${radius.toFixed(2)} / (dist * dist + 0.0002);
          blobShade += ${shade.toFixed(2)} * lighting / (dist * dist + 0.002);
        }
      `);
    }

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

          ${blobSnippets.join('\n')}

          // More defined edges with less blur
          float mask = smoothstep(0.8, 1.2, field);

          // Enhanced sunset colors - BRIGHT background
          vec3 deepPurple = vec3(0.08, 0.02, 0.20);
          vec3 warmOrange = vec3(1.0, 0.5, 0.2);
          vec3 softPink = vec3(0.9, 0.4, 0.5);
          
          // Create a more sophisticated background gradient - FULL BRIGHTNESS
          float radial = length(uv - vec2(0.0, -1.0));
          float verticalGrad = (uv.y + 1.0) * 0.5;
          float glowFactor = smoothstep(2.2, 0.0, radial);
          
          vec3 background = mix(deepPurple, warmOrange, glowFactor * 0.7);
          background = mix(background, softPink, verticalGrad * 0.3 * glowFactor);

          // Enhanced blob colors with better 3D appearance
          vec3 blobBase = mix(warmOrange, softPink, (uv.y + 1.0) * 0.4);
          vec3 blobHighlight = mix(blobBase, vec3(1.0, 0.8, 0.6), 0.3);
          vec3 blobColor = mix(blobBase, blobHighlight, clamp(blobShade * 0.8, 0.0, 1.0));

          // CRITICAL FIX: Use pure background where mask is 0, only blend blobs with reduced opacity
          vec3 finalColor = background;
          if (mask > 0.0) {
            finalColor = mix(background, blobColor, mask * 0.75);
          }
          
          // Full opacity for the complete background
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      uniforms.u_time.value = elapsed;
      renderer.render(scene, camera);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
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
        willChange: 'transform',
      }}
    />
  );
}
