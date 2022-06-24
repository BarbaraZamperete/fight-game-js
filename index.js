//cria uma tela onde o nosso jogo irá rodar
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//define o tamanho da tela
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

//preenche a tela, da posição x1,y1 até a posição x2,y2
c.fillRect(0, 0, canvas.width, canvas.height);

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

//cria um objeto player da classe Sprite
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
  },
});
//cria um objeto enemy da classe Sprite
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
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

decreaseTimer();
//função que roda em loop. Cada chamada dessa função é um frame do game
function animate() {
  //animate loop game
  window.requestAnimationFrame(animate);

  //a cada frame a tela é pintada de preto novamente e seu tamanho reniciado
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //jogadores atualizados
  background.update();
  shop.update();
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
    player.switchSprit("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprit("run");
  } else {
    player.switchSprit("idle");
  }

  //jumpping
  if (player.velocity.y < 0) {
    player.switchSprit("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprit("fall");
  }

  //movimento do enemy
  if (keys.ArrowLeft.pressed && enemy.lasKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lasKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detectar colision
  if (
    rectangularCollision({ rectagle1: player, rectagle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("Atacando Player");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    rectangularCollision({ rectagle1: enemy, rectagle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("Atacando Enemy");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //end the game base on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timeId });
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
    case "ArrowDown":
      enemy.attack();
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
