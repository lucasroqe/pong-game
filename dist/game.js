import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
class PongGame {
    constructor() {
        this.isRunning = false;
        this.leftScore = 0;
        this.rightScore = 0;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.leftPaddle = new Paddle(10, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.rightPaddle = new Paddle(this.canvas.width - 20, this.canvas.height / 2 - 40, 10, 80, this.canvas);
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 5, this.canvas);
        this.addEventListeners();
    }
    addEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => this.toggleGame());
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
        window.addEventListener('keyup', (e) => this.handleKeyRelease(e));
    }
    handleKeyPress(e) {
        e.preventDefault();
        switch (e.key) {
            case 'w':
                this.leftPaddle.move(-1);
                break;
            case 's':
                this.leftPaddle.move(1);
                break;
            case 'ArrowUp':
                this.rightPaddle.move(-1);
                break;
            case 'ArrowDown':
                this.rightPaddle.move(1);
                break;
        }
    }
    handleKeyRelease(e) {
        e.preventDefault();
        switch (e.key) {
            case 'w':
            case 's':
                this.leftPaddle.stop();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.rightPaddle.stop();
                break;
        }
    }
    toggleGame() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.gameLoop();
        }
    }
    gameLoop() {
        if (!this.isRunning)
            return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    update() {
        this.ball.update();
        this.leftPaddle.update();
        this.rightPaddle.update();
        if (this.ball.checkPaddleCollision(this.leftPaddle) || this.ball.checkPaddleCollision(this.rightPaddle)) {
            this.ball.reverseX();
        }
        if (this.ball.x < 0) {
            this.rightScore++;
            this.ball.reset();
        }
        else if (this.ball.x > this.canvas.width) {
            this.leftScore++;
            this.ball.reset();
        }
    }
    render() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.leftPaddle.render(this.ctx);
        this.rightPaddle.render(this.ctx);
        this.ball.render(this.ctx);
        this.renderScore();
        this.renderCenterLine();
    }
    renderScore() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(this.leftScore.toString(), this.canvas.width / 4, 50);
        this.ctx.fillText(this.rightScore.toString(), (3 * this.canvas.width) / 4, 50);
    }
    renderCenterLine() {
        this.ctx.strokeStyle = 'white';
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }
}
new PongGame();
