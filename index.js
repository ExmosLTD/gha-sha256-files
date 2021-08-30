import { setFailed } from '@actions/core';
import github from '@actions/github';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import hasha from 'hasha';


try {
    var hashes = {};
    const files = core.getInput("files");

    files.split(" ").forEach(fileName => {
        // for each file we want to sha256 it.
        // read file
        // sha it with hasha and sha256
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

//fs.writeFileSync(core.getInput("file-name"), result, {encoding: "ascii"});