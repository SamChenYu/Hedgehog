// basically contains all the main methods and global variables that are used in the game

let canvas, ctx, width, height;
let hedgehogImg, slimeImg, tileImg, treesImg, flowersImg, leavesImg;
let keysPressed = {};
const animationSpeed = 8;


// Constructor // main method
window.onload = function() {
    canvas = document.getElementById('canvas');
    height = canvas.height;
    width = canvas.width;
    ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    // loadPlayer.js
    hedgehogImg = new Image();
    hedgehogImg.onload = function() {
        splitSpritesheet(hedgehogImg, 4, 4, 32, 32).then(function(result) {
            splitSprites(result);
        }).catch(function(error) {
            console.error('Error splitting hedgehog spritesheet:', error);
        });
    };
    
    hedgehogImg.src = 'assets/hedgehog.png';
    randomizePlayerPosition(width, height);

    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.key];
    });








    // loadEnemy.js
    slimeImg = new Image();
    slimeImg.onload = function() {
        splitSpritesheet(slimeImg, 8, 5, 32, 32).then(function(result) {
            slimeSprites = result;
        }).catch(function(error) {
            console.error('Error splitting slime spritesheet:', error);
        });
    };
    slimeImg.src = 'assets/slime.png';


    // load the map assets


    treesImg = new Image();
    treesImg.onload = function() {
        splitSpritesheet(treesImg, 1, 10, 32, 32).then(function(result) {
            trees = result;
        }).catch(function(error) {
            console.error('Error splitting tree spritesheet:', error);
        });
    }
    treesImg.src = 'assets/Trees.png';

    flowersImg = new Image();
    flowersImg.onload = function() {
        splitSpritesheet(flowersImg, 2, 10, 16, 16).then(function(result) {
            flowers = result;
        }).catch(function(error) {
            console.error('Error splitting flower spritesheet:', error);
        });
    }
    flowersImg.src = 'assets/Flowers.png';

    tileImg = new Image();
    tileImg.onload = function() {
        splitSpritesheet(tileImg, 11, 7, 16, 16).then(function(result) {
            tiles = result;
            startGameLoop();
        }).catch(function(error) {
            console.error('Error splitting tile spritesheet:', error);
        });
    };
    tileImg.src= 'assets/TilesetFloor.png';
    generateMap(width, height);
    generatePaths(Math.ceil(playerX/16), Math.ceil(playerY/16));



    leavesImg = new Image();
    leavesImg.onload = function() {
        splitSpritesheet(leavesImg, 1, 6, 12, 7).then(function(result) {
            leaves = result;
        }).catch(function(error) {
            console.error('Error splitting leaves spritesheet:', error);
        });
    };
    leavesImg.src = 'assets/LeafPink.png';


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

