// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LavaLampGLSLProps {
  glowIntensity?: number;
  blobCount?: number;
  blobSpeed?: number;
  opacity?: number;
  hoverBoost?: number;
}

export default function LavaLampGLSL({
  glowIntensity = 1.0,
  blobCount = 8,
  blobSpeed = 0.2,
  opacity = 0.5,
  hoverBoost = 0.1,
}: LavaLampGLSLProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Use alpha: false for opaque canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const mouse = new THREE.Vector2(0, 0);
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.offsetX / width) * 2.0 - 1.0;
      mouse.y = (1.0 - event.offsetY / height) * 2.0 - 1.0;
    };
    mount.addEventListener("mousemove", onMouseMove);

    const blobParams = Array.from({ length: blobCount }, (_, i) => {
      // Distribute blobs mostly on the left/right margins, with some randomness
      const margin = 0.7 + Math.random() * 0.2; // 0.7-0.9, further from center
      const side = i % 2 === 0 ? 1 : -1; // alternate left/right
      const baseX = side * margin; // -0.7 to -0.9 (left), 0.7 to 0.9 (right)
      const ampX = 0.15 + Math.random() * 0.1; // small horizontal wiggle
      const ampY = 0.7 + Math.random() * 0.3;
      const speedX = 0.2 + Math.random() * 0.2;
      const speedY = 0.5 + Math.random() * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const radius = 0.12 + Math.random() * 0.08;
      return { baseX, ampX, ampY, speedX, speedY, phase, radius };
    });

    const blobCode = blobParams.map((b, i) => `
      vec2 pos${i} = vec2(
        ${b.baseX.toFixed(2)} + sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
        mod(${b.ampY.toFixed(2)} * t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}, 2.0) - 1.0);
      float dist${i} = length(uv - pos${i});
      float light${i} = 0.005 / (dist${i} * dist${i} + 0.0001);
      field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.0001);
      glowAcc += light${i};
    `).join("\n");

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      mouse: { value: new THREE.Vector2(0, 0) },
      u_glowIntensity: { value: glowIntensity },
      u_hoverBoost: { value: hoverBoost },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: false, // Ensure the material is fully opaque
      fragmentShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 mouse;
        uniform float u_glowIntensity;
        uniform float u_hoverBoost;

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;
          float t = u_time * ${blobSpeed};

          float field = 0.0;
          float glowAcc = 0.0;

          ${blobCode}

          float threshold = 1.0;
          float edge = 0.05;
          float mask = smoothstep(threshold - edge, threshold + edge, field);

          // Hero section gradient reference:
          // from-orange-400 via-orange-500 to-purple-700
          vec3 orange1 = vec3(1.0, 0.7, 0.3); // #fdba4e
          vec3 orange2 = vec3(1.0, 0.55, 0.15); // #fb880f
          vec3 purple = vec3(0.45, 0.27, 0.67); // #a21caf
          float grad = clamp((uv.y + 1.0) / 2.0, 0.0, 1.0);
          vec3 background = mix(orange1, orange2, grad * 0.7);
          background = mix(background, purple, grad * grad);

          // Blobs: semi-transparent, blended, not bright, no internal glow
          vec3 blobColor = mix(orange2, purple, grad);
          float blobAlpha = 0.45 + 0.15 * sin(t + uv.x * 2.0);

          vec3 finalColor = mix(background, blobColor, mask * blobAlpha);

          gl_FragColor = vec4(finalColor, 1.0); // Force full opacity
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
      uniforms.mouse.value.copy(mouse);
      uniforms.u_glowIntensity.value = glowIntensity;
      uniforms.u_hoverBoost.value = hoverBoost;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      mount.removeEventListener("mousemove", onMouseMove);
    };
  }, [glowIntensity, blobCount, blobSpeed, opacity, hoverBoost]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
