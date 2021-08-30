const core = require('@actions/core');
const fs = require("fs");
const path = require("path");
const hasha = require('hasha');
const files = core.getInput("files");

try {
    var hashes = {};   
    files.split(" ").forEach(fileName => {
        const filePath = path.join(process.env.GITHUB_WORKSPACE, fileName);
        if (!fs.existsSync(filePath)) {
            console.log(` - ${fileName} (Not Found)`);
            return;
        }
        hashes[fileName] = hasha(fs.readFileSync(filePath), {algorithm: "sha256"});
    })
    var result = "";
    for(const k in hashes) {
        result += hashes[k] + " " + k + "\n";
    }
    core.setOutput("hashes", result);
    fs.writeFileSync("released-hashes.txt", result, {encoding: "utf8"});
} catch(error) {
    setFailed(error.message);
}