var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');


    part1(lines);
    part2(lines);
} 

function part1(lines) {
    console.log('Processing Part 1...');
    let maxId = 0;
    for(let i = 0; i < lines.length; i++) {
        const moves = getMovesFromLine(lines[i]);
        const cord = convertMovesToSeatCordinates(moves);
        const id = convertSeatCordsToSeatId(cord);
        if (id > maxId) {
            maxId = id;
        }
    }
    console.log('Value needed by website is [' + maxId + '].');
}

function part2(lines) {
    console.log('Processing Part 2...');
    let plane = [];
    for(let i = 0; i < lines.length; i++) {
        const moves = getMovesFromLine(lines[i]);
        const cord = convertMovesToSeatCordinates(moves);
        const id = convertSeatCordsToSeatId(cord);
        plane[id] = cord;
    }
    let mySeat = 0;
    for (let  i = 0; i < plane.length; i++) {
        if (plane[i] === undefined && plane[i-1] !== undefined && plane[i+1] !== undefined) {
            mySeat = i;
            break;
        }
    }
    console.log('Value needed by website is [' + mySeat + "].");
}

function getMovesFromLine(line) {
    let retVal = [];
    for(let i = 0; i < line.length; i++) {
        retVal.push(line.charAt(i));
    }
    return retVal;
}

function convertMovesToSeatCordinates(moves) {
    let rowLower = 0;
    let rowUpper = 127;
    let colLower = 0;
    let colUpper = 7;
    let row = undefined;
    let col = undefined;
    for(let i = 0; i < moves.length; i++) {
        if (moves[i] === "F") {
            const diff = rowUpper - rowLower;
            if (diff === 1) {
                row = rowLower;
            } else {
                rowUpper = rowUpper - Math.ceil(diff / 2);
            }
        } else if (moves[i] === "B") {
            const diff = rowUpper - rowLower;
            if (diff === 1) {
                row = rowUpper;
            } else {
                rowLower = rowLower + Math.ceil(diff / 2);
            }
        } else if (moves[i] === "L") {
            const diff = colUpper - colLower;
            if (diff === 1) {
                col = colLower;
            } else {
                colUpper = colUpper - Math.ceil(diff / 2);
            }
        } else if (moves[i] === "R") {
            const diff = colUpper - colLower;
            if (diff === 1) {
                col = colUpper;
            } else {
                colLower = colLower + Math.ceil(diff / 2);
            }
        }
        // debug statement to see what is going on step by step
        // console.log("move:[" + moves[i] + "] row:[" + row + "] col:[" + col +
        //     "] rowLower:[" + rowLower + "] RowUpper:[" + rowUpper + 
        //     "] colLower:[" + colLower + "] colUpper:[" + colUpper + "]");
    }
    return { row: row, col: col };
}

function convertSeatCordsToSeatId(cord) {
    return cord.row * 8 + cord.col;
}


run();