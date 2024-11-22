export class Paddle {
    private speed: number = 0;
    private readonly moveSpeed: number = 5;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        private canvas: HTMLCanvasElement
    ) {}

    move(direction: number) {
        this.speed = direction * this.moveSpeed;
    }

    stop() {
        this.speed = 0;
    }

    update() {
        this.y += this.speed;
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.height));
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}