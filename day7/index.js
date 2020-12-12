var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');

    let ruleParse = /(.*)\sbags?\scontain\s(\d+.*[,]?)+\./g;
    let childParse = /(\d+)\s(.*)\sbags?/g;
    
    const rules = {};
    const bagNames = [];
    let currentRule = {};
    for(let i = 0; i < lines.length; i++) {
        currentRule = {};
        const matches = [...lines[i].matchAll(ruleParse)];
        for(let i = 0; i < matches.length; i++) {
            const match = matches[i];
            currentRule.ParentBag = match[1];
            if (!bagNames.includes(currentRule.ParentBag)) {
                bagNames.push(currentRule.ParentBag);
            }
            currentRule.PossibleChildren = [];
            let children = match[2].split(', ');
            for(let j = 0; j < children.length; j++) {
                let childMatches = [...children[j].matchAll(childParse)];
                let child = {
                    Quantity: Number.parseInt(childMatches[0][1]),
                    Name: childMatches[0][2]
                };
                if (!bagNames.includes(child.Name)) {
                    bagNames.push(child.Name);
                }
                currentRule.PossibleChildren.push(child);
            }
            rules[currentRule.ParentBag] = currentRule;
        }
    }

    part1(bagNames, rules);
    // part2(groupsAnswers);
} 

function part1(bagNames, rules) {
    console.log('Processing Part 1...');
    let sum = 0;

    for(let i = 0; i < bagNames.length; i++) {
        // console.log(rules[bagNames[i]]);
        if(parentBagCanContainChildBag(bagNames[i], 'shiny gold', rules)) {
            sum ++;
        }
    }

    console.log('Value needed by website is [' + sum + '].');
}

function part2(groupsAnswers) {
    console.log('Processing Part 2...');

    console.log('Value needed by website is [' + sum + "].");
}

function parentBagCanContainChildBag(parentBagName, childBagName, rules) {
    let bagRule = rules[parentBagName];
    if (!bagRule || !bagRule.PossibleChildren) {
        return false;
    } else if (bagRule.PossibleChildren) {
        for (let i = 0; i < bagRule.PossibleChildren.length; i++) {
            let childBag = bagRule.PossibleChildren[i];
            if (childBag.Name === childBagName ||
                    parentBagCanContainChildBag(childBag.Name, childBagName, rules)) {
                return true;
            }
        }
        return false;
    }
}

run();