"use strict";
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let numJogador = 0;
let raquete1Y = 250;
let raquete2Y = 250;
let bolaX = 400;
let bolaY = 300;
let score1 = 0;
let score2 = 0;
socket.on('numJogador', (number) => {
    numJogador = number;
    console.log(`Você é o jogador ${numJogador}`);
});
//Utilizado para atualizações em tempo real
socket.on('game-state', (gameState) => {
    raquete1Y = gameState.raquete1Y;
    raquete2Y = gameState.raquete2Y;
    bolaX = gameState.bolaX;
    bolaY = gameState.bolaY;
    score1 = gameState.score1;
    score2 = gameState.score2;
});
function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    if (numJogador === 1) {
        socket.emit('raquete-move', mouseY);
    }
    else if (numJogador === 2) {
        socket.emit('raquete-move', mouseY);
    }
}
canvas.addEventListener('mousemove', handleMouseMove);
function criar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(20, raquete1Y, 20, 100);
    ctx.fillRect(760, raquete2Y, 20, 100);
    ctx.beginPath();
    ctx.arc(bolaX, bolaY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.font = '30px Arial';
    ctx.fillText(score1.toString(), 100, 50);
    ctx.fillText(score2.toString(), 700, 50);
    requestAnimationFrame(criar);
}
criar();
