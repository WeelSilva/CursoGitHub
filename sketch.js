let bolaImagem;
let jogador1Imagem;
let jogador2Imagem;
let fundoImagem;
let quicaSom;
let golSom;

let jogador1Pontos = 0;
let jogador2Pontos = 0;
class Raquete {
    constructor(x) {
        this.x = x;
        this.y = height / 2;
        this.w = 10;
        this.h = 60;
    }
    update() {
        // se a raquete é o jogador 1
        if (this.x < width / 2) {
        this.y = mouseY;
        } else {
            // se a bola esta em cima
            if (bola.y < this.y) {
                this.y -= 3;
            } else {
                this.y += 3;
            }
        }
        //limitar dentro da tela
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > height - this.h) {
            this.y = height - this.h;
        }
    }
    desenha() {
        //se a raquete é o jogador 1
        if (this.x < width / 2) {
            image(jogador1Imagem, this.x, this.y, this.w, this.h);
        } else {
            image(jogador2Imagem, this.x, this.y, this.w, this.h);
        }
        
    }
}
class Bola {
    constructor() {
        this.r = 25;
        this.reset();
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 5;
        this.angulo = 0;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.angulo += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 30;
        
        if (this.x < this.r || this.x > width - this.r) { 
            if (this.x < this.r) {
                jogador2Pontos++;
            } else {
                jogador1Pontos++;
            }
            golSom.play();
            falaPontos();
            this.reset();
        }
        if (this.y < this.r || this.y > height - this.r) {
            this.vy *= -1;
        }
        
        if (colideRetanguloCirculo(this.x, this.y, this.r, jogador1.x, jogador1.y, jogador1.w, jogador1.h) ||
        colideRetanguloCirculo(this.x, this.y, this.r, jogador2.x, jogador2.y, jogador2.w, 
            jogador2.h)) {
            quicaSom.play();
            this.vx *= -1;
            this.vx *= 1.1;
            this.vy *= 1.1;
        }

    }

desenha() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    image(bolaImagem, -this.r, -this.r, this.r * 2, this.r * 2);
    pop();
    }
} 

function colideRetanguloCirculo(cx, cy, raio, x, y, w, h) {
        
    if (cx + raio < x || cx - raio > x + w) {
        return false;
    }
    
    if (cy + raio < y || cy - raio > y + h) {
        return false;
    }
    return true;
    }

let bola;
let jogador1;
let jogador2;

function falaPontos() {
    if ('speechSynthesis' in window) {
        const pontuacao = "Brasil" + jogador1Pontos + ' Italia ' + jogador2Pontos;
        const msg = new SpeechSynthesisUtterance(pontuacao);
        msg.lang = 'pt-BR';
        window.speechSynthesis.speak(msg);
    }
}


function preload() {
    bolaImagem = loadImage('bola.png');
    jogador1Imagem = loadImage('barra01.png');
    jogador2Imagem = loadImage('barra02.png');
    fundoImagem = loadImage('fundo1.png');
    quicaSom = loadSound('446100__justinvoke__bounce.wav')
    golSom = loadSound('274178__littlerobotsoundfactory__jingle_win_synth_02.wav')
    }

function setup() {
    createCanvas(800, 400);
    bola = new Bola();
    jogador1 = new Raquete(30);
    jogador2 = new Raquete(width - 30 - 10);
}

function draw() {
    let canvasAspectRatio = width / height;
    let fundoAspectRatio = fundoImagem.width / fundoImagem.height;
    let zoom = 1;
    if (canvasAspectRatio > fundoAspectRatio) {
        zoom = width / fundoImagem.width;
    } else {
        zoom = height / fundoImagem.height;
    }
    let scaledWidth = fundoImagem.width * zoom;
    let scaledHeight = fundoImagem.height * zoom;
    image(fundoImagem, (width - scaledWidth) / 2, (height - scaledHeight) / 2, scaledWidth, scaledHeight);

    bola.update();
    bola.desenha();
    jogador1.update();
    jogador1.desenha();
    jogador2.update();
    jogador2.desenha();
}
