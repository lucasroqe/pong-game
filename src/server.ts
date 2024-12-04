import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));

interface GameState {
  raquete1Y: number;
  raquete2Y: number;
  ballX: number;
  ballY: number;
  score1: number;
  score2: number;
}

let gameState: GameState = {
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

  socket.on('raquete-move', (raqueteY: number) => {
    if (numJogador === 1) {
      gameState.raquete1Y = raqueteY;
    } else {
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