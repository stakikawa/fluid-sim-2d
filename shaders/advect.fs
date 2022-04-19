uniform sampler2D velocity;
uniform sampler2D advected;
uniform vec2 gridSize;
uniform float timeStep;
uniform float dissipation;

void main() {
    vec2 uv = gl_FragCoord.xy / gridSize;
    vec2 prevPos = gl_FragCoord.xy - timeStep * texture2D(velocity, uv).xy;

    vec2 grid = floor(prevPos - 0.5) + 0.5;
    vec2 gridOffset = grid + 1.0;
    vec2 diff = prevPos - grid;
    grid /= gridSize;
    gridOffset /= gridSize;

    vec2 botLeft = texture2D(advected, grid).xy;
    vec2 botRight = texture2D(advected, vec2(gridOffset.x, grid.y)).xy;
    vec2 topLeft = texture2D(advected, vec2(grid.x, gridOffset.y)).xy;
    vec2 topRight = texture2D(advected, gridOffset).xy;

    vec2 bilerp = mix(mix(botLeft, botRight, diff.x), mix(topLeft, topRight, diff.x), diff.y);

    gl_FragColor = vec4(dissipation * bilerp, 0.0, 1.0);
}