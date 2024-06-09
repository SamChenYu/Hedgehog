let tiles = [];

/*

    CIRCLE TILES
    Top Row
    [0][0] [0][1] [0][2]
    ctx.drawImage(tiles[0][0], 32, 32, 16, 16);
    ctx.drawImage(tiles[0][1], 48, 32, 16, 16);
    ctx.drawImage(tiles[0][2], 64, 32, 16, 16);

    Middle Row  
    [1][0] [1][1] [1][2]
    ctx.drawImage(tiles[1][0], 32, 48, 16, 16);
    ctx.drawImage(tiles[1][1], 48, 48, 16, 16);
    ctx.drawImage(tiles[1][2], 64, 48, 16, 16);
    
    Bottom Row
    [2][0] [2][1] [2][2]
    ctx.drawImage(tiles[2][0], 32, 64, 16, 16);
    ctx.drawImage(tiles[2][1], 48, 64, 16, 16);
    ctx.drawImage(tiles[2][2], 64, 64, 16, 16);



    DIRT TILES
    [4][0] [4][1]
    ctx.drawImage(tiles[4][0], 32, 32, 16, 16);


    GRASS TILES
    [4][2] [4][3]

    [5][0] [5][1] [5][2] [5][3] [5][4]
*/

let map = [];

// Randomly generate a map


function generateMap() {
    var mapWidth = Math.ceil(width / 16);
    var mapHeight = Math.ceil(height / 16);

    for (let row = 0; row < mapWidth; row++) {
        map.push([]); // Push an empty array to the map for each row
        for (let col = 0; col < mapHeight; col++) {
            let firstIndex = Math.floor(Math.random() * 5); // Random integer 0-10
            let secondIndex = Math.floor(Math.random() * 4); // Random integer 0-4
            map[row].push([firstIndex, secondIndex]);
        }
    }
}

    









