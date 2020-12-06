var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

const variableRegex = /([a-zA-z]{1,3}):([#a-zA-Z0-9]+)/g;
const heightRegex = /(\d{2,3})(cm|in)/g;
const hairColorRegEx = /^\#[0-9a-f]{6}$/g;
const eyeColorRegEx = /^(amb|blu|brn|gry|grn|hzl|oth)$/g;
const passportIdRegEx = /^\d{9}$/g;

async function run() {
    console.log('Loading and parsing the input file...');
    const inputString = await fs.readFileAsync('input.txt', 'utf8');
    const lines = inputString.split('\n');
    const parsedPassports = [];
    let currentPassport = getNewPassport();
    while (lines.length > 0) {
        const line = lines.shift();
        if (line.trim() !== "") {
            parseLine(currentPassport, line);
        } else { // newline starts new passport.
            parsedPassports.push(currentPassport);
            currentPassport = getNewPassport();
        }
    }

    part1(parsedPassports);
    part2(parsedPassports);
} 

function part1(parsedPassports) {
    console.log('Processing Part 1...');
    let countValid = 0;
    for (let i = 0; i < parsedPassports.length; i++) {
       if (hasRequiredFields(parsedPassports[i])) {
           countValid ++;
       }
    }
    console.log('Value needed by website is [' + (countValid) +"].");
}

function part2(parsedLines) {
    console.log('Processing Part 2...');
    let countValid = 0;
    for (let i = 0; i < parsedLines.length; i++) {
       if (passportIsValid(parsedLines[i])) {
           countValid ++;
       }
    }
    console.log('Value needed by website is [' + (countValid) +"].");
}

function parseLine(passport, line) {
    const matches = [...line.matchAll(variableRegex)];
    for(let i = 0; i < matches.length; i++) {
        const match = matches[i];
        passport[match[1]] = match[2];
    }
}

function getNewPassport() {
    return {
        byr: undefined,
        iyr: undefined,
        eyr: undefined,
        hgt: undefined,
        hcl: undefined,
        ecl: undefined,
        pid: undefined,
        cid: undefined
    };   
}

function passportIsValid(passport) {
    let valid = hasRequiredFields(passport);
    if (valid) {
        if (valid && !validateYear(passport.byr, 1920, 2002)) {
            valid = false;
        }
        if (valid && !validateYear(passport.iyr, 2010, 2020)) {
            valid = false;
        }
        if (valid && !validateYear(passport.eyr, 2020, 2030)) {
            valid = false;
        }
        if (valid && !validateHeight(passport.hgt)) {
            valid = false;
        }
        if (valid && !validateWithRegex(passport.hcl, hairColorRegEx)) {
            valid = false;
        }
        if (valid && !validateWithRegex(passport.ecl, eyeColorRegEx)) {
            valid = false;
        }
        if (valid && !validateWithRegex(passport.pid, passportIdRegEx)) {
            valid = false;
        }
    }
    return valid;
}

function validateYear(year, min, max) {
    let yearString = year.toString();
    try {
        let yearInt = Number.parseInt(year);
    } catch {
        return false;
    }
    if (yearString.length !== 4) {
        return false;
    } else if (year < min || year > max) {
        return false;
    }
    return true;
}

function validateHeight(height) {
    let match = [...height.matchAll(heightRegex)];
    let valid = true;
    let number = 0;
    if (!match || match.length === 0) {
        valid = false;
    } else {
        number = Number.parseInt(match[0][1]);
    }
    if (valid && match[0][2] !== 'in' && match[0][2] !== 'cm') {
        valid = false;
    }
    if (valid && match[0][2] === 'cm' && (number < 150 || number > 193)) {
        valid = false;
    }
    if (valid && match[0][2] === 'in' && (number < 59 || number > 76)) {
        valid = false;
    }
    return valid
}

function validateWithRegex(string, regex) {
    try {
        let match = [...string.matchAll(regex)];
        if (match && match.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

function hasRequiredFields(passport) {
    return passport.byr !== undefined &&
        passport.iyr !== undefined &&
        passport.eyr !== undefined &&
        passport.hgt !== undefined &&
        passport.hcl !== undefined &&
        passport.ecl !== undefined &&
        passport.pid !== undefined;
}

run();