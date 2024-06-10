



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

    for(let i=0; i<leavesMap.length; i++) {
        leavesMap[i][2] = (leavesMap[i][2] + 1) % 6;
    }
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

    for(let i=0; i<leavesMap.length; i++) {
        if(Math.random() > 0.9) {
            leavesMap[i][0] -= 1;
        }

        if(Math.random() > 0.8) {
            leavesMap[i][1] += 1;
        }

        if(leavesMap[i][0] < 0 || leavesMap[i][0] > width) {
            leavesMap[i][0] = width;
            leavesMap[i][1] = Math.floor(Math.random() * height);
        }

        if(leavesMap[i][1] < 0 || leavesMap[i][1] > height) {
            leavesMap[i][1] = 0;
            leavesMap[i][0] = Math.floor(Math.random() * width);
        }
    }

    draw();
}



function draw() {
    ctx.clearRect(0, 0, width, height);

    for(let row=0; row<map.length; row++) {
        for(let col=0; col<map[row].length; col++) {
            let indexX = map[row][col][0];
            let indexY = map[row][col][1];
            ctx.drawImage(tiles[indexX][indexY], row*16, col*16, 16, 16);
        }
    }  


    


    if (isPlayerMoving(keysPressed)) {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[1][currentFrame], playerX, playerY, 30, 30);
        } else {
            ctx.drawImage(rightSprites[1][currentFrame], playerX, playerY, 30, 30);
        }
    } else {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[0][currentFrame], playerX, playerY, 30, 30);
        } else {
            ctx.drawImage(rightSprites[0][currentFrame], playerX, playerY, 30, 30);
        }
    }

    // draw the trees and flowers after so that the player walks behind them
    for(let i=0; i<treesMap.length; i++) {
        
        let x = treesMap[i][0];
        let y = treesMap[i][1];
        let indexY = treesMap[i][3];
        ctx.drawImage(trees[0][indexY], x, y, 32, 32);
        
    
    }

    for(let i=0; i<flowersMap.length; i++) {
        
        let x = flowersMap[i][0];
        let y = flowersMap[i][1];
        let indexX = flowersMap[i][2];
        let indexY = flowersMap[i][3];
        ctx.drawImage(flowers[indexX][indexY], x, y, 16, 16);
        
    }

    ctx.drawImage(slimeSprites[0][currentSlimeFrame], 0, 0, 32, 32);


    for(let i=0; i<leavesMap.length; i++) {
        
        let x = leavesMap[i][0];
        let y = leavesMap[i][1];
        let indexX = leavesMap[i][2];
        ctx.drawImage(leaves[0][indexX], x, y, 12, 7);
        

    }
    //ctx.drawImage(leaves, 0, 0, 12, 7);

}
