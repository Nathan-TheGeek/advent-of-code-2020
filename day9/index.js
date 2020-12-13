var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
let preambleLength = 25;

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    const numbers = [];
    for (let i = 0; i < lines.length; i++) {
        numbers[i] = Number.parseInt(lines[i]);
    }
    
    const invalidNumber = part1(numbers);
    part2(numbers, invalidNumber);
} 

function part1(numbers) {
    console.log('Processing Part 1...');
    let invalidNumber = 0;
    let preamble = [];
    
    for (let i = 0; i < numbers.length; i++) {
        let currentNumber = numbers[i];
        if (preamble.length === preambleLength) {
            if (checkNumberIsValid(preamble, currentNumber)) {
                preamble.shift();
            } else {
                invalidNumber = currentNumber;
                break;
            }
        }
        preamble.push(currentNumber);
    }

    console.log('Value needed by website is [' + invalidNumber + '].');
    return invalidNumber;
}

function part2(numbers, invalidNumber) {
    console.log('Processing Part 2...');
    let returnSum = 0;

loop1:
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            let sum = 0;
            let max = numbers[i];
            let min = numbers[i];
            for (let k = i; k <= j; k++) {
                sum += numbers[k];
                if (numbers[k] < min) {
                    min = numbers[k];
                }
                if (numbers[k] > max) {
                    max = numbers[k];
                }
            }
            if (sum === invalidNumber) {
                returnSum = max + min;
                break loop1;
            }
        }
    }

    console.log('Value needed by website is [' + returnSum + "].");
    return returnSum;
}

function checkNumberIsValid(preamble, number) {
    let foundValidNumbers = false;
    for(let i = 0; i < preamble.length; i++) {
        for (let j = i; j < preamble.length; j++) {
            if (preamble[i] + preamble[j] === number) {
                foundValidNumbers = true;
            }
        }
    }
    return foundValidNumbers;
}

run();