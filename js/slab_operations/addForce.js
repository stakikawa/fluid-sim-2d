class AddForceStep {

    constructor(gridSize, radius) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                velocity: {type: 't', value: null},
                gridSize: {type: 'v2', value: gridSize},
                point: {type: 'v2', value: null},
                force: {type: 'v2', value: null},
                radius: {type: 'f', value: radius}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.velocity !== undefined) {
            this.material.uniforms.velocity.value = values.velocity;
        }
        if (values.point !== undefined) {
            this.material.uniforms.point.value = values.point;
        }
        if (values.force !== undefined) {
            this.material.uniforms.force.value = values.force;
        }
    }
}