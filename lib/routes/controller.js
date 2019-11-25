var exports = module.exports = {};
const Octokit = require("@octokit/rest");
const ylParser = require('parse-yarn-lock').default
const octokit = new Octokit();

var ylPath = "";
var pkgJsonPath = "";
var currentRepo = ""
var dependenciesNodes = {"dependency":[],"devDependency":[]}
var ylfinaldep = {"dependency":[] , "devDependency":[]};
var fileTree = { "name": "default", "type": "directory", "subfile": [] };
exports.fileTree = fileTree;
var a = false;

/* Read package json and return a list of dependencies */
exports.readPkgJson = function(repoPath) {
  var pathComponents = repoPath.split("/")

  console.log("path1" + pkgJsonPath)
  if (pkgJsonPath === "") {
    return Error("Cannot find package.json")
  } else {
    return octokit.repos
      .getContents({
        owner: pathComponents[3],
        repo: pathComponents[4],
        path: pkgJsonPath
      })
      .then(result => {
        const content = Buffer.from(result.data.content, "base64").toString()
        var temp = JSON.parse(content)
        dependenciesNodes = { dependency: [], devDependency: [] }
        var dependencies = temp["dependencies"]
        for (var i = 0; i < Object.keys(dependencies).length; i++) {
          var key = Object.keys(dependencies)[i]
          var node = { name: key, version: dependencies[key] }
          dependenciesNodes["dependency"].push(node)
        }

        var devDependencies = temp["devDependencies"]
        for (var i = 0; i < Object.keys(devDependencies).length; i++) {
          var key = Object.keys(devDependencies)[i]
          var node = { name: key, version: devDependencies[key] }
          dependenciesNodes["devDependency"].push(node)
        }
        console.log(dependenciesNodes)
        console.log("new change here")
        return dependenciesNodes
      })
      .catch(error => {
        reject(error)
      })
  }
}

/* Read Yarn.lock file and analyze subdependencies and return a list*/
/* readYL has to be run after readPkgJson */
exports.readYL = function (repoPath) {
  //var repoPath = "https://github.com/MalcolmChen97/React-Native-SmallApps";
  var pathComponents = repoPath.split("\/");
  // for (var i=0;i<pathComponents.length;i++){
  //     console.log(pathComponents[i]);
  // }
  if (ylPath === ""){
    return Error("can't find yarn.lock");
  }else {
  return octokit.repos.getContents({
    owner: pathComponents[3],
    repo: pathComponents[4],
    path: ylPath
  }).then(result => {
    // content will be base64 encoded
    var yldepenceiesNodes = [];
    const content = Buffer.from(result.data.content, 'base64').toString();
    var yldependencies = ylParser(content)
    // The object has two keys: "type", "object". "type" has nothing in it. 
    // "object" contains all dependencies we want
    var objectkey = Object.keys(yldependencies)[1] // object
    var innerDependencies = yldependencies[objectkey]
    for (var i = 0; i < Object.keys(innerDependencies).length; i++) {
      var key = Object.keys(innerDependencies)[i];
      //console.log(innerDependencies[key]);
      var sub_dep = null;
      try {
        var sub_dep = innerDependencies[key]["dependencies"]
      } catch (err) {
        //console.log("no dependencies");
      }
      var sub_dependencyList = [];
      if (sub_dep !== undefined) {
        for (var j = 0; j < Object.keys(sub_dep).length; j++) {
          var sub_key = Object.keys(sub_dep)[j];
          var node = { "name": sub_key, "version": sub_dep[sub_key] };
          sub_dependencyList.push(node);
        }
      }
      //console.log(sub_dependencyList)
      var cutKey = key.substring(0, key.lastIndexOf("@"));
      var ylnode = { "name": cutKey, "version": innerDependencies[key]["version"], "sub-dependencies": sub_dependencyList };
      yldepenceiesNodes.push(ylnode);
    }
    //console.log(ylnode);
    //Only save sub dependencies for the second level
    return this.readPkgJson(repoPath).then(dpNodes => {
      ylfinaldep = {"dependency":[] , "devDependency":[]};
      console.log(yldepenceiesNodes.length)
    
      for (var i = 0; i < dpNodes["dependency"].length; i++) {
        var check = 0;
        var dpversion = dpNodes["dependency"][i]["version"].replace("^","");
        for (var j = 0; j < yldepenceiesNodes.length; j++) {
          var ylversion = yldepenceiesNodes[j]["version"].replace("^","");
          if ((yldepenceiesNodes[j]["name"] === dpNodes["dependency"][i]["name"]) &&
            ( dpversion === ylversion)) {
            ylfinaldep["dependency"].push(yldepenceiesNodes[j]);
            check = 1;
          }
        }
        if (check == 0){
          var emptynode = {"name":dpNodes["dependency"][i]["name"],"version":dpversion,"sub-dependencies":[]}
          ylfinaldep["dependency"].push(emptynode)
        }
      }
      for (var i = 0; i < dpNodes["devDependency"].length; i++) {
        var check = 0;
        var dpversion = dpNodes["devDependency"][i]["version"].replace("^","");
        for (var j = 0; j < yldepenceiesNodes.length; j++) {
          var ylversion = yldepenceiesNodes[j]["version"].replace("^","");
          if ((yldepenceiesNodes[j]["name"] === dpNodes["devDependency"][i]["name"]) &&
            (dpversion === ylversion)) {
            ylfinaldep["devDependency"].push(yldepenceiesNodes[j]);
            check = 1
          }
        }
        if (check == 0){
          var emptynode = {"name":dpNodes["devDependency"][i]["name"],"version":dpversion,"sub-dependencies":[]}
          ylfinaldep["devDependency"].push(emptynode)
        }
      }
      return ylfinaldep
    }).catch((error) => {
      reject(error);
  })

    //console.log(yldepenceiesNodes)

  }).catch((error) => {
    reject(error);
})
  }
};



