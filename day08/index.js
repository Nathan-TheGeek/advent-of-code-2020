var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    
    const instructions = [];
    for(let i = 0; i < lines.length; i++) {
        line = lines[i];
        let operation = line.substring(0, 3);
        let posNeg = line.substring(4, 5);
        let value = (posNeg === '+' ? 1: -1) * Number.parseInt(line.substring(5, line.length));
        let currentInstruction = {
            operation: operation,
            value: value
        };
        instructions.push(currentInstruction);
    }
    
    part1(instructions);
    part2(instructions);
} 

function part1(instructions) {
    console.log('Processing Part 1...');

    let found = false;
    let oppPoint = 0;
    let acc = 0;
    let executedInstructions = [];

    while(!found) {
        let currentInstruction = instructions[oppPoint];
        if (!executedInstructions.includes(oppPoint)) {
            let incrementPointVal = 0;
            switch(currentInstruction.operation) {
                case 'nop':
                    incrementPointVal = 1;
                    break;
                case 'acc':
                    acc += currentInstruction.value;
                    incrementPointVal = 1;
                    break;
                case 'jmp':
                    incrementPointVal = currentInstruction.value;
                    break;
            }
            executedInstructions.push(oppPoint);
            oppPoint += incrementPointVal;
        } else {
            found = true;
        }
    }

    console.log('Value needed by website is [' + acc + '].');
}

function part2(instructions) {
    console.log('Processing Part 2...');
    let retVal = 0;

    let possibleOperatorsToFlip = [];
    for(let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];
        if (instruction.operation === 'nop' || instruction.operation === 'jmp') {
            possibleOperatorsToFlip.push(i);
        }
    }
    
    for (let x = 0; x < possibleOperatorsToFlip.length; x++) {
        let previousOp = instructions[possibleOperatorsToFlip[x]].operation;

        if (previousOp === 'jmp') {
            instructions[possibleOperatorsToFlip[x]].operation = 'nop';
        } else if (previousOp === 'nop') {
            instructions[possibleOperatorsToFlip[x]].operation = 'jmp';
        }

        let found = false;
        let oppPoint = 0;
        let acc = 0;
        let executedInstructions = [];

        while(!found && oppPoint < instructions.length) {
            let currentInstruction = instructions[oppPoint];
            if (!executedInstructions.includes(oppPoint)) {
                let incrementPointVal = 0;
                switch(currentInstruction.operation) {
                    case 'nop':
                        incrementPointVal = 1;
                        break;
                    case 'acc':
                        acc += currentInstruction.value;
                        incrementPointVal = 1;
                        break;
                    case 'jmp':
                        incrementPointVal = currentInstruction.value;
                        break;
                }
                executedInstructions.push(oppPoint);
                oppPoint += incrementPointVal;
            } else {
                found = true;
            }
        }
        if (found) {
            instructions[possibleOperatorsToFlip[x]].operation = previousOp; 
        } else if (oppPoint === instructions.length) {
            retVal = acc;
            break;
        }
    }

    console.log('Value needed by website is [' + retVal + "].");
}

run();