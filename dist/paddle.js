export class Paddle {
    constructor(x, y, width, height, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.speed = 0;
        this.moveSpeed = 5;
    }
    move(direction) {
        this.speed = direction * this.moveSpeed;
    }
    stop() {
        this.speed = 0;
    }
    update() {
        this.y += this.speed;
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.height));
    }
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
