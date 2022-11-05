var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

const FLOOR_TILE = '.';
const OCCUPIED_TILE = '#';
const UNOCCUPIED_TILE = 'L';

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    let seatingChart = [];
    for (let i = 0; i < lines.length; i++) {
        seatingChart[i] = lines[i].split('');
    }

    part1(seatingChart);
} 

function part1(seatingChart) {
    let different = true;
    let previousSeatingChart = seatingChartToString(seatingChart);
    let count = 0;
    while(different) {
        console.log(previousSeatingChart);
        console.log('='.repeat(seatingChart[0].length + 1));
        let changes = [];
        // calculate changes.
        for (let row = 0; row < seatingChart.length; row++) {
            for (let col = 0; col < seatingChart[row].length; col++) {
                let currentTile = getTileValueProtected(seatingChart, row, col);
                let occupiedAdjacentCount = getOccupiedSeatCountAroundSeat(seatingChart, row, col);
                if (currentTile == UNOCCUPIED_TILE) {
                    if (occupiedAdjacentCount == 0) {
                        changes.push({row: row, col: col, value: OCCUPIED_TILE});
                    }
                } else if (currentTile == OCCUPIED_TILE) {
                    if (occupiedAdjacentCount >= 4) {
                        changes.push({row: row, col: col, value: UNOCCUPIED_TILE});
                    }
                }
            }
        }
        performChanges(seatingChart, changes);
        count++;
        let currentSeatingChart = seatingChartToString(seatingChart);
        different = changes.length > 0;
        previousSeatingChart = currentSeatingChart;
    }
    console.log("Part 1 - Occupied Seats at End:" + countOccupiedSeats(seatingChart) + " NumOfIterations:" + count);
}

function countOccupiedSeats(seatingChart) {
    let count = 0;
    for (let row = 0; row < seatingChart.length; row++) {
        for (let col = 0; col < seatingChart[row].length; col++) {
            if (getTileValueProtected(seatingChart, row, col) == OCCUPIED_TILE) {
                count ++;
            }
        }
    }
    return count;
}

function performChanges(seatingChart, changes) {
    for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        setTileValueProtected(seatingChart, change.row, change.col, change.value);
    }
}

function getOccupiedSeatCountAroundSeat(seatingChart, row, col) {
    return getSurroundingTileCountOfType(seatingChart, row, col, OCCUPIED_TILE);
}

function getSurroundingTileCountOfType(seatingChart, row, col, type) {
    let count = 0;
    // previous row
    count += getTileValueProtected(seatingChart, row-1, col-1) == type ? 1 : 0;
    count += getTileValueProtected(seatingChart, row-1, col) == type ? 1 : 0;
    count += getTileValueProtected(seatingChart, row-1, col+1) == type ? 1 : 0;
    // current row
    count += getTileValueProtected(seatingChart, row, col-1) == type ? 1 : 0;
    count += getTileValueProtected(seatingChart, row, col+1) == type ? 1 : 0;
    // next row
    count += getTileValueProtected(seatingChart, row+1, col-1) == type ? 1 : 0;
    count += getTileValueProtected(seatingChart, row+1, col) == type ? 1 : 0;
    count += getTileValueProtected(seatingChart, row+1, col+1) == type ? 1 : 0;
    return count
}

function getTileValueProtected(seatingChart, row, col) {
    // return floor tiles as they are not counted for anything.
    if (row < 0 || row >= seatingChart.length) { // row out of bounds.
        return FLOOR_TILE;
    } else if (col < 0 || col >= seatingChart[row].length) { // col out of bounds.
        return FLOOR_TILE;
    } else {
        return seatingChart[row][col];
    }
}

function setTileValueProtected(seatingChart, row, col, value) {
    let currentValue = getTileValueProtected(seatingChart, row, col);
    // Floor tiles can't be changed and that is what is returned if outside bounds.
    if (currentValue != FLOOR_TILE) { 
        seatingChart[row][col] = value;
    }
}

function seatingChartToString(seatingChart) {
    let seatingChartString = '';
    for (let row = 0; row < seatingChart.length; row++) {
        for (let col = 0; col < seatingChart[row].length; col++) {
            seatingChartString += seatingChart[row][col];
        }
        // remove trailing newline.
        if (row < seatingChart.length -1) {
            seatingChartString += '\n';
        }
    }
    return seatingChartString;
}

run();