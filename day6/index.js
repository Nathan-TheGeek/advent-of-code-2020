var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    const groupsAnswers = [];
    let currentGroup = [];
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === "") {
            groupsAnswers.push(currentGroup);
            currentGroup = [];
            continue;
        }
        // union the existing answers with the new lines answers converting into char array.
        currentGroup.push(new Set([...line]));
    }
    groupsAnswers.push(currentGroup);

    part1(groupsAnswers);
    part2(groupsAnswers);
} 

function part1(groupsAnswers) {
    console.log('Processing Part 1...');

    let sum = 0;
    for(let i = 0; i < groupsAnswers.length; i++) {
        let set = new Set();
        for (let j = 0; j < groupsAnswers[i].length; j++) {
            let temp = [...(groupsAnswers[i][j])];
            for (let k = 0; k < temp.length; k++) {
                set.add(temp[k]);
            }
        }
        sum += [...set].length;
    }
    console.log('Value needed by website is [' + sum + '].');
}

function part2(groupsAnswers) {
    console.log('Processing Part 2...');

    let sum = 0;
    for(let i = 0; i < groupsAnswers.length; i++) {
        let sets = [];
        for(let j  = 0; j < groupsAnswers[i].length; j++) {
            sets.push(groupsAnswers[i][j]);
        }
        let intersection = setIntersection(sets);
        sum += [...intersection].length;
    }

    console.log('Value needed by website is [' + sum + "].");
}

function setIntersection(sets) {
    if (!sets || sets.length === 0) {
        return null;
    } else if (sets.length === 1) {
        let temp = sets[0];
        return [...temp];
    } else {
        var intersection = [...sets[0]];
        for(let i = 1; i < sets.length; i++) {
            intersection = intersection.filter(x => sets[i].has(x));
        }
        return intersection;
    }
}

run();