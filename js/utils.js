function rectangularCollision({ rectagle1, rectagle2 }) {
  return (
    rectagle1.attackBox.position.x + rectagle1.attackBox.width >=
      rectagle2.position.x &&
    rectagle1.attackBox.position.x <= rectagle2.width + rectagle2.position.x &&
    rectagle1.attackBox.position.y + rectagle1.attackBox.height >=
      rectagle2.position.y &&
    rectagle1.attackBox.position.y <= rectagle2.position.y + rectagle2.height
  );
}
function determineWinner({ player, enemy, timeId }) {
  clearTimeout(timeId);
  const resultText = document.querySelector("#resultText");
  resultText.style.display = "flex";
  if (player.health === enemy.health) {
    resultText.innerHTML = "EMPATE";
  } else if (player.health > enemy.health) {
    resultText.innerHTML = "Player Blue Ganhou";
  } else if (enemy.health > player.health) {
    resultText.innerHTML = "Enemy Red Ganhou";
  }
}
let timer = 15;
let timeId;
function decreaseTimer() {
  if (timer > 0) {
    timeId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer == 0) {
    determineWinner({ player, enemy, timeId });
  }
}
