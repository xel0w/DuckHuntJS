let canvas;
let canvasContext;
let duckX;
let duckY;
let duckSpeedX;
let duckSpeedY;
let duckRadius;
let crosshairX;
let crosshairY;
let ducksCaught = 0;
let maxDucks;
let bullets;
let gameEnded;
let gamePaused;
let divResult = document.querySelector('#divResult');
let restart = document.querySelector('#restart');
let spanDucks = document.querySelector('#ducksCaught')

function init() {
  document.addEventListener('keydown', function listener(event) {
    if (event.key.toLowerCase() === 'r') {
        restartGame();
    }
});
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');
  duckRadius = 40;
  maxDucks = 10;
  bullets = 10;
  gameEnded = false;
  gamePaused = false;
  newDuck();
  setInterval(moveDuck, 10);
  canvas.addEventListener('click', shoot);
}


function moveDuck() {
  if (!gamePaused && !gameEnded) {
    duckX += duckSpeedX;
    duckY += duckSpeedY;
    if (duckX < duckRadius || duckX > canvas.width - duckRadius) {
      duckSpeedX = -duckSpeedX;
    }
    if (duckY < duckRadius || duckY > canvas.height - duckRadius) {
      duckSpeedY = -duckSpeedY;
    }
    draw();
  }
}


function newDuck() {
  duckX = Math.floor(Math.random() * (canvas.width - 2 * duckRadius)) + duckRadius;
  duckY = Math.floor(Math.random() * (canvas.height - 2 * duckRadius)) + duckRadius;
  duckSpeedX = Math.floor(Math.random() * 11) - 5;
  duckSpeedY = Math.floor(Math.random() * 11) - 5;
}


function shoot(event) {
  if (!gamePaused && !gameEnded) {
    var mousePos = getMousePos(event);
    if (Math.abs(mousePos.x - duckX) < duckRadius && Math.abs(mousePos.y - duckY) < duckRadius) {
      ducksCaught++;
      if (ducksCaught === maxDucks) {
        endGame();
      } else {
        newDuck();
      }
    }
    bullets--;
    if (bullets === 0 && ducksCaught < maxDucks) {
      endGame();
    }
  }
}


function endGame() {
  gameEnded = true;
  gamePaused = true;
  spanDucks.innerHTML = ducksCaught;
  divResult.classList.remove("resultHide");
  restart.addEventListener('click', ()=>{restartGame, divResult.classList.add("resultHide") });
  canvas.removeEventListener('click', shoot);
  canvas.addEventListener('click', restartGame);
}


function updateScore() {
    canvasContext.fillStyle = 'black';
    canvasContext.font = '20px Arial';
    canvasContext.fillText('Canard touchés: ' + ducksCaught, 10, 25);
    canvasContext.fillText('Balles restantes: ' + bullets, 10, 50);
  }


function drawDuck() {
  const duckImg = new Image();
  duckImg.src = "./assets/canard.png"; 

  duckImg.addEventListener("load", () => {
    canvasContext.drawImage(duckImg, duckX - duckRadius, duckY - duckRadius, duckRadius * 2, duckRadius * 2);
  });
}



function getMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}


function restartGame() {
  canvas.removeEventListener('click', restartGame);
  ducksCaught = 0;
  bullets = 10;
  newDuck();
  gameEnded = false;
  gamePaused = false;
  canvas.addEventListener('click', shoot);
}


function pauseGame() {
  gamePaused = true;
  canvas.removeEventListener('click', shoot);
}


function resumeGame() {
  gamePaused = false;
  canvas.addEventListener('click', shoot);
}


function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  drawDuck();
  updateScore();
}


init();
