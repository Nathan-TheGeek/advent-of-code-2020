var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');

    let ruleParse = /(.*)\sbags?\scontain\s(.*[,]?)+\./g;
    let childParse = /(\d+)\s(.*)\sbags?/g;
    
    const rules = {};
    const bagNames = [];
    let currentRule = {};
    for(let i = 0; i < lines.length; i++) {
        currentRule = {};
        const matches = [...lines[i].matchAll(ruleParse)];
        const match = matches[0];
        currentRule.ParentBag = match[1];
        if (!bagNames.includes(currentRule.ParentBag)) {
            bagNames.push(currentRule.ParentBag);
        }
        currentRule.PossibleChildren = [];
        let children = match[2].split(', ');
        for(let k = 0; k < children.length; k++) {
            if (children[k] !== 'no other bags') {
                let childMatches = [...children[k].matchAll(childParse)];
                let child = {
                    Quantity: Number.parseInt(childMatches[0][1]),
                    Name: childMatches[0][2]
                };
                if (!bagNames.includes(child.Name)) {
                    bagNames.push(child.Name);
                }
                currentRule.PossibleChildren.push(child);
            }
        }
        rules[currentRule.ParentBag] = currentRule;
    }

    part1(bagNames, rules);
    part2(rules);
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

function part2(rules) {
    console.log('Processing Part 2...');
    let sum = getTotalChildBags('shiny gold', rules);
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

function getTotalChildBags(bagName, rules) {
    let rule = rules[bagName];
    let sum = 0;
    for(let i = 0; i < rule.PossibleChildren.length; i++) {
        let childBag = rule.PossibleChildren[i];
        let countChildBags = getTotalChildBags(childBag.Name, rules);
        sum += countChildBags * childBag.Quantity + childBag.Quantity;
    }
    return sum;
}

run();