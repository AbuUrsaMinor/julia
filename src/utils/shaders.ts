// Julia Set Fragment Shader
export const juliaFragmentShader = `
  uniform vec2 c;
  uniform float maxIterations;
  uniform vec3 colorA;
  uniform vec3 colorB;
  
  varying vec2 vUv;
  varying float vHeight;
  varying vec3 vNormal;
    void main() {    // Normalize height for color interpolation
    float t = clamp(vHeight / maxIterations, 0.0, 1.0);
    
    // Create more interesting color variation
    float colorT = pow(t, 0.5); // Square root for better mid-tone distribution
    vec3 color = mix(colorA, colorB, colorT);
    
    // Enhanced lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    float light = dot(normalize(vNormal), lightDir);
    light = 0.6 + 0.4 * light; // Increase ambient light for better visibility
    
    gl_FragColor = vec4(color * light, 1.0);
  }
`;

// Compute Shader for Julia and Mandelbrot Sets
export const computeHeightShader = `
  uniform vec2 c;
  uniform float maxIterations;
  uniform bool isMandelbrot;
  
  vec2 sqr(vec2 z) {
    return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
  }
  
  float computeHeight(vec2 coord) {
    vec2 z;
    vec2 c_val;
    
    if (isMandelbrot) {
      z = vec2(0.0, 0.0);
      c_val = vec2(
        3.0 * (coord.x - 0.5),
        3.0 * (coord.y - 0.5)
      );
    } else {
      z = vec2(
        4.0 * (coord.x - 0.5),
        4.0 * (coord.y - 0.5)
      );
      c_val = c;
    }
      float n = 0.0;
    
    for(float i = 0.0; i < 100.0; i++) {
      z = sqr(z) + c_val;
      if(dot(z, z) > 4.0) break;
      n++;
      if(n >= maxIterations) break;
    }

    if (n < maxIterations) {
      // Smooth iteration count for points that escaped
      float smoothN = n - log2(log2(dot(z, z))) + 4.0;
      // Better distribution using log mapping
      return log(smoothN + 1.0) * 20.0;
    } else {
      // Points in the set
      return maxIterations;
    }
  }
`;

// Vertex Shader
export const vertexShader = `
  ${computeHeightShader}
  
  varying vec2 vUv;
  varying float vHeight;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    
    // Compute height based on Julia set
    float height = computeHeight(uv);
    vHeight = height;    // Create position with depth based on iterations
    vec3 pos = position;
    float depth = -height / maxIterations; // Negative value to make high iteration counts go deeper
    pos.z = depth * 2.0; // Scale for better visibility
      // Compute normals for lighting
    float eps = 0.01;
    float dL = -computeHeight(vec2(uv.x - eps, uv.y)) / maxIterations;
    float dR = -computeHeight(vec2(uv.x + eps, uv.y)) / maxIterations;
    float dD = -computeHeight(vec2(uv.x, uv.y - eps)) / maxIterations;
    float dU = -computeHeight(vec2(uv.x, uv.y + eps)) / maxIterations;
      vec3 normal = normalize(vec3(
      (dL - dR) / (2.0 * eps),
      (dD - dU) / (2.0 * eps),
      1.0
    ));
    
    vNormal = normalMatrix * normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
