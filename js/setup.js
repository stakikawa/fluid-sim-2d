function setup() {
    const canvas = document.getElementById("glcanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");
  
    // Only continue if WebGL 2 is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL 2. Your browser or machine may not support it.");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, gl, antialias: true });

    // Set clear color to black
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0)); 

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1 );
    scene.add(camera);

    // On window resize update camera
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    return {
        renderer,
        scene,
        camera
    };
}