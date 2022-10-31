const canvas = document.getElementById('tron');
const context = canvas.getContext('2d');
const pixels = 10;

class Player {
  constructor(x, y, colour) {
    this.colour = colour;
    this.dead = false;
    this.direction = '';
    this.key = '';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this.id = this.constructor.counter;

    Player.allInstances.push(this);
  };
};

Player.allInstances = [];

let player1 = new Player(50, 50, 'red');
let player2 = new Player(440, 280, 'blue');

function setDirection(key, player, up, right, down, left) {
  switch (key) {
    case up:
      if (player.direction !== 'DOWN') {
        player.key = 'UP';
      };
      break;
    case right:
      if (player.direction !== 'LEFT') {
        player.key = 'RIGHT';
      };
      break;
    case down:
      if (player.direction !== 'UP') {
        player.key = 'DOWN';
      };
      break;
    case left:
      if (player.direction !== 'RIGHT') {
        player.key = 'LEFT';
      };
      break;
    default:
      break;
  };
};

function handleKeyPress(e) {
    let currentKey = e.keyCode;
  
    e.preventDefault();
    setDirection(currentKey, player1, 38, 39, 40, 37);
    setDirection(currentKey, player2, 87, 68, 83, 65);
};
  
document.addEventListener('keydown', handleKeyPress);

function setPlayableArea(canvas, pixels) {
  let playableArea = new Set();

  for (let i = 0; i < canvas.width / pixels; i++) {
    for (let j = 0; j < canvas.height / pixels; j++) {
      playableArea.add(`${i * pixels}x${j * pixels}y`);
    };
  };
  return playableArea;
};

let playableArea = setPlayableArea(canvas, pixels);

function drawBackground() {
  context.strokeStyle = 'gray';
  for (let i = 0; i <= canvas.width / pixels + 2; i += 2) {
    for (let j = 0; j <= canvas.height / pixels + 2; j += 2) {
      context.strokeRect(0, 0, pixels * i, pixels * j);
    };
  };

  context.strokeStyle = 'black';
  context.lineWidth = 2;
  for (let i = 1; i <= canvas.width / pixels; i += 2) {
    for (let j = 1; j <= canvas.height / pixels; j += 2) {
      context.strokeRect(0, 0, pixels * i, pixels * j);
    };
  };
  context.lineWidth = 1;
};

drawBackground();

function renderPlayers(players) {
  players.forEach(player => {
    context.fillStyle = player.colour;
    context.fillRect(player.x, player.y, pixels, pixels);
    context.strokeStyle = 'black';
    context.strokeRect(player.x, player.y, pixels, pixels);
  });
};

renderPlayers(Player.allInstances);

let outcome, winnerColor, playerCount = Player.allInstances.length;

function draw() {
  if (Player.allInstances.filter(player => !player.key).length === 0) {

    if (playerCount === 1) {
      const alivePlayers = Player.allInstances.filter(player => player.dead === false);
      outcome = `Player ${alivePlayers[0].id} wins!`;
      winnerColor = alivePlayers[0].colour;
    } else if (playerCount === 0) {
      outcome = 'Draw!';
    }

    if (outcome) {
      createResultsScreen(winnerColor);
      clearInterval(game);
    };

    Player.allInstances.forEach(player => {

      if (player.key) {

        player.direction = player.key;

        context.fillStyle = player.colour;
        context.fillRect(player.x, player.y, pixels, pixels);
        context.strokeStyle = 'black';
        context.strokeRect(player.x, player.y, pixels, pixels);

        if (!playableArea.has(`${player.x}x${player.y}y`) && player.dead === false) {
          player.dead = true;
          player.direction = '';
          playerCount -= 1;
        }

        playableArea.delete(`${player.x}x${player.y}y`);

        if (!player.dead) {
          if (player.direction === "LEFT") player.x -= pixels;
          if (player.direction === "UP") player.y -= pixels;
          if (player.direction === "RIGHT") player.x += pixels;
          if (player.direction === "DOWN") player.y += pixels;
        };

      };

    });

  }
}

let game = setInterval(draw, 100);

function createResultsScreen(colour) {
  const resultNode = document.createElement('div');
  resultNode.id = 'result';
  resultNode.style.colour = colour || '#fff';
  resultNode.style.position = 'fixed';
  resultNode.style.top = 0;
  resultNode.style.display = 'grid';
  resultNode.style.gridTemplateColumns = '1fr';
  resultNode.style.width = '100%';
  resultNode.style.height = '100vh';
  resultNode.style.justifyContent = 'center';
  resultNode.style.alignItems = 'center';
  resultNode.style.background = '#00000088'

  const resultText = document.createElement('h1');
  resultText.innerText = outcome;
  resultText.style.fontFamily = 'Bungee, cursive';
  resultText.style.textTransform = 'uppercase';

  const replayButton = document.createElement('button');
  replayButton.innerText = 'Replay (Enter)';
  replayButton.style.fontFamily = 'Bungee, cursive';
  replayButton.style.textTransform = 'uppercase';
  replayButton.style.padding = '10px 30px';
  replayButton.style.fontSize = '1.2rem';
  replayButton.style.margin = '0 auto';
  replayButton.style.cursor = 'pointer';
  replayButton.onclick = resetGame;

  resultNode.appendChild(resultText);
  resultNode.appendChild(replayButton);
  document.querySelector('body').appendChild(resultNode);

  document.addEventListener('keydown', (e) => {
    let key = e.keyCode;
    if (key == 13 || key == 32 || key == 27 || key == 82)
      resetGame();
  });
};

function resetGame() {
    const result = document.getElementById('result');
    if (result) result.remove();
  
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    playableArea = setPlayableArea(canvas, pixels);
  
    Player.allInstances.forEach(player => {
      player.x = player.startX;
      player.y = player.startY;
      player.dead = false;
      player.direction = '';
      player.key = '';
    });
    
    playerCount = Player.allInstances.length;
    renderPlayers(Player.allInstances);
  
    outcome = '';
    winnerColor = '';
  
    clearInterval(game);
    game = setInterval(draw, 100);
  };
  
  document.querySelector('#play-btn').addEventListener('click', () => {
    document.querySelector('#play-btn').style.display = 'none';
  });