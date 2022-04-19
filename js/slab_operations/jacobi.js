class JacobiStep {

    constructor(gridSize) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                pressure: {type: 't', value: null},
                divergence: {type: 't', value: null},
                gridSize: {type: 'v2', value: gridSize}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.pressure !== undefined) {
            this.material.uniforms.pressure.value = values.pressure;
        }
        if (values.divergence !== undefined) {
            this.material.uniforms.divergence.value = values.divergence;
        }
    }
}