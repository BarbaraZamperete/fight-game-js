class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    //atributo imagem é um Objeto do tipo Imagem scale=1
    this.image = new Image();
    //esse obj recebe como src o atributo que é passado no construtor: imageSrc
    this.image.src = imageSrc;
    this.scale = scale;
    //atributo que guarda a qnt de frames de uma imagem
    this.framesMax = framesMax;
    //o valor desse atributo controla qual frame será mostrado
    this.frameCurrent = 0;
    //att responsáveis por controlar o tempo para troca dos frames
    //framesElapsed = o tempo decorrido da animação
    this.framesElapsed = 0;
    //quantos frames da anaimação devem passar para se trocar um frame da img
    //por padrão é igual a 1
    this.framesHold = 5;
    this.offset = offset;
  }

  //método que insere o Sprite na cena
  draw() {
    //insere o objeto this.image na posição x,y, com o o width e height
    c.drawImage(
      this.image,
      //essa parte gera uma janela de corte pra imagem, que começa na posição 0
      //o que tiver fora da janela de corte da nossa imagem, não vai aparecer
      //essa conta a baixo é responsável por "andar" a janela de corte para
      //passar os frames
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      //aqui termina a janela de corte
      //aqui ém diante é para a construção da imagem do tamanho da janela de corte
      //o offset é para ajustar qnd a janela de corte é grande para o sprit.
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    //o resto da divisão do tempo decorrido pelo tempo de espera p trocar de imagem vai
    //ser igual a zero quando o tempo decorrido por um multiplo de 5
    //5,10,15,20
    //pois framesHold é igual a 5
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  //método que é chamado a cada frame do jogo
  update() {
    //insere os sprite na tela nas posições atualizadas
    this.draw();
    this.animateFrames();
  }
}
//cria uma classe de Fighter que tem como atributo um objeto que contem posição e velocidade

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {offset:{}, width: undefined, height: undefined},
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.color = color;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    //variávei que guarda a ultima tecla pressionada
    //para o caso do usuário por exemplo, clicar e segurar 'a' e depois clicar em 'd'
    this.lasKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    //att responsáveis por controlar o tempo para troca dos frames
    //framesElapsed = o tempo decorrido da animação
    this.framesElapsed = 0;
    //quantos frames da anaimação devem passar para se trocar um frame da img
    //por padrão é igual a 1
    this.framesHold = 5;
  }

  //método que insere o Sprite na cena
  //   draw() {
  //     //define a cor do Sprite e cria ele preenxendo a
  //     //tela da posição X,Y do elemento, até o tamanho e largura dele
  //     c.fillStyle = this.color;
  //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //     //insere attackBox
  //     if (this.isAttacking) {
  //       c.fillStyle = "green";
  //       c.fillRect(
  //         this.attackBox.position.x,
  //         this.attackBox.position.y,
  //         this.attackBox.width,
  //         this.attackBox.height
  //       );
  //     }
  //   }

  attack() {
    this.switchSprit("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  //método que é chamado a cada frame do jogo
  update() {
    //insere os sprite na tela nas posições atualizadas
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    // insere attackBox
     {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }

    //adiciona velocidade a posição
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //se o sprite atingir o fim da tela, a velocidade Y dele zera
    //isso acontece quando a distancia da posição dele (fica no topo no sprite) somado
    //a altura dele, mais a velociade (que é o deslocamento) fica igual a altura da tela
    //o -97 é para ele ficar na altura do desenho do chão do backgorund
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      //enquanto ele não está no "chão", a gravidade vai sendo somada a velocidade, aumentando-a
      this.velocity.y += gravity;
    }
  }

  switchSprit(sprite) {
    //se o personagem tiver atacando, o sprint de ataque vai prevalecer até ele terminar
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
