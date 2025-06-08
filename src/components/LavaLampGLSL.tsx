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

    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0.1, 10
    );
    camera.position.z = 1;

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
          return radius * radius / distance(uv, pos);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv = uv * 2.0 - 1.0;

          float t = u_time * 0.5;
          float field = 0.0;

          field += blob(uv, vec2(sin(t * 0.9) * 0.5, cos(t * 0.7) * 0.4), 0.25);
          field += blob(uv, vec2(cos(t * 1.3) * 0.4, sin(t * 0.8) * 0.5), 0.2);
          field += blob(uv, vec2(sin(t * 1.1) * 0.6, cos(t * 1.2) * 0.3), 0.23);

          float threshold = 0.3;
          float alpha = smoothstep(threshold - 0.02, threshold + 0.02, field);

          vec3 color = mix(vec3(1.0, 0.36, 0.0), vec3(1.0, 0.0, 0.66), uv.y * 0.5 + 0.5);

          gl_FragColor = vec4(color, alpha);
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