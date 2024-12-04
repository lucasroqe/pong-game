import { Raquete } from './raquete.js'

export class Bola {
    private velocidadeX: number = 5;
    private velocidadeY: number = 5;

    constructor(
        public x: number,
        public y: number,
        public raio: number,
        private canvas: HTMLCanvasElement
    ) {}

    update() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;

        if (this.y - this.raio < 0 || this.y + this.raio > this.canvas.height) {
            this.velocidadeY = -this.velocidadeY;
        }
    }
    
    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctx.fill();
    }

    //Verificar física do jogo
    colisaoRaquete(raquete: Raquete): boolean {
        return (
            this.x - this.raio < raquete.x + raquete.width &&
            this.x + this.raio > raquete.x &&
            this.y > raquete.y &&
            this.y < raquete.y + raquete.height
        );
    }

    reverseX() {
        this.velocidadeX = -this.velocidadeX;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.velocidadeX = -this.velocidadeX;
        this.velocidadeY = Math.random() * 10 - 5;
    }
}