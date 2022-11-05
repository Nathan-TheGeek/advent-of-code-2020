var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

// regex of the line used for parsing
var lineRegExpression = /(\d+)-(\d+) ([A-Za-z])\: ([A-Za-z]+)/;

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    const parsedLines = lines.map((value) => {
        return parseLine(value);
    });

    part1(parsedLines);
    part2(parsedLines);
} 

function part1(parsedLines) {
    console.log('Processing Part 1...');
    let countValid = 0;
    for (let i = 0; i < parsedLines.length; i++) {
       if (passwordIsValidPart1(parsedLines[i])) {
           countValid ++;
       }
    }
    console.log('Value needed by website is ' + countValid);
}

function part2(parsedLines) {
    console.log('Processing Part 2...');
    let countValid = 0;
    for (let i = 0; i < parsedLines.length; i++) {
       if (passwordIsValidPart2(parsedLines[i])) {
           countValid ++;
       }
    }
    console.log('Value needed by website is ' + (countValid) +"].");
}

function parseLine(line) {
    match = lineRegExpression.exec(line);
    if (match) {
        retVal = {
            lowerCount: match[1],
            upperCount: match[2],
            letter: match[3],
            password: match[4]
        };
        // console.log(retVal);
        return retVal;
    } else {
        return null;
    }    
}

function passwordIsValidPart1(parsedLine) {
    let countOfRelevantCharacter = 0;
    for(let i = 0; i < parsedLine.password.length; i++) {
        if (parsedLine.password.charAt(i) === parsedLine.letter) {
            countOfRelevantCharacter ++;
        }
    }
    return countOfRelevantCharacter >= parsedLine.lowerCount && countOfRelevantCharacter <= parsedLine.upperCount;
}

function passwordIsValidPart2(parsedLine) {
    try {
        return myXOR(parsedLine.password.charAt(parsedLine.lowerCount -1) === parsedLine.letter ,
            parsedLine.password.charAt(parsedLine.upperCount -1) === parsedLine.letter);
    } catch (e) {
        return false;
    }
}
function myXOR(a,b) {
    return ( a || b ) && !( a && b );
}

run();