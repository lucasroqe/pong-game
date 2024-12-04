declare const io: any;

const socket = io();

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let playerNumber = 0;
let paddle1Y = 250;
let paddle2Y = 250;
let ballX = 400;
let ballY = 300;
let score1 = 0;
let score2 = 0;

socket.on('player-number', (number: number) => {
  playerNumber = number;
  console.log(`You are player ${playerNumber}`);
});

socket.on('game-state', (gameState: any) => {
  paddle1Y = gameState.paddle1Y;
  paddle2Y = gameState.paddle2Y;
  ballX = gameState.ballX;
  ballY = gameState.ballY;
  score1 = gameState.score1;
  score2 = gameState.score2;
});

function handleMouseMove(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  
  if (playerNumber === 1) {
    socket.emit('paddle-move', mouseY);
  } else if (playerNumber === 2) {
    socket.emit('paddle-move', mouseY);
  }
}

canvas.addEventListener('mousemove', handleMouseMove);

function draw() {
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(20, paddle1Y, 20, 100);  // Left paddle
  ctx.fillRect(760, paddle2Y, 20, 100); // Right paddle

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // Draw scores
  ctx.font = '30px Arial';
  ctx.fillText(score1.toString(), 100, 50);
  ctx.fillText(score2.toString(), 700, 50);

  requestAnimationFrame(draw);
}

draw(); 