class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    //atributo imagem é um Objeto do tipo Imagem
    this.image = new Image()
    //esse obj recebe como src o atributo que é passado no construtor: imageSrc
    this.image.src = imageSrc
  }

  //método que insere o Sprite na cena
  draw() {
    //insere o objeto this.image na posição x,y
    c.drawImage(this.image, this.position.x, this.position.y)
  }

  //método que é chamado a cada frame do jogo
  update() {
    //insere os sprite na tela nas posições atualizadas
    this.draw();
  }
}
//cria uma classe de Fighter que tem como atributo um objeto que contem posição e velocidade

class Fighter {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.color = color;
    //variávei que guarda a ultima tecla pressionada
    //para o caso do usuário por exemplo, clicar e segurar 'a' e depois clicar em 'd'
    this.lasKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.isAttacking;
    this.health = 100;
  }

  //método que insere o Sprite na cena
  draw() {
    //define a cor do Sprite e cria ele preenxendo a
    //tela da posição X,Y do elemento, até o tamanho e largura dele
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //insere attackBox
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
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
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    //adiciona velocidade a posição
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //se o sprite atingir o fim da tela, a velocidade Y dele zera
    //isso acontece quando a distancia da posição dele (fica no topo no sprite) somado
    //a altura dele, mais a velociade (que é o deslocamento) fica igual a altura da tela
    //o -97 é para ele ficar na altura do desenho do chão do backgorund
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
    } else {
      //enquanto ele não está no "chão", a gravidade vai sendo somada a velocidade, aumentando-a
      this.velocity.y += gravity;
    }
  }
}
