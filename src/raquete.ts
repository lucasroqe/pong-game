export class Raquete {
    private velocidade: number = 0;
    private readonly moveVelocidade: number = 5;

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        private canvas: HTMLCanvasElement
    ) {}

    move(direction: number) {
        this.velocidade = direction * this.moveVelocidade;
    }

    stop() {
        this.velocidade = 0;
    }

    update() {
        this.y += this.velocidade;
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - this.height));
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}