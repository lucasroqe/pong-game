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
  paddle1Y: number;
  paddle2Y: number;
  ballX: number;
  ballY: number;
  score1: number;
  score2: number;
}

let gameState: GameState = {
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

  socket.on('paddle-move', (paddleY: number) => {
    if (playerNumber === 1) {
      gameState.paddle1Y = paddleY;
    } else {
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
