var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

const NORTH_NUM = 0;
const EAST_NUM = 1;
const SOUTH_NUM = 2;
const WEST_NUM = 3;const NORTH = 'N';
const SOUTH = 'S';
const EAST = 'E';
const WEST = 'W';
const LEFT = 'L';
const RIGHT = 'R';
const FORWARD = 'F';

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');

    parsedCommands = parseCommands(lines);

    part1(parsedCommands);
    part2();
}

function part1(commands) {
    let boat = new Boat(0, 0, EAST);
    for(let i = 0; i < commands.length; i++) {
        boat.runCommand(commands[i]);
    }
    console.log('Part 1 - Manhattan Distance:' + boat.getDistanceFromStart());
}

function part2() {

}

function parseCommands(lines) {
    let commands = [];
    for (let i = 0; i < lines.length; i++) {
        commands.push(new Command(lines[i]));
    }
    return commands;
}

class Boat {
    constructor(xPos, yPos, dir) {
        this.x = xPos;
        this.xStart = xPos;
        this.y = yPos;
        this.yStart = yPos;
        this.dirNum = this.convertDirectionLetterToNumber(dir);
    }

    runCommand(command) {
        if (command instanceof Command) {
            let distance = 0;
            // this.logCurrentState();
            switch (command.Direction) {
                case FORWARD: // move in the direction facing.
                    // just run it as a command in that direction. No need to reimplement.
                    this.runCommand(
                        new Command(this.convertDirectionNumberToLetter(this.dirNum) + command.Distance)
                        );
                    break;
                case NORTH: // positive y
                    this.y += command.Distance;
                    break;
                case SOUTH: // negative y
                    this.y -= command.Distance;
                    break;
                case EAST: // positive x
                    this.x += command.Distance;
                    break;
                case WEST: // negative x
                    this.x -= command.Distance;
                    break;
                case RIGHT: // clockwise rotation
                    distance = command.Distance / 90;
                    this.dirNum = (this.dirNum + distance) % 4;
                    break;
                case LEFT: // counterclockwise rotation
                    distance = 4 - (command.Distance / 90);
                    this.dirNum = (this.dirNum + distance) % 4;
                    break;
            }
            // this.logCurrentState();
        } else {
            throw new Error('Unknown Command');
        }
    }

    logCurrentState() {
        console.log("Direction:" + this.convertDirectionNumberToLetter(this.dirNum) + " X:" + this.x + " Y:" + this.y);
    }

    getDistanceFromStart() {
        return Math.abs(this.xStart - this.x) + Math.abs(this.yStart - this.y);
    }

    convertDirectionLetterToNumber(dir) {
        switch (dir) {
            case NORTH:
                return NORTH_NUM;
            case EAST:
                return EAST_NUM;
            case SOUTH:
                return SOUTH_NUM;
            case WEST:
                return WEST_NUM;
        }
    }

    convertDirectionNumberToLetter(dirNum) {
        switch (dirNum) {
            case NORTH_NUM:
                return NORTH;
            case EAST_NUM:
                return EAST;
            case SOUTH_NUM:
                return SOUTH;
            case WEST_NUM:
                return WEST;
        }
    }
}

class Command {
    constructor(commandLine) {
        this.Direction = commandLine.substring(0, 1);
        this.Distance = parseInt(commandLine.substring(1));
    }
}

run();