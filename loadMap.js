let tiles = [];

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



    DIRECTIONAL TILES



*/

let map = [];

// Randomly generate a map


function generateMap(width, height) {
    var mapWidth = Math.ceil(width / 16);
    var mapHeight = Math.ceil(height / 16);



    for (let row = 0; row < mapWidth; row++) {
        map.push([]); // Push an empty array to the map for each row
        for (let col = 0; col < mapHeight; col++) {
            var firstIndex = Math.floor(Math.random() * 2) + 4;
            var secondIndex;

            // GENERATE ONLY GRASS TILES
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
        [-1, 0] // up
    ];

    function isValidMove(row, col, dr, dc) {
        
        //make sure that the new cell is within the map bounds and the cell is dirt
        const newRow = row + dr;
        const newCol = col + dc;
        const betweenRow = row + dr / 2;
        const betweenCol = col + dc / 2;
        return newRow >= 0 && newRow < map.length && newCol >= 0 && newCol < map[0].length && map[newRow][newCol][0];// === 4 && map[betweenRow][betweenCol][0] === 4;
    }

    function carvePath(row, col, pathLength) {
        
        if(pathLength == 0) {
            return;
        }
        map[row][col][0] = 4;
        map[row][col][1] = 0;
        var direction = Math.floor(Math.random() * moves.length);
        var x = moves[direction][0];
        var y = moves[direction][1];

        if(!isValidMove(row, col, x, y)) {
            return;
        }
        map[row + x][col + y][0] = 4;
        map[row + x][col + y][1] = Math.floor(Math.random());

        if(Math.floor(Math.random() * 1000) < 999) {
            carvePath(row + x, col + y, pathLength-1);
        } else {
            return;
        }
    }

        
    

    // Start the path carving from the player's initial position
    let pathLength = Math.floor(Math.random*100) + 1000;
    carvePath(playerX, playerY, pathLength);
    

}


