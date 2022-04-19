class Slab {

    constructor(gridSize, options) {
        this.read = new THREE.WebGLRenderTarget(gridSize.x, gridSize.y, options);
        this.write = new THREE.WebGLRenderTarget(gridSize.x, gridSize.y, options);
    }

    swap() {
        var tmp = this.read;
        this.read = this.write;
        this.write = tmp;
    }
}