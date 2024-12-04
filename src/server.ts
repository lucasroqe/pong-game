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
  bolaX: number;
  bolaY: number;
  score1: number;
  score2: number;
}

let gameState: GameState = {
  raquete1Y: 250,
  raquete2Y: 250,
  bolaX: 400,
  bolaY: 300,
  score1: 0,
  score2: 0
};

let bolaVelocidadeX = 5;
let bolaVelocidadeY = 5;


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
  gameState.bolaX += bolaVelocidadeX;
  gameState.bolaY += bolaVelocidadeY;

  //Verificar colisão com as paredes
  if (gameState.bolaY <= 0 || gameState.bolaY >= 600) {
    bolaVelocidadeY = -bolaVelocidadeY;
  }

  //Verificar colisão com as raquetes
  if (gameState.bolaX <= 50 && 
      gameState.bolaY >= gameState.raquete1Y && 
      gameState.bolaY <= gameState.raquete1Y + 100) {
    bolaVelocidadeX = -bolaVelocidadeX;
  }

  //Verificar colisão com a raquete do jogador 2
  if (gameState.bolaX >= 750 && 
      gameState.bolaY >= gameState.raquete2Y && 
      gameState.bolaY <= gameState.raquete2Y + 100) {
    bolaVelocidadeX = -bolaVelocidadeX;
  }

  //Verificar se a bola saiu da tela
  if (gameState.bolaX <= 0) {
    gameState.score2++;
    gameState.bolaX = 400;
    gameState.bolaY = 300;
  }
  if (gameState.bolaX >= 800) {
    gameState.score1++;
    gameState.bolaX = 400;
    gameState.bolaY = 300;
  }

  io.emit('game-state', gameState);
}, 1000 / 60);

httpServer.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});