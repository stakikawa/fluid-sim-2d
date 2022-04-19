class Mouse {
    
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.position = new THREE.Vector2();
        this.pressed = false;
        this.motions = [];

        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }

    mouseDown(event) {
        this.position.set(event.clientX, this.gridSize.y - event.clientY);
        this.pressed = true;
    }

    mouseUp(event) {
        event.preventDefault();
        this.pressed = false;
    }

    mouseMove(event) {
        event.preventDefault();

        var x = event.clientX;
        var y = this.gridSize.y - event.clientY;

        if (this.pressed) {

            var dx = x - this.position.x;
            var dy = y - this.position.y;

            var drag = {
                x: dx,
                y: dy
            };

            var position = {
                x: x,
                y: y
            };

            this.motions.push({
                drag: drag,
                position: position
            });
        }

        this.position.set(x, y);
    }
}