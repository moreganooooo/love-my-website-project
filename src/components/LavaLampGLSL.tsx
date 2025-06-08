// src/components/LavaLampGLSL.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LavaLampGLSL() {
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

    const BLOB_COUNT = Math.floor(Math.random() * 4) + 3;
    const blobParams = Array.from({ length: BLOB_COUNT }, (_, i) => {
      return {
        ampX: Math.random() * 0.5 + 0.8, // less center
        ampY: Math.random() * 0.2 + 0.5, // mostly upward
        speedX: Math.random() * 0.5 + 0.2,
        speedY: Math.random() * 0.3 + 0.15,
        radius: Math.random() * 0.12 + 0.13,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const blobCode = blobParams
      .map((b, i) => {
        return `field += blob(uv, vec2(
          sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
          mod(${b.ampY.toFixed(2)} * t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}, 2.0) - 1.0),
          ${b.radius.toFixed(2)});`;
      })
      .join("\n");

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;

        float blob(vec2 uv, vec2 pos, float radius) {
          float d = length(uv - pos);
          return radius * radius / (d * d + 0.0001);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;

          float t = u_time * 0.3;
          float field = 0.0;

          ${blobCode}

          float threshold = 1.0;
          float edge = 0.05;
          float mask = smoothstep(threshold - edge, threshold + edge, field);

          vec3 baseColor = vec3(0.15, 0.0, 0.25); // brighter purple
          vec3 glow = vec3(1.0, 0.4, 0.1); // softer orange
          float glowFactor = smoothstep(0.9, 0.0, length(uv - vec2(0.0, -0.9)));
          vec3 background = mix(baseColor, glow, glowFactor * 0.8);

          vec3 blobColor = mix(vec3(1.0, 0.5, 0.2), vec3(0.95, 0.4, 0.6), uv.y * 0.5 + 0.5);
          vec3 finalColor = mix(background, blobColor, mask);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const clock = new THREE.Clock();

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
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
