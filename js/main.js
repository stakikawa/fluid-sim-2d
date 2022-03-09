const {
  renderer, 
  scene, 
  camera
} = setup();

function update() {
    requestAnimationFrame(update)
    renderer.render(scene, camera);
}

update();