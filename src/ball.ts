import { Paddle } from './paddle.js';

export class Ball {
    private speedX: number = 5;
    private speedY: number = 5;

    constructor(
        public x: number,
        public y: number,
        public radius: number,
        private canvas: HTMLCanvasElement
    ) {}

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    checkPaddleCollision(paddle: Paddle): boolean {
        return (
            this.x - this.radius < paddle.x + paddle.width &&
            this.x + this.radius > paddle.x &&
            this.y > paddle.y &&
            this.y < paddle.y + paddle.height
        );
    }

    reverseX() {
        this.speedX = -this.speedX;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.speedX = -this.speedX;
        this.speedY = Math.random() * 10 - 5;
    }
}