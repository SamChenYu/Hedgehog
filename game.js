let canvas, ctx, width, height;
let hedgehogImg;
let keysPressed = {};
const animationSpeed = 8;

window.onload = function() {
    canvas = document.getElementById('canvas');
    height = canvas.height;
    width = canvas.width;
    ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    hedgehogImg = new Image();
    hedgehogImg.onload = function() {
        splitSpritesheet(hedgehogImg, 4, 4, 32, 32).then(function(result) {
            splitSprites(result);
            startGameLoop();
        }).catch(function(error) {
            console.error('Error splitting spritesheet:', error);
        });
    };
    hedgehogImg.src = 'hedgehog.png';

    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.key];
    });
}

function startGameLoop() {
    setInterval(update, 1000 / 60);
    setInterval(updateAnimation, 1000 / animationSpeed);
}

function updateAnimation() {
    if (isPlayerMoving(keysPressed)) {
        currentFrame = (currentFrame + 1) % (totalFrames + 1);
    } else {
        currentFrame = 1;
    }
}

function update() {
    const speed = 1;

    if ('ArrowUp' in keysPressed || 'w' in keysPressed) {
        playerY -= speed;
    } 
    if ('ArrowDown' in keysPressed || 's' in keysPressed) {
        playerY += speed;
    } 
    if ('ArrowLeft' in keysPressed || 'a' in keysPressed) {
        playerX -= speed;
        facingDirection = 'left';
    } 
    if ('ArrowRight' in keysPressed || 'd' in keysPressed) {
        playerX += speed;
        facingDirection = 'right';
    }

    ctx.clearRect(0, 0, width, height);

    if (isPlayerMoving(keysPressed)) {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[1][currentFrame], playerX, playerY, 32, 32);
        } else {
            ctx.drawImage(rightSprites[1][currentFrame], playerX, playerY, 32, 32);
        }
    } else {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[0][currentFrame], playerX, playerY, 32, 32);
        } else {
            ctx.drawImage(rightSprites[0][currentFrame], playerX, playerY, 32, 32);
        }
    }
}

function splitSpritesheet(img, rows, cols, spriteWidth, spriteHeight) {
    return new Promise((resolve, reject) => {
        let spritesArray = [];
        let tempCanvas = document.createElement('canvas');
        let tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = spriteWidth;
        tempCanvas.height = spriteHeight;

        for (let y = 0; y < rows; y++) {
            spritesArray[y] = [];
            for (let x = 0; x < cols; x++) {
                tempCtx.clearRect(0, 0, spriteWidth, spriteHeight);
                tempCtx.drawImage(img, x * spriteWidth, y * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
                createImageBitmap(tempCanvas).then(function(bitmap) {
                    spritesArray[y][x] = bitmap;
                    if (y === rows - 1 && x === cols - 1) {
                        resolve(spritesArray);
                    }
                }).catch(function(error) {
                    reject(error);
                });
            }
        }
    });
}
