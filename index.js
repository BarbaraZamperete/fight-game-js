//cria uma tela onde o nosso jogo irá rodar
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//define o tamanho da tela
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

//preenche a tela, da posição x1,y1 até a posição x2,y2
c.fillRect(0, 0, canvas.width, canvas.height);

//cria uma classe de Sprite que tem como atributo um objeto que contem posição e velocidade
class Sprite {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.color = color;
    //variávei que guarda a ultima tecla pressionada
    //para o caso do usuário por exemplo, clicar e segurar 'a' e depois clicar em 'd'
    this.lasKey;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };
    this.isAttacking;
  }

  //método que insere o Sprite na cena
  draw() {
    //define a cor do Sprite e cria ele preenxendo a
    //tela da posição X,Y do elemento, até o tamanho e largura dele
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //insere attackBox
    c.fillStyle = "green";
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  //método que é chamado a cada frame do jogo
  update() {
    //insere os sprite na tela nas posições atualizadas
    this.draw();

    //adiciona velocidade a posição
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //se o sprite atingir o fim da tela, a velocidade Y dele zera
    //isso acontece quando a distancia da posição dele (fica no topo no sprite) somado
    //a altura dele, mais a velociade (que é o deslocamento) fica igual a altura da tela
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      //enquanto ele não está no "chão", a gravidade vai sendo somada a velocidade, aumentando-a
      this.velocity.y += gravity;
    }
  }
}

//cria um objeto player da classe Sprite
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
});
//cria um objeto enemy da classe Sprite
const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
});

//um objeto para controlar as teclas pressionadas
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

//função que roda em loop. Cada chamada dessa função pe um frame do game
function animate() {
  //animate loop game
  window.requestAnimationFrame(animate);

  //a cada frame a tela é pintada de preto novamente e seu tamanho reniciado
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //jogadores atualizados
  player.update();
  enemy.update();

  //zera a velocidade x dos objetos
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //movimento do player
  //verifica qual tecla está pressionada. Ela deve coincidir com a última tecla pressionada
  //para então gerar a velocidade no eixo X no personagem
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //movimento do enemy
  if (keys.ArrowLeft.pressed && enemy.lasKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lasKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detectar colision
  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.width + enemy.position.x &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height &&
    player.isAttacking
  ) {
    player.isAttacking = false
    console.log("Atacando");
  }
}
animate();

//evento que fica escutando quais teclas são pressionadas
window.addEventListener("keydown", (event) => {
  // console.log(event.key)
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lasKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lasKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
  }
});

//evento que escuta quais teclas deixam de ser pressionadas
//para o personagem não ficar andando para sempre, mesmo após parar de clicar
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
