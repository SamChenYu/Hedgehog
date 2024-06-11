let tiles = []; // the tileset
let trees = []; // trees decoration
let flowers = []; // flowers decoration

let leaves = []; // particle effects
let coins = []; // collectibles
/*

    CIRCLE TILES
    Top Row
    [0][0] [0][1] [0][2]

    Middle Row  
    [1][0] [1][1] [1][2]

    
    Bottom Row
    [2][0] [2][1] [2][2]

    DIRT TILES
    [4][0] [4][1]
    ctx.drawImage(tiles[4][0], 32, 32, 16, 16);


    GRASS TILES
    [4][2] [4][3]

    [5][0] [5][1] [5][2] [5][3] [5][4]



    DIRECTIONAL DIRT TILES

    Grass top


*/

let map = []; // using the tiles to generate the map
let treesMap = [];
let flowersMap = [];
let leavesMap = [];
let coinsMap = [];
let grassHitbox = []; // this creates rectangles for the grass tiles to block the player


// Randomly generate a map



function generateMap(width, height) {
    var mapWidth = Math.ceil(width / 16);
    var mapHeight = Math.ceil(height / 16);


    for (let row = 0; row < mapWidth; row++) {
        map.push([]); // Push an empty array to the map for each row
        grassHitbox.push([]); // Push an empty array to the grassHitbox for each row
        for (let col = 0; col < mapHeight; col++) {
            grassHitbox[row].push(new Rectangle(row * 16, col * 16, 16, 16)); // Create a rectangle for each grass tile
            var firstIndex = Math.floor(Math.random() * 2) + 4;
            var secondIndex;

            // GENERATE ONLY GRASS TILES THEN DIRT PATH WILL BE GENERATED LATER
            if(firstIndex == 4 ) {
                secondIndex = Math.floor(Math.random() * 2) + 2;
            } else {
                secondIndex = Math.floor(Math.random() * 5);
            
            }
            map[row].push([firstIndex, secondIndex]);
        }
    }
    
}


function generatePaths(playerX, playerY) {
    const moves = [
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
        [-1, 0], // up
        [0, 1], // added for more lateral traversal
        [-1, 0],
        [0, 1],
        [-1, 0],
        [0, 1]
    ];

    function dirtTile() {
        return Math.round(Math.random()) ;
    }

    function isValidMove(row, col, x, y) {
        
        //make sure that the new cell is within the map bounds and the cell is dirt
        const newRow = row + x;
        const newCol = col + y;
        return newRow >= 0 && newRow < map.length && newCol >= 0 && newCol < map[0].length && map[newRow][newCol][0];
    }
    var pathsCreated = 0;


    function carvePath(row, col, depth) {
        if(pathsCreated >= 50 || depth > 20) {
            return;
        }
        
        if(!isValidMove(row,col,0, 0)) {
            return;
        }
        // set the current tile to dirt
        map[row][col][0] = 4;
        map[row][col][1] = dirtTile();
        grassHitbox[row][col] = new Rectangle(0, 0, 0, 0); // remove the grass hitbox

        // randomize the direction
        var direction = Math.floor(Math.random() * moves.length);
        var x = moves[direction][0];
        var y = moves[direction][1];

        if(!isValidMove(row, col, x, y)) {
            return;
        }

        // set the next tile to dirt
        map[row + x][col + y][0] = 4;
        map[row + x][col + y][1] = dirtTile();
        grassHitbox[row+x][col+y] = new Rectangle(0, 0, 0, 0); // remove the grass hitbox
        pathsCreated++;

        // very small chance that a coin is placed here
        if(Math.random() > 0.9) {
            coinsMap.push([row*16, col*16, 0, 0, 0]); // x, y, indexX, collected (unused for now)
        }

        carvePath(row + x, col + y,depth++);
        return;
    }


    // ensure the player is initially surrounded by the path
    function setDirtTile(row, col, x, y) {
        if(isValidMove(row, col, x, y)) {
            map[row + x][col + y][0] = 4;
            map[row + x][col + y][1] = dirtTile();
            grassHitbox[row+x][col+y] = new Rectangle(0, 0, 0, 0); // remove the grass hitbox
            pathsCreated++;
        }
    }
    setDirtTile(playerX, playerY, 0, 0);
    setDirtTile(playerX, playerY, 0, 1);
    setDirtTile(playerX, playerY, 1, 0);
    setDirtTile(playerX, playerY, 0, -1);
    setDirtTile(playerX, playerY, -1, 0);
    setDirtTile(playerX, playerY, 1, 1);
    setDirtTile(playerX, playerY, -1, 1);
    setDirtTile(playerX, playerY, 1, -1);
    setDirtTile(playerX, playerY, -1, -1);
    pathsCreated += 9;


    carvePath(playerX, playerY,1);
    if(pathsCreated < 30) {
        // usually it only generates on one side of the map, so I will generate on the other side as well
        var otherSideX = Math.round(map.length - playerX);
        carvePath(otherSideX, playerY,1);
        if(pathsCreated < 30) {
            generatePaths(otherSideX, playerY,1);
        }

        // connect the path to the otherside
        for(let i = playerX; i < otherSideX; i++) {
            map[i][playerY][0] = 4;
            map[i][playerY][1] = dirtTile();
            grassHitbox[i][playerY] = new Rectangle(0, 0, 0, 0); // remove the grass hitbox
        }
    }

    function getTreeIndex() {
        const values = [0, 1, 2, 3, 7, 8, 9];
        const weights = [1, 1, 0.4, 1, 0.3, 1, 1]; // dead tree and pink tree are rarer than the other normal trees
    
        // Compute the cumulative weights
        const cumulativeWeights = [];
        let sum = 0;
        for (let weight of weights) {
            sum += weight;
            cumulativeWeights.push(sum);
        }
    
        // Generate a random number between 0 and the sum of weights
        const random = Math.random() * sum;
    
        // Find the value corresponding to the random number
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random < cumulativeWeights[i]) {
                return values[i];
            }
        }
    }

    // generate trees and flowers along the grass path

    for(let i=0; i<map.length; i+=2) {
        for(let j=0; j<map[i].length; j+=2) {
            if(map[i][j][0] != 4 && (map[i][j][1] != 0 || map[i][j][1] != 1) && (map[i][j+1][0] != 4 && (map[i][j+1][1] != 0 || map[i][j+1][1] != 1))) {
                if(Math.random()>0.6) {
                    treesMap.push([i*16,j*16, 0, getTreeIndex()]);
                } else if(Math.random() > 0.5) {
                    flowersMap.push([i*16,j*16, Math.floor(Math.random()*2) , Math.floor(Math.random() * 9)]);
                }
                
            }
        }
    }
    
    // push five leaves to fall in the background
    leavesMap = [];
    for(let i=0; i<5; i++) {
        leavesMap.push([Math.floor(Math.random() * width), Math.floor(Math.random() * height), Math.floor(Math.random()*5)]);
    }



}


function resetMap() {
    map = [];
    treesMap = [];
    flowersMap = [];
    coinsMap = [];
    grassHitbox = [];
}


