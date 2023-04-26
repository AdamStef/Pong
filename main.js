let leftPaddleSVG = document.getElementById('leftPaddle');
let rightPaddleSVG = document.getElementById('rightPaddle');
let ballSVG = document.getElementById('ball');
let startMenu = document.getElementById('startMenu');

let paddleBounce = new Audio('paddle_bounce.wav');
let wallBounce = new Audio('wall_bounce.wav');
let lost = new Audio('lost.wav');

let screenWidth = 500;
let screenHeight = 300;

let DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};

let isRunning = false;
let isOver = false;
let AITurnedOn = false;
let maxScore = 5

let paddleSpeed = 5;
let turn = 0;
let turnBallSpeed = [2, 2.2, 2.5, 2.9, 3.3, 3.5, 3.8, 4, 4.2, 4.5]
let ballSpeed = turnBallSpeed[turn++];


let leftPaddle = {
    x: leftPaddleSVG.x.baseVal.value,
    y: leftPaddleSVG.y.baseVal.value,
    width: leftPaddleSVG.width.baseVal.value,
    height: leftPaddleSVG.height.baseVal.value,
    move: DIRECTION.IDLE,
    score: 0,
};

let rightPaddle = {
    x: rightPaddleSVG.x.baseVal.value,
    y: rightPaddleSVG.y.baseVal.value,
    width: rightPaddleSVG.width.baseVal.value,
    height: rightPaddleSVG.height.baseVal.value,
    move: DIRECTION.IDLE,
    score: 0,
};

let ball = {
    x: ballSVG.x.baseVal.value,
    y: ballSVG.y.baseVal.value,
    width: ballSVG.width.baseVal.value,
    height: ballSVG.height.baseVal.value,
    moveX: DIRECTION.IDLE,
    moveY: DIRECTION.IDLE,
};

function resetDefault() {
    isOver = false;
    AITurnedOn = false;
    paddleSpeed = 5;
    turn = 0;
    ballSpeed = turnBallSpeed[turn++];
    leftPaddle.score = 0;
    rightPaddle.score = 0;
}

function svgUpdate() {
    leftPaddleSVG.x.baseVal.value = leftPaddle.x;
    leftPaddleSVG.y.baseVal.value = leftPaddle.y;

    rightPaddleSVG.x.baseVal.value = rightPaddle.x;
    rightPaddleSVG.y.baseVal.value = rightPaddle.y;

    ballSVG.x.baseVal.value = ball.x;
    ballSVG.y.baseVal.value = ball.y;

    document.getElementById('leftPoints').firstChild.data = leftPaddle.score;
    document.getElementById('rightPoints').firstChild.data = rightPaddle.score;
}

function nextTurn(paddle) {
    lost.play();
    ball.x = 248;
    ball.y = Math.floor(Math.random() * (screenHeight - 20)) + 10;
    paddle.score++;
    ball.moveX = DIRECTION.IDLE;
    ball.moveY = DIRECTION.IDLE;
    setTimeout(() => {
        ball.moveX = paddle === leftPaddle ? DIRECTION.RIGHT : DIRECTION.LEFT;
        ball.moveY = Math.round(Math.random()) ? DIRECTION.UP : DIRECTION.DOWN;
    }, 1000)
    ballSpeed = turnBallSpeed[turn++];
    paddleSpeed += 0.75;
}

