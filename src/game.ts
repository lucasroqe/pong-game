import { Raquete } from './raquete.js'
import { Bola } from './bola.js'

class PongGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private leftPaddle: Raquete;
    private rightPaddle: Raquete;
    private bola: Bola;
    private isRunning: boolean = false;
    private leftScore: number = 0;
    private rightScore: number = 0;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.canvas.width = 800;
        this.canvas.height = 400;

        this.leftPaddle = new Raquete(10, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.rightPaddle = new Raquete(this.canvas.width - 20, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.bola = new Bola(this.canvas.width / 2, this.canvas.height / 2, 5, this.canvas);

        this.addEventListeners();
    }

    private addEventListeners() {
        document.getElementById('startButton')!.addEventListener('click', () => this.toggleGame());
    }

    private toggleGame() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.gameLoop();
        }
    }

    private gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        this.bola.update();
        this.leftPaddle.update();
        this.rightPaddle.update();

        if (this.bola.colisaoRaquete(this.leftPaddle) || this.bola.colisaoRaquete(this.rightPaddle)) {
            this.bola.reverseX();
        }

        if (this.bola.x < 0) {
            this.rightScore++;
            this.bola.reset();
        } else if (this.bola.x > this.canvas.width) {
            this.leftScore++;
            this.bola.reset();
        }
    }

    private render() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.leftPaddle.render(this.ctx);
        this.rightPaddle.render(this.ctx);
        this.bola.render(this.ctx);

        this.renderScore();
        this.renderCenterLine();
    }

    private renderScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(this.leftScore.toString(), this.canvas.width / 4, 50);
        this.ctx.fillText(this.rightScore.toString(), (3 * this.canvas.width) / 4, 50);
    }

    private renderCenterLine() {
        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }
}

new PongGame();