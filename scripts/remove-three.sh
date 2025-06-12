#!/bin/bash

# Auto-remove Three.js and Canvas-related logic from src/

set -e

# 1. Uninstall three.js
npm uninstall three @react-three/fiber @react-three/drei || true

# 2. Search and delete lines importing Canvas or Three.js
IMPORT_PATTERNS=(
  "from 'three'"
  "from \"three\""
  "@react-three/fiber"
  "@react-three/drei"
  "Canvas"
  "WebGLRenderer"
)

echo "🔍 Removing Canvas and Three-related imports..."
for pattern in "${IMPORT_PATTERNS[@]}"; do
  grep -rl --exclude-dir=node_modules "$pattern" ./src | while read -r file; do
    echo "✂️  Cleaning: $file (matched $pattern)"
    sed -i '' "/$pattern/d" "$file"
  done
done

# 3. Remove any JSX <Canvas> elements
find ./src -name '*.tsx' -or -name '*.ts' | while read -r file; do
  sed -i '' 's/<Canvas[^>]*>//g' "$file"
  sed -i '' 's/<\/Canvas>//g' "$file"
  sed -i '' '/Canvas/d' "$file"
  sed -i '' '/WebGLRenderer/d' "$file"
  sed -i '' '/useFrame/d' "$file"
  sed -i '' '/useThree/d' "$file"
  sed -i '' '/PerspectiveCamera/d' "$file"
  sed -i '' '/OrbitControls/d' "$file"
  sed -i '' '/ambientLight/d' "$file"
  sed -i '' '/directionalLight/d' "$file"
  sed -i '' '/mesh/d' "$file"
  sed -i '' '/geometry/d' "$file"
  sed -i '' '/material/d' "$file"
  sed -i '' '/sphereBufferGeometry/d' "$file"
  sed -i '' '/meshStandardMaterial/d' "$file"
  sed -i '' '/fog/d' "$file"
  sed -i '' '/colorManagement/d' "$file"
  sed -i '' '/<Suspense/d' "$file"
  sed -i '' '/fallback/d' "$file"
  sed -i '' '/</Suspense>/d' "$file"
  sed -i '' '/<ambientLight/d' "$file"
  sed -i '' '/<directionalLight/d' "$file"
  sed -i '' '/<[Mm]esh/d' "$file"
  sed -i '' '/<[Gg]eometry/d' "$file"
  sed -i '' '/<[Mm]aterial/d' "$file"
  sed -i '' '/<[Rr]efraction/d' "$file"
  sed -i '' '/[Rr]efractionMaterial/d' "$file"
  sed -i '' '/[Uu]seGLTF/d' "$file"
  sed -i '' '/[Uu]seTexture/d' "$file"
  sed -i '' '/[Uu]seLoader/d' "$file"
  sed -i '' '/[Uu]seControls/d' "$file"
  sed -i '' '/[Uu]seRef/d' "$file"
  sed -i '' '/[Uu]seMemo/d' "$file"
  sed -i '' '/[Uu]seEffect/d' "$file"
  sed -i '' '/[Uu]seState/d' "$file"
  sed -i '' '/shaderMaterial/d' "$file"
  sed -i '' '/gl_FragColor/d' "$file"
  sed -i '' '/gl_Position/d' "$file"
  sed -i '' '/fragmentShader/d' "$file"
  sed -i '' '/vertexShader/d' "$file"
  sed -i '' '/uniforms:/d' "$file"
  sed -i '' '/vec3/d' "$file"
  sed -i '' '/float/d' "$file"
  sed -i '' '/precision/d' "$file"
  sed -i '' '/varying/d' "$file"
  sed -i '' '/void main/d' "$file"
  sed -i '' '/console\.log/d' "$file"
  sed -i '' '/skills array/d' "$file"
  sed -i '' '/WebGLRenderer/d' "$file"

done

echo "✅ Three.js and Canvas removed from project."
echo "🧼 Recommend: restart dev server and clear browser cache."
