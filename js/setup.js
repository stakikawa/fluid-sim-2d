function setup() {
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl2");
  
    // Only continue if WebGL 2 is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL 2. Your browser or machine may not support it.");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, gl, antialias: true });

    // Set clear color to black
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0)); 
    let width = window.innerWidth;
    let height = window.innerHeight;
    const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 2;

    // On window resize update camera
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    return {
        renderer,
        camera
    };
}