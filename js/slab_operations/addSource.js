class AddSourceStep {

    constructor(gridSize, radius, source) {
        this.scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(gridSize.x, gridSize.y);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                density: {type: 't', value: null},
                gridSize: {type: 'v2', value: gridSize},
                source: {type: 'v2', value: source},
                point: {type: 'v2', value: null},
                radius: {type: 'f', value: radius}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    update(values) {
        if (values.density !== undefined) {
            this.material.uniforms.density.value = values.density;
        }
        if (values.point !== undefined) {
            this.material.uniforms.point.value = values.point;
        }
        if (values.radius !== undefined) {
            this.material.uniforms.radius.value = values.radius;
        }
    }
}