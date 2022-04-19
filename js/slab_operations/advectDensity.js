class AdvectDensityStep {

    constructor(gridSize, timeStep) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                advected: {type: 't', value: null},
                velocity: {type: 't', value: null},
                timeStep: {type: 'f', value: timeStep},
                dissipation: {type: 'f', value: 1.0},
                gridSize: {type: 'v2', value: gridSize}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.advected !== undefined) {
            this.material.uniforms.advected.value = values.advected;
        }
        if (values.velocity !== undefined) {
            this.material.uniforms.velocity.value = values.velocity;
        }
        if (values.dissipation !== undefined) {
            this.material.uniforms.dissipation.value = values.dissipation;
        }
    }
}