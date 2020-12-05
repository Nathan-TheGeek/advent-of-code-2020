var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));


async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    const integers = [];
    for (let i = 0; i < lines.length; i++) {
        let temp = Number.parseInt(lines[i]);
        if (Number.isNaN(temp)) {
            throw new Error('Something was unable to be parsed. Line Number:' + (i +1));
        }
        integers[i] = temp;
    }

    part1(integers);
    part2(integers);
} 

function part1(integers) {
    console.log('Processing Part 1...');

    let val1Index = 0;
    let val2Index = 0;
    
    mainLoop:
    for (let i = 0; i < integers.length; i++) {
        // console.log('Considering Line: ' + (i+1));
        let value1 = integers[i];
        for (let j = 0; j < integers.length; j++) {
            let value2 = integers[j];
            if (value1 + value2 === 2020) {
                val1Index = i;
                val2Index = j;
                // break out of loops.
                // console.log('should break found Lines:' + (val1Index + 1) + ' & ' + (val2Index + 1));
                break mainLoop;
            }
        }
    }

    console.log('Value needed by website is ' + (integers[val1Index] * integers[val2Index]));
}

function part2(integers) {


    console.log('Processing Part 2...');
    let val1Index = 0;
    let val2Index = 0;
    let val3Index = 0;
    
    mainLoop:
    for (let i = 0; i < integers.length; i++) {
        // console.log('Considering Line: ' + (i+1));
        let value1 = integers[i];
        for (let j = 0; j < integers.length; j++) {
            let value2 = integers[j];
            for (let k = 0; k < integers.length; k++) {
                let value3 = integers[k];
                if (value1 + value2 + value3 === 2020) {
                    val1Index = i;
                    val2Index = j;
                    val3Index = k;
                    // break out of loops.
                    // console.log('should break found Lines:' + (val1Index + 1) + ', ' + (val2Index + 1) + ', and '+ (val3Index + 1));
                    break mainLoop;
                }
            }
        }
    }

    console.log('Value needed by website is ' + (integers[val1Index] * integers[val2Index] * integers[val3Index]));
}

run();