import { Raquete } from './raquete.js'
import { Bola } from './bola.js'

class PongGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private raqueteEsquerda: Raquete;
    private raqueteDireita: Raquete;
    private bola: Bola;
    private rodando: boolean = false;
    private pontuacaoEsquerda: number = 0;
    private pontuacaoDireita: number = 0;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        this.canvas.width = 800;
        this.canvas.height = 400;

        this.raqueteEsquerda = new Raquete(10, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.raqueteDireita = new Raquete(this.canvas.width - 20, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.bola = new Bola(this.canvas.width / 2, this.canvas.height / 2, 5, this.canvas);

        this.addEventListeners();
    }

    private addEventListeners() {
        document.getElementById('startButton')!.addEventListener('click', () => this.toggleGame());
    }

    //Função para iniciar e parar o jogo
    private toggleGame() {
        this.rodando = !this.rodando;
        if (this.rodando) {
            this.gameLoop();
        }
    }
    private gameLoop() {
        if (!this.rodando) return;

        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    private update() {
        this.bola.update();
        this.raqueteEsquerda.update();
        this.raqueteDireita.update();

        if (this.bola.colisaoRaquete(this.raqueteEsquerda) || this.bola.colisaoRaquete(this.raqueteDireita)) {
            this.bola.reverseX();
        }

        if (this.bola.x < 0) {
            this.pontuacaoDireita++;
            this.bola.reset();
        } else if (this.bola.x > this.canvas.width) {
            this.pontuacaoEsquerda++;
            this.bola.reset();
        }
    }

    private render() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.raqueteEsquerda.render(this.ctx);
        this.raqueteDireita.render(this.ctx);
        this.bola.render(this.ctx);

        this.renderPontuacao();

    }

    private renderPontuacao() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(this.pontuacaoEsquerda.toString(), this.canvas.width / 4, 50);
        this.ctx.fillText(this.pontuacaoDireita.toString(), (3 * this.canvas.width) / 4, 50);
    }
}

new PongGame();