precision mediump float;

uniform vec3 uSunDir;
varying vec3 vNormal;

void main() {
  float d = dot(normalize(vNormal), normalize(uSunDir));

  float light = smoothstep(-0.2, 0.4, d);

  vec3 night = vec3(0.05, 0.1, 0.3);
  vec3 day   = vec3(0.6, 0.8, 1.0);

  vec3 color = mix(night, day, light);
  gl_FragColor = vec4(color, 1.0);
}
