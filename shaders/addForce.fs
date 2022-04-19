uniform sampler2D velocity;
uniform vec2 gridSize;
uniform vec2 point;
uniform vec2 force;
uniform float radius;

float gaussian_splat(vec2 p, float r) {
    return exp(-dot(p, p) / r);
}

void main() {
    vec2 uv = gl_FragCoord.xy / gridSize;
    vec2 base = texture2D(velocity, uv).xy;
    vec2 offset = point - gl_FragCoord.xy;
    vec2 splat = force * gaussian_splat(offset, radius * gridSize.x);
    gl_FragColor = vec4(base + splat, 0.0, 1.0);
}