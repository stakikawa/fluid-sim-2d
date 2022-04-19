uniform sampler2D velocity;
uniform sampler2D pressure;
uniform vec2 gridSize;

void main() {
    vec2 uv = gl_FragCoord.xy / gridSize;

    vec2 x_offset = vec2(1.0 / gridSize.x, 0.0);
    vec2 y_offset = vec2(0.0, 1.0 / gridSize.y);

    float left = texture2D(pressure, uv - x_offset).x;
    float right = texture2D(pressure, uv + x_offset).x;
    float bottom = texture2D(pressure, uv - y_offset).x;
    float top = texture2D(pressure, uv + y_offset).x;

    vec2 gradient = 0.5 * vec2(right - left, top - bottom);
    vec2 v = texture2D(velocity, uv).xy;
    gl_FragColor = vec4(v - gradient, 0.0, 1.0);
}