/* Analyze the repo structure and create a file tree */
/* Analyze the dependency for each js file and add it to file tree */
exports.readRepo = function(repoPath) {
  var pathComponents = repoPath.split("/")

  return new Promise((resolve, reject) => {
    octokit.repos
      .getCommit({
        owner: pathComponents[3],
        repo: pathComponents[4],
        ref: "master"
      })
      .then(result => {
        const sha = result.data.sha
        console.log("SHAAAAAAA", sha)
        octokit.git.getTree({
            owner: pathComponents[3],
            repo: pathComponents[4],
            tree_sha: sha,
            recursive: 1
          }).then(result => {
            analyzeTree(result.data.tree, pathComponents[3], pathComponents[4])
              .then(finalresult => {
                console.log('ANALYSE TREEEEE DONE')
                currentRepo = repoPath
                resolve(finalresult)
              })
              .catch(error => {
                console.log('ANALYSE TREEEEE ERROR')
                reject(error)
              })
          })
          .catch(error => {
            console.log('GET TREEEEE ERROR', error)
            reject(error)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

async function analyzeTree(tree, owner, repo) {
  var tree
  return new Promise((resolve, reject) => {
    try {
      for (var obj of tree) {
        if (obj["type"] === "tree") {
          createTreeNode(obj["path"])
        }
      }
      var promiseLit = []
      pkgJsonPath = ""
      ylPath = ""
      for (var obj of tree) {
        var pathSplit = obj["path"].split("/")
        var ext = pathSplit[pathSplit.length - 1].split(".")[1]
        if (obj["type"] === "blob") {
          if (ext === "js") {
            //Promise call: obj in the second function call may not be the same as what is is in first function
            console.log("analyzeTree:" + obj["path"])
            var a = new Promise((resolve, reject) => {
              analyzeFileDep(obj["path"], owner, repo)
                .then(result => {
                  AddFileNode(result["path"], result["node"])
                  resolve(fileTree)
                })
                .catch(error => {
                  console.log("DOES THIS EVER OCCUR")
                  reject(error)
                })
            })
            promiseLit.push(a)
          } else if (pathSplit[pathSplit.length - 1] === "package.json") {
            pkgJsonPath = obj["path"]
            console.log("======set path=====" + obj["path"])
          } else if (pathSplit[pathSplit.length - 1] === "yarn.lock") {
            ylPath = obj["path"]
            console.log("======set path=====" + obj["path"])
          }
        }
      }
      Promise.all(promiseLit)
        .then(values => {
          resolve(values[values.length - 1])
        })
        .catch(error => {
          console.log("THE ERROR HAPPENED HERE", error)
          reject(error)
        })
    } catch (error) {
      reject(error)
    }
  })
  //   console.log(fileTree["subfile"][0]["subfile"])
  //   console.log(fileTree["subfile"][1]["subfile"])
}

function createTreeNode(path) {
  if (!path.includes("\/")) {
    var treeNode = { "name": path, "type": "directory", "subfile": [] };
    fileTree["subfile"].push(treeNode);
  } else {
    var pathSplit = path.split("\/");
    var i = 0;
    var currentNode = fileTree;
    while (i < pathSplit.length) {
      var bool = 0;
      for (var j = 0; j < currentNode["subfile"].length; j++) {
        var node = currentNode["subfile"][j];
        loop:
        if (node["name"] === pathSplit[i]) {
          currentNode = currentNode["subfile"][j];
          bool = 1;
          break loop;
        }
      }
      if (bool == 0) {
        var newNode = { "name": pathSplit[i], "type": "directory", "subfile": [] }
        currentNode["subfile"].push(newNode);
        var l = currentNode["subfile"].length
        currentNode = currentNode["subfile"][l - 1];
      }
      i++;
    }

  }
}

function analyzeFileDep(path, owner, repo) {
  console.log("ANALYZE FILE", path, owner, repo)
  var ext = path.split("\.")[1];
  var pathSplit = path.split("\/");
  var fileName = pathSplit[pathSplit.length - 1];
  
  return new Promise((resolve, reject) => {
    octokit.repos.getContents({
      owner: owner,
      repo: repo,
      path: path
    }).then(result => {
      const content = Buffer.from(result.data.content, 'base64').toString();
      var reg = content.match(/import.*from.*;/g)
      var dependency = []
      if (reg !== null) {
        for (var dep of reg) {
          var fromIndex = dep.indexOf("from");
          var str = dep.substring(fromIndex + 4, dep.length - 1)
          var cleanDep = str.trim();
          dependency.push(cleanDep.substring(1, cleanDep.length - 1))
        }
      }
      var node = { "name": fileName, "type": "file", "dependency": dependency }
      console.log("fileDep: " + path)
      resolve({ "node": node, "path": path })
  
    }).catch(error => {
      console.log("ANALYZE DEP ERROR");
      reject( error)
    })
  })
}

function AddFileNode(path, fileNode) {
  var pathSplit = path.split("\/");
  var currentNode = fileTree
  for (var i = 0; i < pathSplit.length - 1; i++) {
    var error = 1
    for (var j = 0; j < currentNode["subfile"].length; j++) {
      if (pathSplit[i] === currentNode["subfile"][j]["name"]) {
        currentNode = currentNode["subfile"][j]
        error = 0
      }
    }
    if (error == 1) {
      console.log(currentNode["subfile"])
      console.log("error message: can't find directory " + "path")
    }
  }

  currentNode["subfile"].push(fileNode)
  return fileTree;
}

