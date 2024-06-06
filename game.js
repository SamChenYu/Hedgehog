let playerX = 0;
let playerY = 0;
let canvas, ctx, width, height;
let hedgehogImg;
let leftSprites = []; // Array to store individual left-facing sprite images
let rightSprites = []; // Array to store individual right-facing sprite images
let keysPressed = {}; // Object to track keys being pressed
let facingDirection = 'right'; // Variable to track the facing direction of the player
let currentFrame = 0; // Variable to track the current frame for passive animation
const animationSpeed = 8; // Frames per second for passive animation
const totalFrames = 3; // Total frames for passive animation

window.onload = function() {
    canvas = document.getElementById('canvas');
    height = canvas.height;
    width = canvas.width;
    ctx = canvas.getContext('2d');
    
    // Disable image smoothing (anti-aliasing) to maintain pixelated look
    ctx.imageSmoothingEnabled = false;

    hedgehogImg = new Image();
    hedgehogImg.onload = function() {
        splitSpritesheet(hedgehogImg, 4, 4, 32, 32).then(function(result) {
            console.log(result); // Check if the sprites arrays contain split sprites
            splitSprites(result);
            startGameLoop();
        }).catch(function(error) {
            console.error('Error splitting spritesheet:', error);
        });
    };
    hedgehogImg.src = 'hedgehog.png';
    
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true; // Mark the key as pressed
    });
    
    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.key]; // Remove the key from the object when released
    });
}

function startGameLoop() {
    setInterval(update, 1000 / 60); // 60 frames per second
    setInterval(updateAnimation, 1000 / animationSpeed); // Passive animation update
}

function updateAnimation() {
    // Only update animation frame if the player is moving
    if (isPlayerMoving()) {
        currentFrame = (currentFrame + 1) % (totalFrames + 1); // +1 to include the reset frame
    }
}

function isPlayerMoving() {
    return (
        ('ArrowUp' in keysPressed || 'w' in keysPressed) ||
        ('ArrowDown' in keysPressed || 's' in keysPressed) ||
        ('ArrowLeft' in keysPressed || 'a' in keysPressed) ||
        ('ArrowRight' in keysPressed || 'd' in keysPressed)
    );
}

function splitSprites(spritesArray) {
    // Populate leftSprites by mirroring rightSprites
    rightSprites = spritesArray;
    leftSprites = rightSprites.map(row => row.map(sprite => mirrorSprite(sprite)));

    console.log("Left Sprites:", leftSprites);
    console.log("Right Sprites:", rightSprites);
}

function mirrorSprite(sprite) {
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = sprite.width;
    tempCanvas.height = sprite.height;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.scale(-1, 1); // Flip horizontally
    tempCtx.drawImage(sprite, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
    
    return tempCanvas;
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
        facingDirection = 'left'; // Update facing direction
    } 
    if ('ArrowRight' in keysPressed || 'd' in keysPressed) {
        playerX += speed;
        facingDirection = 'right'; // Update facing direction
    }

    ctx.clearRect(0, 0, width, height);
    // Draw the sprite based on direction and current frame for passive animation
    if (facingDirection === 'left') {
        ctx.drawImage(leftSprites[1][currentFrame], playerX, playerY, 128, 128); // Adjust size as needed
    } else {
        ctx.drawImage(rightSprites[1][currentFrame], playerX, playerY, 128, 128); // Adjust size as needed
    }
}

// Function to split spritesheet into a 2D array of individual sprites
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
