



// GAME LOOP
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

    currentSlimeFrame = (currentSlimeFrame + 1) % (walkFrames + 1);
}

function update() {

    // player update

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

    draw();
}



function draw() {
    ctx.clearRect(0, 0, width, height);

    for(let row=0; row<map.length; row++) {
        for(let col=0; col<map[row].length; col++) {
            ctx.drawImage(tiles[0][0], row*16, col*16, 16, 16);
        }
    }




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

    ctx.drawImage(slimeSprites[0][currentSlimeFrame], 0, 0, 32, 32);
}
