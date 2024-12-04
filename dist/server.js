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
    raquete1Y: 250,
    raquete2Y: 250,
    ballX: 400,
    ballY: 300,
    score1: 0,
    score2: 0
};
let ballSpeedX = 5;
let ballSpeedY = 5;
//Conexão para multiplayer
io.on('connection', (socket) => {
    console.log('Jogador conectado:', socket.id);
    const numJogador = io.engine.clientsCount <= 1 ? 1 : 2;
    socket.emit('numJogador', numJogador);
    socket.on('raquete-move', (raqueteY) => {
        if (numJogador === 1) {
            gameState.raquete1Y = raqueteY;
        }
        else {
            gameState.raquete2Y = raqueteY;
        }
        io.emit('game-state', gameState);
    });
    socket.on('desconectado', () => {
        console.log('Jogador desconectado:', socket.id);
    });
});
setInterval(() => {
    //Atualizar posição da bola
    gameState.ballX += ballSpeedX;
    gameState.ballY += ballSpeedY;
    //Verificar colisão com as paredes
    if (gameState.ballY <= 0 || gameState.ballY >= 600) {
        ballSpeedY = -ballSpeedY;
    }
    //Verificar colisão com as raquetes
    if (gameState.ballX <= 50 &&
        gameState.ballY >= gameState.raquete1Y &&
        gameState.ballY <= gameState.raquete1Y + 100) {
        ballSpeedX = -ballSpeedX;
    }
    //Verificar colisão com a raquete do jogador 2
    if (gameState.ballX >= 750 &&
        gameState.ballY >= gameState.raquete2Y &&
        gameState.ballY <= gameState.raquete2Y + 100) {
        ballSpeedX = -ballSpeedX;
    }
    //Verificar se a bola saiu da tela
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
