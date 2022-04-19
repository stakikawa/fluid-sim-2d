// setup
const {
  renderer, 
  camera
} = setup();

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const gridSize = new THREE.Vector2(width, height);
const source = new THREE.Vector2(1.0, 0.0);
const ink = new THREE.Vector3(0.05, 0.05, 0.05);
const radius = 0.3;
const jacobiIterations = 30;
const dissipation = 0.998;
var timeStep = 0.1;

// render target settings
const options = {
  wrapS: THREE.RepeatWrapping,
  wrapT: THREE.RepeatWrapping,
  magFilter: THREE.LinearFilter,
  minFilter: THREE.LinearFilter,
  generateMipmaps: false,
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
  depthBuffer: false,
  stencilBuffer: false
}

// slabs
var velocity = new Slab(gridSize, options);
var density = new Slab(gridSize, options);
var divergence = new Slab(gridSize, options);
var pressure = new Slab(gridSize, options);

// mouse
var mouse = new Mouse(gridSize);

// shader files 
const shaderFiles = [
  'shaders/basic.vs',
  'shaders/initVelocity.fs',
  'shaders/initDensity.fs',
  'shaders/addForce.fs',
  'shaders/addSource.fs',
  'shaders/advect.fs',
  'shaders/divergence.fs',
  'shaders/jacobi.fs',
  'shaders/gradient.fs',
  'shaders/display.fs'
];

// simulation steps
const initDensityStep = new InitDensityStep(gridSize);
const initVelocityStep = new InitVelocityStep(gridSize);
const advectVelocityStep = new AdvectVelocityStep(gridSize, timeStep);
const addForceStep = new AddForceStep(gridSize, radius);
const addSourceStep = new AddSourceStep(gridSize, radius, source);
const divergenceStep = new DivergenceStep(gridSize);
const jacobiStep = new JacobiStep(gridSize);
const pressureGradientStep = new PressureGradientStep(gridSize);
const advectDensityStep = new AdvectDensityStep(gridSize, timeStep);
const displayStep = new DisplayStep(gridSize, ink);

// initialize color and velocity
function initialize() {

  renderer.setRenderTarget(density.write);
  renderer.render(initDensityStep.scene, camera);
  density.swap();

  renderer.setRenderTarget(velocity.write);
  renderer.render(initVelocityStep.scene, camera);
  velocity.swap();
}

// update loop
function update() {

  // advect velocity
  advectVelocityStep.update({
    velocity: velocity.read.texture,
    advected: velocity.read.texture
  });
  renderer.setRenderTarget(velocity.write);
  renderer.render(advectVelocityStep.scene, camera);
  velocity.swap();

  // add forces
  var point = new THREE.Vector2();
  var force = new THREE.Vector2();

  for (var i = 0; i < mouse.motions.length; i++) {
    var motion = mouse.motions[i];

    point.set(motion.position.x, motion.position.y);
    force.set(motion.drag.x, motion.drag.y);

    addForceStep.update({
        velocity: velocity.read.texture,
        point: point,
        force: force
    });
    renderer.setRenderTarget(velocity.write);
    renderer.render(addForceStep.scene, camera);
    velocity.swap();
  }
  mouse.motions = [];

  // add sources
  if (mouse.pressed) {
    point.set(mouse.position.x, mouse.position.y);
    addSourceStep.update({
      density: density.read.texture,
      point: point
    });
    renderer.setRenderTarget(density.write);
    renderer.render(addSourceStep.scene, camera);
    density.swap();
  }

  // compute divergence
  divergenceStep.update({
    velocity: velocity.read.texture
  });
  renderer.setRenderTarget(divergence.write);
  renderer.render(divergenceStep.scene, camera);
  divergence.swap();

  // Jacobi setup
  renderer.setRenderTarget(pressure.read);
  renderer.clear();
  jacobiStep.update({
    divergence: divergence.read.texture
  });

  // Jacobi iterations
  for (let i = 0; i < jacobiIterations; i++) {
    jacobiStep.update({
      pressure: pressure.read.texture
    });
    renderer.setRenderTarget(pressure.write);
    renderer.render(jacobiStep.scene, camera);
    pressure.swap();
  }

  // subtract pressure gradient
  pressureGradientStep.update({
    velocity: velocity.read.texture,
    pressure: pressure.read.texture
  });
  renderer.setRenderTarget(velocity.write);
  renderer.render(pressureGradientStep.scene, camera);
  velocity.swap();

  // advect color
  advectDensityStep.update({
    velocity: velocity.read.texture,
    advected: density.read.texture,
    dissipation: dissipation
  });
  renderer.setRenderTarget(density.write);
  renderer.render(advectDensityStep.scene, camera);
  density.swap();
  
  // display density
  displayStep.update({
    density: density.read.texture
  });
  renderer.setRenderTarget(null);
  renderer.render(displayStep.scene, camera);

  requestAnimationFrame(update);
}

// load shaders
function loadFile(i, sources, results, callback) {
  if (i == sources.length)
    return callback(results);

  var loader = new THREE.FileLoader();
  loader.load(sources[i], function(shader) {
    results[sources[i]] = shader;
    loadFile(i+1, sources, results, callback);
  });
}

// render when shaders are loaded
loadFile(0, shaderFiles, [], function (shaders) {
  initDensityStep.material.vertexShader = shaders['shaders/basic.vs'];
  initDensityStep.material.fragmentShader = shaders['shaders/initDensity.fs'];

  initVelocityStep.material.vertexShader = shaders['shaders/basic.vs'];
  initVelocityStep.material.fragmentShader = shaders['shaders/initVelocity.fs'];

  addForceStep.material.vertexShader = shaders['shaders/basic.vs'];
  addForceStep.material.fragmentShader = shaders['shaders/addForce.fs'];

  addSourceStep.material.vertexShader = shaders['shaders/basic.vs'];
  addSourceStep.material.fragmentShader = shaders['shaders/addSource.fs'];

  advectVelocityStep.material.vertexShader = shaders['shaders/basic.vs'];
  advectVelocityStep.material.fragmentShader = shaders['shaders/advect.fs'];

  advectDensityStep.material.vertexShader = shaders['shaders/basic.vs'];
  advectDensityStep.material.fragmentShader = shaders['shaders/advect.fs'];

  divergenceStep.material.vertexShader = shaders['shaders/basic.vs'];
  divergenceStep.material.fragmentShader = shaders['shaders/divergence.fs'];

  jacobiStep.material.vertexShader = shaders['shaders/basic.vs'];
  jacobiStep.material.fragmentShader = shaders['shaders/jacobi.fs'];

  pressureGradientStep.material.vertexShader = shaders['shaders/basic.vs'];
  pressureGradientStep.material.fragmentShader = shaders['shaders/gradient.fs'];

  displayStep.material.vertexShader = shaders['shaders/basic.vs'];
  displayStep.material.fragmentShader = shaders['shaders/display.fs'];

  initialize();
  update();
});