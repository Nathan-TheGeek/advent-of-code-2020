var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

const FLOOR_TILE = '.';
const OCCUPIED_TILE = '#';
const UNOCCUPIED_TILE = 'L';

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    let seatingChartPart1 = [];
    for (let i = 0; i < lines.length; i++) {
        seatingChartPart1[i] = lines[i].split('');
    }

    let seatingChartPart2 = [];
    for (let i = 0; i < lines.length; i++) {
        seatingChartPart2[i] = lines[i].split('');
    }

    part1(seatingChartPart1);
    part2(seatingChartPart2);
} 

function part1(seatingChart) {
    let different = true;
    let previousSeatingChart = seatingChartToString(seatingChart);
    while(different) {
        // console.log(previousSeatingChart);
        // console.log('='.repeat(seatingChart[0].length + 1));
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
        let currentSeatingChart = seatingChartToString(seatingChart);
        different = changes.length > 0;
        previousSeatingChart = currentSeatingChart;
    }
    console.log("Part 1 - Occupied Seats at End:" + countOccupiedSeats(seatingChart));
}

function part2(seatingChart) {
    let different = true;
    let previousSeatingChart = seatingChartToString(seatingChart);
    while(different) {
        // console.log(previousSeatingChart);
        // console.log('='.repeat(seatingChart[0].length + 1));
        let changes = [];
        // calculate changes.
        for (let row = 0; row < seatingChart.length; row++) {
            for (let col = 0; col < seatingChart[row].length; col++) {
                let currentTile = getTileValueProtected(seatingChart, row, col);
                let occupiedAdjacentCount = getOccupiedSeatCountAdjacent(seatingChart, row, col);
                if (currentTile == UNOCCUPIED_TILE) {
                    if (occupiedAdjacentCount == 0) {
                        changes.push({row: row, col: col, value: OCCUPIED_TILE});
                    }
                } else if (currentTile == OCCUPIED_TILE) {
                    if (occupiedAdjacentCount >= 5) {
                        changes.push({row: row, col: col, value: UNOCCUPIED_TILE});
                    }
                }
            }
        }
        performChanges(seatingChart, changes);
        let currentSeatingChart = seatingChartToString(seatingChart);
        different = changes.length > 0;
        previousSeatingChart = currentSeatingChart;
    }
    let occupiedSeats = countOccupiedSeats(seatingChart);
    console.log("Part 2 - Occupied Seats at End:" + occupiedSeats)
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

function getOccupiedSeatCountAdjacent(seatingChart, row, col) {
    let values = [];
    // top left 0
    for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
        let value = getTileValueProtected(seatingChart, row - i, col - i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[0] = value;
            break;
        }
    }
    // top 1
    for (let i = 1; row - i >= 0; i++) {
        let value = getTileValueProtected(seatingChart, row - i, col);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[1] = value;
            break;
        }
    }
    // top right 2
    for (let i = 1; row - i >= 0 && col + i < seatingChart[row - i].length; i++) {
        let value = getTileValueProtected(seatingChart, row - i, col + i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[2] = value;
            break;
        }
    }
    // right 3
    for (let i = 1; col + i < seatingChart[row].length; i++) {
        let value = getTileValueProtected(seatingChart, row, col + i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[3] = value;
            break;
        }
    }
    // bottom right 4
    for (let i = 1; row + i < seatingChart.length && col + i < seatingChart[row+i].length; i++) {
        let value = getTileValueProtected(seatingChart, row + i, col + i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[4] = value;
            break;
        }
    }
    // bottom 5
    for (let i = 1; row + i < seatingChart.length; i++) {
        let value = getTileValueProtected(seatingChart, row + i, col);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[5] = value;
            break;
        }
    }
    // bottom left 6
    for (let i = 1; row + i < seatingChart.length && col - i >= 0; i++) {
        let value = getTileValueProtected(seatingChart, row + i, col - i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[6] = value;
            break;
        }
    }
    // left 7
    for (let i = 1; col - i >= 0; i++) {
        let value = getTileValueProtected(seatingChart, row, col - i);
        if (value == OCCUPIED_TILE || value == UNOCCUPIED_TILE) {
            values[7] = value;
            break;
        }
    }
    let count = 0;
    for (let i = 0; i < values.length; i++) {
        if (values[i] == OCCUPIED_TILE) {
            count++;
        }
    }
    return count;
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