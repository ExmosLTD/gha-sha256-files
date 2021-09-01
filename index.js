const core = require('@actions/core');
const fs = require("fs");
const path = require("path");
const hasha = require('hasha');
const files = core.getInput("files");

const toHashString = (f) => `${path.basename(f).padEnd(30, ' ')} ${hasha(fs.readFileSync(f), {algorithm: "sha256"})}`;

// Recursively get all files in a folder.
function getAllFilesInFolderRecursively(inputFiles) {
     return inputFiles.flatMap(file => 
         fs.statSync(file).isDirectory()
            ? getAllFilesInFolderRecursively(fs.readdirSync(file).map(f => path.join(file, f)))
            : fs.realpathSync(file));
}

try {
    const filesToHash = files.split(" ").map(f => path.join(process.env.GITHUB_WORKSPACE, f));
    console.log("split files");
    var hashResult = getAllFilesInFolderRecursively(filesToHash).map(toHashString).join("\n");
    core.setOutput("hashes", hashResult);
    fs.writeFileSync("released-hashes.txt", hashResult, {encoding: "utf8"});
} catch(error) {
    console.log("error: " + error);
    core.setFailed(error.message);    
}