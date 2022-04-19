uniform sampler2D density;
uniform vec3 color;
uniform vec2 gridSize;

in vec2 texCoord;

void main() {
    gl_FragColor = vec4(color * texture2D(density, gl_FragCoord.xy / gridSize).x, 1.0);
}