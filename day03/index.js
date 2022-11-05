var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    const board = lines.map((value) => {
        let retVal = [];
        for(let i = 0; i < value.length; i++) {
            retVal.push(value.charAt(i));
        }
        return retVal;
    })

    part1(board);
    part2(board);
} 

function part1(board) {
    console.log('Processing Part 1...');
    console.log('Value needed by website is [' + treesOnSlope(board, 3, 1) +'].');
}

function part2(board) {
    console.log('Processing Part 2...');
    let xSlopes = [1, 3, 5, 7, 1];
    let ySlopes = [1, 1, 1, 1, 2];
    let treesOnSlopes = [];
    for (let i = 0; i < xSlopes.length; i++) {
        treesOnSlopes[i] = treesOnSlope(board, xSlopes[i], ySlopes[i]);
    }
    let product = 1;
    for (let i = 0; i < treesOnSlopes.length; i++) {
        product = product * treesOnSlopes[i];
    }
    console.log('Value needed by website is [' + (product) +"].");
}

function getMaxY(board) {
    return board.length - 1;  
}

function getMaxX(board) {
    return board[0].length -1;
}

function positionHasTree(board, x, y) {
    let wrappedXPos = x % (getMaxX(board) + 1);
    if (board[y][wrappedXPos] === '#') {
        return true;
    } else if (board[y][wrappedXPos] === '.') {
        return false;
    } else {
        throw new Error('Invalid board state at state:[' + boad[y][wrappedXPos] + 'X:[' + wrappedXPos + "] Y:[" + y +"]");
    }
}

function treesOnSlope(board, xSlope, ySlope) {
    let x = 0;
    let y = 0;
    let treeCount = 0;
    let bottomY = getMaxY(board);
    while (y <= bottomY) {
        if (positionHasTree(board, x, y)) {
            treeCount ++;
        }
        x += xSlope;
        y += ySlope;
    }
    return treeCount;
}

run();