function update() {
    if (!isOver) {
        //Left player lost
        if (ball.x <= 0) {
            nextTurn(rightPaddle);
        }
        // Right player lost
        if (ball.x + ball.width >= screenWidth) {
            nextTurn(leftPaddle);
        }

        // Upper wall
        if (ball.y <= 2) {
            ball.moveY = DIRECTION.DOWN;
            wallBounce.play();
        }
        // Bottom wall
        if (ball.y + ball.height >= screenHeight) {
            ball.moveY = DIRECTION.UP;
            wallBounce.play();
        }
        // Move left paddle
        if (leftPaddle.move === DIRECTION.UP) {
            leftPaddle.y -= paddleSpeed;
        } else if (leftPaddle.move === DIRECTION.DOWN) {
            leftPaddle.y += paddleSpeed;
        }

        // Move right paddle
        if (!AITurnedOn) {
            if (rightPaddle.move === DIRECTION.UP) {
                rightPaddle.y -= paddleSpeed;
            } else if (rightPaddle.move === DIRECTION.DOWN) {
                rightPaddle.y += paddleSpeed;
            }
        }

        // Check if left paddle is out of bounds
        if (leftPaddle.y <= 5) {
            leftPaddle.y = 5;
        } else if (leftPaddle.y + leftPaddle.height >= screenHeight - 5) {
            leftPaddle.y = screenHeight - 5 - leftPaddle.height;
        }

        // Check if right paddle is out of bounds
        if (rightPaddle.y <= 5) {
            rightPaddle.y = 5;
        } else if (rightPaddle.y + rightPaddle.height >= screenHeight - 5) {
            rightPaddle.y = screenHeight - 5 - rightPaddle.height;
        }

        // Move ball
        if (ball.moveX === DIRECTION.LEFT) {
            ball.x -= ballSpeed;
        } else if (ball.moveX === DIRECTION.RIGHT) {
            ball.x += ballSpeed;
        }
        if (ball.moveY === DIRECTION.UP) {
            ball.y -= ballSpeed / 1.25;
        } else if (ball.moveY === DIRECTION.DOWN) {
            ball.y += ballSpeed / 1.25;
        }


        //AI
        if (AITurnedOn) {
            if (rightPaddle.y > ball.y - rightPaddle.height / 2) {
                if (ball.moveX === DIRECTION.RIGHT)
                    rightPaddle.y -= paddleSpeed / 3;
                else rightPaddle.y -= paddleSpeed / 4;
            }
            if (rightPaddle.y < ball.y - rightPaddle.height / 2) {
                if (ball.moveX === DIRECTION.RIGHT)
                    rightPaddle.y += paddleSpeed / 3;
                else rightPaddle.y += paddleSpeed / 4;
            }
        }


        // Left paddle collision
        if (ball.x <= leftPaddle.x + leftPaddle.width) {
            if (ball.y <= leftPaddle.y + leftPaddle.height && ball.y + ball.height >= leftPaddle.y) {
                ball.x = leftPaddle.x + ball.width;
                ball.moveX = DIRECTION.RIGHT;
                ballSpeed += 0.1;
                paddleBounce.play();
            }
        }
        // Right paddle collision
        if (ball.x >= rightPaddle.x) {
            if (ball.y <= rightPaddle.y + rightPaddle.height && ball.y + ball.height >= rightPaddle.y) {
                ball.x = rightPaddle.x;
                ball.moveX = DIRECTION.LEFT;
                ballSpeed += 0.1;
                paddleBounce.play();
            }
        }
    }
    if (leftPaddle.score === maxScore || rightPaddle.score === maxScore) {
        isOver = true;
        if (leftPaddle.score === maxScore) alert("Left player won the game!");
        else alert("Right player won the game!");
        startMenu.setAttribute('visibility', 'visible');
    }

}

function loop() {
    update();
    svgUpdate();
    if (!isOver) requestAnimationFrame(loop);
}

function startGame() {
    startMenu.setAttribute('visibility', 'hidden');
    isRunning = true;
    ball.moveX = Math.round(Math.random()) ? DIRECTION.LEFT : DIRECTION.RIGHT;
    ball.moveY = Math.round(Math.random() * 2) ? DIRECTION.UP : DIRECTION.DOWN;
    setTimeout(() => requestAnimationFrame(loop), 1000);
}

function movePaddlesListener() {
    document.addEventListener('keydown', function (key) {
        if (key.key === 'F5') return;
        // Ply again
        if (isOver) {
            resetDefault();
            startGame();
        }
        // Start game
        if (isRunning === false) {
            startGame();
        }
        // Switch AI
        if (key.key === 'A' || key.key === 'a') AITurnedOn = !AITurnedOn;
        // Left paddle
        if (key.key === 'w' || key.key === 'W') leftPaddle.move = DIRECTION.UP;
        if (key.key === 's' || key.key === 'S') leftPaddle.move = DIRECTION.DOWN;
        // Right paddle
        if (!AITurnedOn) {
            if (key.key === 'ArrowUp') rightPaddle.move = DIRECTION.UP;
            if (key.key === 'ArrowDown') rightPaddle.move = DIRECTION.DOWN;
        }
    });

    document.addEventListener('keyup', function (key) {
        if (key.key === 'w' || key.key === 'W' || key.key === 's' || key.key === 'S') {
            leftPaddle.move = DIRECTION.IDLE;
        }
        if (!AITurnedOn && (key.key === 'ArrowUp' || key.key === 'ArrowDown')) {
            rightPaddle.move = DIRECTION.IDLE;
        }
    });
}

movePaddlesListener();