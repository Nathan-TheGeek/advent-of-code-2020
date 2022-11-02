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

    numbers.push(0); // wall joltage.
    numbers.sort((a, b) => a - b);
    numbers.push(numbers[numbers.length -1] + 3); // built in adapter.

    part1(numbers);
    part2(numbers);
} 

function part1(numbers) {
    let count1s = 0;
    let count3s = 0;
    // console.log(numbers);
    for(let i = 0; i < numbers.length - 1; i++) {
        let diff = numbers[i+1] - numbers[i];
        // console.log('Num1:' + numbers[i] + ' Num2:' + numbers[i+1] + ' Diff:' + diff);
        if (diff == 1) {
            count1s ++;
        } else if (diff == 3) {
            count3s ++;
        } else {
            // console.log('diff between ' + numbers[i+1] + ' and ' + numbers[i] + ' is not 1 or 3.');
        }
    }
    // console.log('Differences of 1:' + count1s);
    // console.log('Differences of 3:' + count3s);
    console.log('Part 1 Result: ' + (count1s * count3s));
}

function part2(numbers) {
    numbers.sort((a, b) => b - a);
    console.log("Number Of Possible Combinations:" + getAllPossibleCombinations(numbers).length);
}

function getAllPossibleCombinations(numbers) {
    let allPossibilities = getAllPossibleCombinationsRecursive(numbers);
    let validCombinations = [];
    for(let i = 0; i < allPossibilities.length; i++) {
        let current = allPossibilities[i];
        // filter out all incomplete records.
        if (current[0] == numbers[0] && 
            current[current.length -1] == numbers[numbers.length - 1]) {
                validCombinations.push(current);
        }
    }
}

function getAllPossibleCombinationsRecursive(numbers) {
    if (numbers.length == 1) {
        return [ numbers ];
    } else {
        let combinations = [];
        let subNumbers = numbers.slice();
        let currentNode = subNumbers.shift();
        let childCombinations = getAllPossibleCombinationsRecursive(subNumbers);
        for(let i = 0; i < childCombinations.length; i++) {
            let currentComb = childCombinations[i];
            let diff = currentNode - currentComb[0];
            if (diff == 1 || diff == 2 || diff == 3) {
                let temp = currentComb.slice();
                temp.unshift(currentNode);
                combinations.push(temp);
            }
            if (diff <= 4) {
                combinations.push(currentComb.slice());
            }
        }
        return combinations;
    }
}

run();