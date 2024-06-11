
// GAME LOOP
function startGameLoop() {
    setInterval(update, 1000 / 60);
    setInterval(updateAnimation, 1000 / animationSpeed);
}

function updateAnimation() {
    // update the sprite animations
    if (isPlayerMoving(keysPressed)) {
        currentFrame = (currentFrame + 1) % (totalFrames + 1);
    } else {
        currentFrame = 1;
    }

    //currentSlimeFrame = (currentSlimeFrame + 1) % (walkFrames + 1);

    for(let i=0; i<leavesMap.length; i++) {
        leavesMap[i][2] = (leavesMap[i][2] + 1) % 6;
    }

    for(let i=0; i<coinsMap.length; i++) {
        coinsMap[i][2] = (coinsMap[i][2] + 1) % 4;
    }
}

function update() {

    // player update
    updatePlayerHitbox();
    // detect collision with coins
    for(let i=0; i<coinsMap.length; i++) {
        let coinX = coinsMap[i][0];
        let coinY = coinsMap[i][1];
        let coinHitbox = new Rectangle(coinX+4, coinY+4, 8, 8);
        if(playerHitbox.intersects(coinHitbox)) {
            coinsMap.splice(i, 1);
            coinsCount++;
            playCoin();
        }
    }

    const speed = 1;

    if ('ArrowUp' in keysPressed || 'w' in keysPressed) {
        if (isOnDirtTile(0,  - speed)) {
            playerY -= speed;
        }
    } 
    if ('ArrowDown' in keysPressed || 's' in keysPressed) {
        if (isOnDirtTile(0, speed)) {
            playerY += speed;
        }
    } 
    if ('ArrowLeft' in keysPressed || 'a' in keysPressed) {
        if (isOnDirtTile(- speed, 0)) {
            playerX -= speed;
            facingDirection = 'left';
        }
    } 
    if ('ArrowRight' in keysPressed || 'd' in keysPressed) {
        if (isOnDirtTile(speed, 0)) {
            playerX += speed;
            facingDirection = 'right';
        }
    }

    // checks if the player's movements is on a dirt tile
    function isOnDirtTile(x, y) {
        for(let i=0; i<grassHitbox.length; i++) {
            for(let j=0; j<grassHitbox[i].length; j++) {
                if(grassHitbox[i][j].intersects(playerHitbox.move(x, y))) {
                    return false;
                }
            }
        }
        return true;
    }

    // update random leaf falling movements
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


    // player moves to the next 'room' and terrain is generated again
    if(playerX < -10) {
        resetMap();
        playerX = width-20;
        generateMap(width, height);
        generatePaths(Math.ceil(playerX/16), Math.ceil(playerY/16));
    } else if(playerX > width) {
        resetMap();
        playerX = -5;
        generateMap(width, height);
        generatePaths(Math.ceil(playerX/16), Math.ceil(playerY/16));
    }
    if(playerY < -30) {
        resetMap();
        playerY = 120
        generateMap(width, height);
        generatePaths(Math.ceil(playerX/16), Math.ceil(playerY/16));
    } else if( playerY > height-20 ) {
        resetMap();
        playerY = 0;
        generateMap(width, height);
        generatePaths(Math.ceil(playerX/16), Math.ceil(playerY/16));
    }
    draw();
}



function draw() {
    ctx.clearRect(0, 0, width, height);
    // draw the map
    for(let row=0; row<map.length; row++) {
        for(let col=0; col<map[row].length; col++) {
            let indexX = map[row][col][0];
            let indexY = map[row][col][1];
            ctx.drawImage(tiles[indexX][indexY], row*16, col*16, 16, 16);
        }
    }  


    // draw player 
    if (isPlayerMoving(keysPressed)) {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[1][currentFrame], playerX, playerY, playerSize, playerSize);
        } else {
            ctx.drawImage(rightSprites[1][currentFrame], playerX, playerY, playerSize, playerSize);
        }
    } else {
        if (facingDirection === 'left') {
            ctx.drawImage(leftSprites[0][currentFrame], playerX, playerY, playerSize, playerSize);
        } else {
            ctx.drawImage(rightSprites[0][currentFrame], playerX, playerY, playerSize, playerSize);
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

    //ctx.drawImage(slimeSprites[0][currentSlimeFrame], 0, 0, 32, 32);


    for(let i=0; i<leavesMap.length; i++) {
        
        let x = leavesMap[i][0];
        let y = leavesMap[i][1];
        let indexX = leavesMap[i][2];
        ctx.drawImage(leaves[0][indexX], x, y, 12, 7);
        

    }

    for(let i=0; i<coinsMap.length; i++) {
            
        let x = coinsMap[i][0];
        let y = coinsMap[i][1];
        let indexX = coinsMap[i][2];
        ctx.drawImage(coins[0][indexX], x+4, y+4, 8, 8);
    }   

    // the UI box for coins counter
    ctx.drawImage(uiBoxImg, 5, 0, 40, 20);
    ctx.drawImage(coins[0][0], 10, 7, 9, 9);
    ctx.fillText(' x'+coinsCount, 30, 12);


    
    /* DRAW THE HITBOXES FOR DEBUGGING 
    playerHitbox.drawRect(ctx);

    for(let i=0; i<grassHitbox.length; i++) {
        for(let j=0; j<grassHitbox[i].length; j++) {
            grassHitbox[i][j].drawRect(ctx);
        }
    }

    for(let i=0; i<coinsMap.length; i++) {
        let coinX = coinsMap[i][0];
        let coinY = coinsMap[i][1];
        let coinHitbox = new Rectangle(coinX+4, coinY+4, 8, 8);
        coinHitbox.drawRect(ctx);
    }
        */
    

    
    
}

