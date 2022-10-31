const canvas = document.getElementById("tron");
const context = canvas.getContext("2d");
const pixels = 20;

context.beginPath();
for (i = 0; i <= 760; i += 20) {
    context.moveTo(i, 0);
    context.lineTo(i, 760);
    context.moveTo(0, i);
    context.lineTo(760, i);
    context.strokeStyle = 'rgb(28, 33, 78)';
    context.stroke();
}

class Player {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.dead = false;
        this.color = colour;
        this.direction = "";
        this.key = "";
        this.constructor.counter = (this.constructor.counter || 0) + 1;
        this.id = this.constructor.counter;

        Player.allInstances.push(this);
    };
};
Player.allInstances = [];

const player1 = new Player(100, 100, 'blue');
const player2 = new Player(640, 640, "orange");

const player1_score = 0;
const player2_score = 0;


const UP_KEY = 38;
const DOWN_KEY = 40;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;

const W_KEY = 87;
const S_KEY = 83;
const A_KEY = 65;
const D_KEY = 68;


function setDirection(player, up, down, left, right, currentKey) {
    switch (currentKey) {
    case up:
        if (player.direction !== 'DOWN') {
            player.key = 'UP';
        }
        break;
    case down:
        if (player.direction !== 'UP') {
            player.key = 'DOWN';
        }
        break;
    case left:
        if (player.direction !== 'RIGHT') {
            player.key = 'LEFT';
        }
        break;
    case right:
        if (player.direction !== 'LEFT') {
            player.key = 'RIGHT';
        }
        break;
    };  
};


function keyPress(event) {
    let currentKey = event.keyCode;
    event.preventDefault();
    setDirection(player1, 38, 40, 37, 39, currentKey);
    setDirection(player2, 87, 83, 65, 68, currentKey);
}
document.addEventListener("keydown", keyPress);



function setPlayableArea(pixels, canvas) {
    let playableArea = new Set();
    for (let i = 0; i < canvas.width / pixels; i++) {
        for (let j = 0; j < canvas.height / pixels; j++) {
            playableArea.add(`${i * pixels}x${j * pixels}y`);
        };
    };
    return playableArea;
};

let playableArea = setPlayableArea(pixels, canvas);


function renderPlayers(players) {
    players.forEach(player => {       
        context.fillStyle = player.color;
        context.fillRect(player.x, player.y, pixels, pixels);
        context.strokeStyle = 'black';
        context.strokeRect(player.x, player.y, pixels, pixels);
    })
}
renderPlayers(Player.allInstances);


let outcome, winnerColor, playerCount = Player.allInstances.length;


function draw() {
    if (Player.allInstances.filter(player => !player.key).length === 0) {

        if (playerCount === 1) {
            const alivePlayers = Player.allInstances.filter(player => player.dead === false);
            outcome = `Player ${alivePlayers[0].id} wins!`;
            winnerColor = alivePlayers[0].colour;
        }
        else if (playerCount === 0) {
            outcome = `Draw!`;
        }
        if (outcome) {
            console.log(outcome)
            createResultsScreen(winnerColor);
            clearInterval(game);
        };

        Player.allInstances.forEach(player => {
            if (player.key) {
                player.direction = player.key;


                context.fillStyle = player.color;
                context.fillRect(player.x, player.y, pixels, pixels);
                context.strokeStyle = 'black';
                context.strokeRect(player.x, player.y, pixels, pixels);
                
                if (!playableArea.has(`${player.x}x${player.y}y`) && player.dead === false) {
                    player.dead = true;
                    player.direction = '';
                    playerCount -= 1;
                };
                
                playableArea.delete(`${player.x}x${player.y}y`);
                
                if (player.dead == false) {
                    if (player.direction == "UP") {
                        player.y -= pixels
                    }
                    else if (player.direction == "DOWN") {
                        player.y += pixels
                    }
                    else if (player.direction == "LEFT") {
                        player.x -= pixels
                    }
                    else if (player.direction == "RIGHT") {
                        player.x += pixels
                    };
                };


            }
        })
    };
};
let game = setInterval(draw, 125);

function createResultsScreen(color) {
    const resultNode = document.createElement('div');
    resultNode.id = 'result';
    resultNode.style.colour = color || '#fff';
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
    resultText.style.fontFamily = 'Orbitron, sans-serif';
    resultText.style.color = 'white';
    resultText.style.textTransform = 'uppercase';
    resultText.style.fontFamily = 'Orbitron, sans-serif';

    const replayButton = document.createElement('button');
    replayButton.innerText = 'Replay? Hit ENTER!';
    replayButton.textTransform = 'uppercase';
    replayButton.style.padding = '10px 30px';
    replayButton.style.fontSize = '1.2rem';
    replayButton.style.margin = '0 auto';
    replayButton.onclick = resetGame

    resultNode.appendChild(resultText);
    resultNode.appendChild(replayButton);
    document.querySelector('body').appendChild(resultNode);

    document.addEventListener('keydown', (occasion) => {
        let key = occasion.keyCode;
        if (key == 13) {
            resetGame();
        }
    })
}

function resetGame() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath();
    for (i = 0; i <= 760; i += 20) {
        context.moveTo(i, 0);
        context.lineTo(i, 760);
        context.moveTo(0, i);
        context.lineTo(760, i);
        context.strokeStyle = 'rgb(28, 33, 78)';
        context.stroke();
    };

    playableArea = setPlayableArea(pixels, canvas);

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
}