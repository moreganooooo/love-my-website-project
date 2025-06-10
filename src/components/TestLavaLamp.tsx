import { MeshBasicMaterial } from 'three';

return (
  <mesh>
    <planeGeometry args={[1, 1]} />
    {/* <lavaLampMaterial ref={ref} /> */}
    <meshBasicMaterial color="hotpink" />
  </mesh>
);
