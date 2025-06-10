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
      u_blobColorStart: { value: new THREE.Color(blobColorStart) },
      u_blobColorEnd: { value: new THREE.Color(blobColorEnd) },
      u_backgroundStart: { value: new THREE.Color(backgroundStart) },
      u_backgroundEnd: { value: new THREE.Color(backgroundEnd) },
      u_blobSize: { value: blobSize },
    };

    const blobSnippets: string[] = [];

    for (let i = 0; i < blobCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const baseX = side * 0.8;
      const ampX = 0.15;
      const speedX = 0.3 + Math.random() * 0.25;
      const speedY = 0.7 + Math.random() * 0.5;
      const phase = (i / blobCount) * Math.PI * 2;
      const radiusBase = 0.06 + Math.random() * 0.14;
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

          float radius = ${radiusBase.toFixed(2)} * u_blobSize;
          
          // More realistic 3D shading
          float lightAngle = atan(diff.y, diff.x) + t * 0.1;
          float lightIntensity = 0.5 + 0.5 * sin(lightAngle);
          float highlight = exp(-dist * 25.0) * lightIntensity;
          float midtone = exp(-dist * 8.0);
          float shadow = smoothstep(0.15, 0.05, dist) * (1.0 - lightIntensity * 0.3);
          
          // Combine lighting for 3D effect
          float lighting = highlight * 0.8 + midtone * 0.6 + shadow * 0.4;
          
          field += radius * radius / (dist * dist + 0.0002);
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
        uniform vec3 u_blobColorStart;
        uniform vec3 u_blobColorEnd;
        uniform vec3 u_backgroundStart;
        uniform vec3 u_backgroundEnd;
        uniform float u_blobSize;

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${blobSpeed.toFixed(2)};

          float field = 0.0;
          float blobShade = 0.0;

          ${blobSnippets.join('\n')}

          // More defined edges with less blur
          float mask = smoothstep(0.8, 1.2, field);

          // Colors supplied via uniforms
          vec3 bgStart = u_backgroundStart;
          vec3 bgEnd = u_backgroundEnd;
          vec3 blobStart = u_blobColorStart;
          vec3 blobEnd = u_blobColorEnd;
          
          // Create a more sophisticated background gradient - FULL BRIGHTNESS
          float radial = length(uv - vec2(0.0, -1.0));
          float verticalGrad = (uv.y + 1.0) * 0.5;
          float glowFactor = smoothstep(2.2, 0.0, radial);
          
          vec3 background = mix(bgStart, bgEnd, glowFactor * 0.7);
          background = mix(background, blobEnd, verticalGrad * 0.3 * glowFactor);

          // Enhanced blob colors with better 3D appearance
          vec3 blobBase = mix(blobStart, blobEnd, (uv.y + 1.0) * 0.4);
          vec3 blobHighlight = mix(blobBase, vec3(1.0, 0.8, 0.6), 0.3);
          vec3 blobColor = mix(blobBase, blobHighlight, clamp(blobShade * 0.8, 0.0, 1.0));

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
    let previousTime = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      previousTime = elapsed;

      uniforms.u_time.value = elapsed;
      renderer.render(scene, camera);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        previousTime = clock.getElapsedTime();
        renderer.setAnimationLoop(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      document.removeEventListener('visibilitychange', handleVisibility);
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
        willChange: 'transform',
      }}
    />
  );
}
