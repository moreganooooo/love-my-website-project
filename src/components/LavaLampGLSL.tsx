import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LavaLampGLSLProps {
  glowIntensity?: number;
  blobCount?: number;
  blobSpeed?: number;
  opacity?: number;
}

export default function LavaLampGLSL({
  glowIntensity = 1.0,
  blobCount = 8,
  blobSpeed = 0.2,
  opacity = 0.5,
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

    const blobParams = Array.from({ length: blobCount }, () => ({
      ampX: Math.random() * 0.2 + 0.6,
      ampY: Math.random() * 0.4 + 0.8,
      speedX: Math.random() * 0.2 + 0.1,
      speedY: Math.random() * 0.15 + 0.1,
      radius: Math.random() * 0.1 + 0.12,
      phase: Math.random() * Math.PI * 2,
    }));

    const blobCode = blobParams.map((b, i) => `
      vec2 pos${i} = vec2(
        sin(t * ${b.speedX.toFixed(2)} + ${b.phase.toFixed(2)}) * ${b.ampX.toFixed(2)},
        mod(${b.ampY.toFixed(2)} * t * ${b.speedY.toFixed(2)} + ${b.phase.toFixed(2)}, 2.0) - 1.0);
      float dist${i} = length(uv - pos${i});
      float light${i} = 0.005 / (dist${i} * dist${i} + 0.0001);
      field += ${b.radius.toFixed(2)} * ${b.radius.toFixed(2)} / (dist${i} * dist${i} + 0.0001);
      glowAcc += light${i};
      float hover = 0.2 / (length(mouse - pos${i}) + 0.1);
      glowAcc += hover * 0.1;
    `).join("\n");

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      mouse: { value: new THREE.Vector2(0, 0) },
      u_glowIntensity: { value: glowIntensity },
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

          vec3 baseColor = vec3(0.2, 0.05, 0.3);
          vec3 glow = vec3(1.0, 0.5, 0.1);
          float glowFactor = smoothstep(1.6, 0.0, length(uv - vec2(0.0, -1.2)));
          vec3 background = mix(baseColor, glow, glowFactor * 0.9);

          vec3 purple = vec3(0.6, 0.4, 0.9);
          vec3 orange = vec3(1.0, 0.6, 0.3);
          vec3 blobColor = mix(orange, purple, uv.y * 0.5 + 0.5);

          vec3 highlight = glowAcc * vec3(1.0, 0.8, 0.6) * u_glowIntensity;
          vec3 finalColor = mix(background, blobColor, mask);
          finalColor += highlight * mask;

          float fadeIn = smoothstep(0.0, 3.0, t);
          gl_FragColor = vec4(finalColor, ${opacity.toFixed(2)} * fadeIn);
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
  }, [glowIntensity, blobCount, blobSpeed, opacity]);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}
