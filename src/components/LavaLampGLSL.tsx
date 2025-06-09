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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
      const angle = (i / blobCount) * Math.PI * 2;
      return {
        speedX: 0.7 + Math.random() * 0.6,
        speedY: 0.5 + Math.random() * 0.7,
        ampX: 0.5 + Math.random() * 0.4,
        ampY: 0.7 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        radius: 0.12 + Math.random() * 0.08,
      };
    });

    const blobCode = blobParams.map((b, i) => `
      vec2 pos${i} = vec2(
        sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)} + sign(sin(${b.phase.toFixed(2)})) * 0.3,
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
      transparent: true,
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

          vec3 baseColor = vec3(0.06, 0.015, 0.18); // moodier purple
          vec3 glow = vec3(1.0, 0.5, 0.15);         // stronger orange glow
          float glowFactor = smoothstep(2.4, -0.6, length(uv - vec2(0.0, -1.3)));
          vec3 background = mix(baseColor, glow, glowFactor);

          vec3 purple = vec3(0.65, 0.4, 0.95);
          vec3 orange = vec3(0.95, 0.4, 0.2);
          vec3 blobColor = mix(orange, purple, clamp((uv.y + 1.0) / 2.0, 0.0, 1.0));

          vec3 highlight = glowAcc * vec3(1.0, 0.8, 0.6) * u_glowIntensity;
          vec3 finalColor = mix(background, blobColor, mask);
          finalColor += highlight * mask;

          float fadeIn = smoothstep(0.0, 3.0, t);
          gl_FragColor = vec4(finalColor * mask + background * (1.0 - mask), ${opacity.toFixed(2)} * fadeIn);
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
