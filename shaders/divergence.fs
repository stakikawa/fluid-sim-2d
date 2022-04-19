uniform sampler2D velocity;
uniform vec2 gridSize;

void main() {
    vec2 uv = gl_FragCoord.xy / gridSize;

    vec2 x_offset = vec2(1.0 / gridSize.x, 0.0);
    vec2 y_offset = vec2(0.0, 1.0 / gridSize.y);

    float left = texture2D(velocity, uv - x_offset).x;
    float right = texture2D(velocity, uv + x_offset).x;
    float bottom = texture2D(velocity, uv - y_offset).y;
    float top = texture2D(velocity, uv + y_offset).y;

    float divergence = (right - left + top - bottom);
    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
}
