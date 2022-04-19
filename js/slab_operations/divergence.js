class DivergenceStep {

    constructor(gridSize) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                velocity: {type: 't', value: null},
                gridSize: {type: 'v2', value: gridSize}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.velocity !== undefined) {
            this.material.uniforms.velocity.value = values.velocity;
        }
    }
}