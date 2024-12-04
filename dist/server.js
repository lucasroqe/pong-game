"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
const PORT = 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
let gameState = {
    paddle1Y: 250,
    paddle2Y: 250,
    ballX: 400,
    ballY: 300,
    score1: 0,
    score2: 0
};
let ballSpeedX = 5;
let ballSpeedY = 5;
io.on('connection', (socket) => {
    console.log('Jogador conectado:', socket.id);
    const playerNumber = io.engine.clientsCount <= 1 ? 1 : 2;
    socket.emit('player-number', playerNumber);
    socket.on('paddle-move', (paddleY) => {
        if (playerNumber === 1) {
            gameState.paddle1Y = paddleY;
        }
        else {
            gameState.paddle2Y = paddleY;
        }
        io.emit('game-state', gameState);
    });
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});
setInterval(() => {
    gameState.ballX += ballSpeedX;
    gameState.ballY += ballSpeedY;
    if (gameState.ballY <= 0 || gameState.ballY >= 600) {
        ballSpeedY = -ballSpeedY;
    }
    if (gameState.ballX <= 50 &&
        gameState.ballY >= gameState.paddle1Y &&
        gameState.ballY <= gameState.paddle1Y + 100) {
        ballSpeedX = -ballSpeedX;
    }
    if (gameState.ballX >= 750 &&
        gameState.ballY >= gameState.paddle2Y &&
        gameState.ballY <= gameState.paddle2Y + 100) {
        ballSpeedX = -ballSpeedX;
    }
    if (gameState.ballX <= 0) {
        gameState.score2++;
        gameState.ballX = 400;
        gameState.ballY = 300;
    }
    if (gameState.ballX >= 800) {
        gameState.score1++;
        gameState.ballX = 400;
        gameState.ballY = 300;
    }
    io.emit('game-state', gameState);
}, 1000 / 60);
httpServer.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});
