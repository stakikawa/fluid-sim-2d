uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 gridSize;

void main() {
    vec2 uv = gl_FragCoord.xy / gridSize;

    vec2 x_offset = vec2(1.0 / gridSize.x, 0.0);
    vec2 y_offset = vec2(0.0, 1.0 / gridSize.y);

    float left = texture2D(pressure, uv - x_offset).x;
    float right = texture2D(pressure, uv + x_offset).x;
    float bottom = texture2D(pressure, uv - y_offset).x;
    float top = texture2D(pressure, uv + y_offset).x;

    float div = texture2D(divergence, uv).x;

    float p = (left + right + bottom + top + (-1.0 * div)) / 4.0;
    gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
}