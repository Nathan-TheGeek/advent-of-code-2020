var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

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
    console.log("Part 2 Results:" + countAllPossibleCombinations(numbers));
}

function countAllPossibleCombinations(numbers) {
    let allPossibilities = countAllPossibleCombinationsRecursive(numbers);
    for(let i = 0; i < allPossibilities.length; i++) {
        let current = allPossibilities[i];
        // return correct record count.
        if (current.startsWith == numbers[0] && 
            current.endsWith == numbers[numbers.length - 1]) {
                return current.count;
        }
    }
    throw new Error('proper path not found through the adapters.');
}

function countAllPossibleCombinationsRecursive(numbers) {
    if (numbers.length == 1) {
        return insertOrUpdate([], {startsWith: numbers[0], endsWith: numbers[0], count: 1});
    } else {
        let subNumbers = numbers.slice();
        let currentNode = subNumbers.shift();
        let childCombinations = countAllPossibleCombinationsRecursive(subNumbers);
        for(let i = 0; i < childCombinations.length; i++) {
            let currentComb = childCombinations[i];
            let diff = currentComb.startsWith - currentNode;
            if (diff == 1 || diff == 2 || diff == 3) {
                insertOrUpdate(childCombinations, {startsWith: currentNode, endsWith: currentComb.endsWith, count: currentComb.count})
            }
        }
        return childCombinations;
    }
}

function insertOrUpdate(list, value) {
    for(let i = 0; i < list.length; i++) {
        if (value.startsWith === list[i].startsWith) {
            list[i].count += value.count;
            return;
        }
    }
    list.push(value);
    return list;
}

run();