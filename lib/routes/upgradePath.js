/* 
 * This is the code to get the dependencies that need to be upgraded given a JavaScript repository
 */
'use strict'

const express = require('express');
const router = express.Router();
const npmCheck = require('npm-check');
const https = require('https');

const jsonLocation = './input/';
const fs = require("fs");
const getPackage = require('get-repo-package-json');

let result;
let sizeTokens;

/*
 * Retrieve the information of dependencies when given an url to a repo
 */
async function retrieveJson(url) {
    return new Promise(function (resolve, reject) {
        try {
            getPackage(url).then((result) => {
                createFile(result).then(() => {
                    processPackage().then((result) => {
                        resolve(result);
                    }).catch((error) => {
                        reject(error);
                    })
                }).catch((error) => {
                    reject(error);
                })
            }).catch((error) => {
                reject(error);
            })

        } catch (error) {
            // console.log(error);
            reject(error);
        }
    });




}

/*
 * Iterates through input package.json and returns information about dependencies 
 */
function processPackage() {
    return new Promise(function (resolve, reject) {

        let options = { "cwd": jsonLocation };
        npmCheck(options)
            .then(currentState => {
                // console.log(currentState.get('packages'));
                // console.log("Results successfully printed!");
                result = currentState.get('packages');
                resolve(result);
            })
            .catch(err => {
                // console.log(err);
                reject(err)
            });
    });




}
/*
 * Create a new package.json file in input folder
 */
function createFile(repoObject) {
    return new Promise(function (resolve, reject) {
        fs.writeFile("./input/package.json", JSON.stringify(repoObject, null, 4), (err) => {
            if (err) {
                // console.error(err);
                reject(err);
            } else {
                // console.log("File has been created");
                resolve();
            }
        });
    });

}

/*
 * runs bundle-phobia command on list of library names and write it into output.txt then return the tokenized 
 array of contents in output.txt
 */
const exec = require('child_process').exec;
function retrieveSizes(libraries) {

    return new Promise(function (resolve, reject) {
        let command = "bundle-phobia ";
        let outputLoc = " -j > output.txt";
        let child;
        // console.log(libraries);
        for (const lib of libraries) {
            // console.log(lib);
            command += lib + " ";
        }

        command += outputLoc;
        // console.log(command);
        child = exec(command,
            function (error, stdout, stderr) {
                if (error !== null) {
                    // console.log('stdout: ' + stdout);
                    // console.log('stderr: ' + stderr);
                    // console.log('exec error: ' + error);
                    reject('stdout: ' + stdout + ' stderr: ' + stderr + '\nexec error: ' + error);
                }
                // let textByLine;
                let text = fs.readFileSync("output.txt").toString('utf-8');
                sizeTokens = "[" + text.replace(/}[\n]*{/g, "},{") + "]";
                // console.log(sizeTokens);
                resolve(sizeTokens);
            });

    });

}

/*
 * Retrieve the information of all package.json libraries
 */
router.get('/upgrade', (req, res) => {
    res.status = 200;
    // console.log(req.query);
    retrieveJson(req.query.repo).then(() => {
        // console.log(result);
        res.send(result);
    }).catch((error) => {
        res.status = 500;
        res.send(error);
    })
});

/*
 * Retrieve the size information of a list of libraries 
 */
router.get('/size', (req, res) => {
    res.status = 200;
    // console.log(req.query.dep);
    retrieveSizes(JSON.parse(req.query.dep)).then(() => {
        // console.log(sizeTokens);
        res.send(sizeTokens);
    })
        .catch((error) => {
            res.status = 500;
            res.send(error);
        })
});

/*
 * Retrieve the git commit information of the package.json
 */
router.get('/commit_history', (req, res) => {
    res.status = 200;
    sendPostGithub(req.query.repoUser, req.query.repoName).then((result) => {
        res.send(result);
    })
        .catch((error) => {
            res.status = 500;
            res.send(error);
        })
});

/*
 * Makes call to GitHub API to retrieve the commit information of the package.json file on for a repository when
 given the username and repo name
 */
function sendPostGithub(repoUser, repoName) {
    return new Promise(function (resolve, reject) {
        let packagePath = "commits?path=package.json";
        let options = {
            host: 'api.github.com',
            path: '/repos/' + repoUser + '/' + repoName + '/' + packagePath,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        // console.log(options);

        https.get(options, (response) => {
            let data = '';

            // A chunk of data has been received.
            response.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            response.on('end', () => {
                // console.log(JSON.parse(data));
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            // console.log("Error: " + err.message);
            reject(err);
        });

    });
}


module.exports = router;

