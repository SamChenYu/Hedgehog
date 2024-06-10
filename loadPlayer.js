let playerX = 0;
let playerY = 0;
let leftSprites = [];
let rightSprites = [];
let facingDirection = 'right';
let currentFrame = 0;
const totalFrames = 3;

function isPlayerMoving(keysPressed) {
    return (
        ('ArrowUp' in keysPressed || 'w' in keysPressed) ||
        ('ArrowDown' in keysPressed || 's' in keysPressed) ||
        ('ArrowLeft' in keysPressed || 'a' in keysPressed) ||
        ('ArrowRight' in keysPressed || 'd' in keysPressed)
    );
}

function splitSprites(spritesArray) {
    rightSprites = spritesArray;
    leftSprites = rightSprites.map(row => row.map(sprite => mirrorSprite(sprite)));
}

function mirrorSprite(sprite) {
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = sprite.width;
    tempCanvas.height = sprite.height;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(sprite, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);

    return tempCanvas;
}

function randomizePlayerPosition (width, height) {
    playerX = Math.floor(Math.random() * width/2);
    playerY = Math.floor(Math.random() * height/2);
}

window.playerX = playerX;
window.playerY = playerY;
window.leftSprites = leftSprites;
window.rightSprites = rightSprites;
window.facingDirection = facingDirection;
window.currentFrame = currentFrame;
window.totalFrames = totalFrames;
window.isPlayerMoving = isPlayerMoving;
window.splitSprites = splitSprites;
