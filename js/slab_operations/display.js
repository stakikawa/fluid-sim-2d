class DisplayStep {

    constructor(gridSize, ink) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                gridSize: {type: 'v2', value: gridSize},
                density: {type: 't', value: null},
                color: {type: 'v3', value: ink}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.density !== undefined) {
            this.material.uniforms.density.value = values.density;
        }
        if (values.ink !== undefined) {
            this.material.uniforms.color.value = values.ink;
        }
    }
}