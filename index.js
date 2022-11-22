
const exec = require('child_process').exec;
const path = require('path');
const process = require('process');
const fs = require("fs");

let currentWorkingDir = process.cwd();
if (process.argv.length > 2) {

    let newPath = path.join(currentWorkingDir, process.argv[2]);
    if (fs.existsSync(newPath)) {
        process.chdir(newPath);

        exec('node index.js', function(error, stdout, stderr){ 
            console.log( stdout ); // output the output of the day program.
            process.cwd(currentWorkingDir);
        });

    } else {
        console.log('Subfolder passed as parameter doesn\'t exist. Path:' + newPath);
    }
} else {
    console.log('No subfolder passed as parameter.');
}

