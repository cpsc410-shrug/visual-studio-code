import vis from'vis-network';
import _ from 'lodash';

const mockData = require('./mockdata2.json');
const mockData3 = require('./mockdata3.json');
const repo = mockData3;
const dependencies = mockData.dependency;
const devDependencies = mockData.devDependency;

const getUsage = (name) => {
    var stack = [];
    var names = [];
    var path = [];
    var paths = [];
    var currDir;
    var allVisited = true;
    if (repo.type === "directory") {
        currDir = repo;
        stack.push(currDir);
        path.push(currDir.name);
        while (stack.length > 0) {

            while (currDir.type === "directory") {
                allVisited = true;
            
                for (var i = 0; i < currDir.subfile.length; i++) {
                    // console.log("currDir[subfile]: ", currDir.subfile[i].name);
                    if (currDir.subfile[i].visited === undefined) {
                        currDir.subfile[i].visited = "visited";
                        // console.log("pushing: ", currDir.subfile[i])
                        stack.push(currDir.subfile[i]);
                        path.push(currDir.subfile[i].name);
                        currDir = currDir.subfile[i];
                        allVisited = false;
                        break;
                    }
                }

                if (allVisited === true) {
                    // console.log("popped: ", stack.pop()); 
                    stack.pop();
                    currDir = stack.slice(stack.length-1, stack.length);
                    currDir = currDir[0];
                    // console.log("currDir: ", currDir);
                    path.pop();
                    break;
                }

            }

            if (currDir != undefined && currDir.type == "file") {
                // var needtoPopPath = true;
                for (var j = 0; j < currDir.dependency.length; j++) {
                    if (name === currDir.dependency[j]) {
                        names.push(currDir.name);
                        // path.pop();
                        // needtoPopPath = false;
                        // console.log("path: ", path);
                        var p = Array.from(path);
                        // p = p.slice(1, p.length);
                        paths.push(p);
                        break;
                    }
                }

                // console.log("poppingfile: ",currDir);
                stack.pop();
                currDir = stack.slice(stack.length-1, stack.length);
                currDir = currDir[0]; 
                // console.log("filename: ", currDir.name);
                path.pop();

                // if (needtoPopPath === true) {
                //     path.pop();
                // }

            }

        }
    }

    // let results = { ids: names, paths: paths };

    // console.log(results);

    return paths;
}

// const getUsage = (name) => {
//     var stack = [];
//     var names = [];
//     var currDir;
//     console.log("getUsage");
//     if (repo.type === "directory") {
//         stack.push(repo);
//         while (stack.length > 0) {
//             currDir = stack.pop();
//             if (currDir.type === "directory") {
//                 // console.log("directory: ", currDir.name);
//                 for (var i = 0; i < currDir.subfile.length; i++) {
//                     stack.push(currDir.subfile[i]);
//                 }   
//             } else if (currDir.type === "file") {
//                 // console.log("file: ", currDir.name);
//                 for (var j = 0; j < currDir.dependency.length; j++) {
//                     if (name === currDir.dependency[j]) {
//                         names.push(currDir.name);
//                     }
//                 } 
//             }
//         }
//     }
//     return names;
// }


const parseJs = (data) => {
    var dependencies = [];
    if (data.dependency != undefined) {
        for (var i = 0; i < data.dependency.length; i++) {
            dependencies.push(data.dependency[i].name);
        }
    }
    if (data.devDependency != undefined) {
        for (var j = 0; j < data.devDependency.length; j++) {
            dependencies.push(data.devDependency[j].name);
        }
    }
    return dependencies;
}

const parseYarn = (data) => {
    var dependencies = [];
    var i, j;
    if (data.dependency != undefined) {
        for (i = 0; i < data.dependency.length; i++) {
            dependencies.push(data.dependency.name);
            if (data.dependency[i].sub-dependencies != undefined) {
                for (j = 0; j < data.dependency[i].sub-dependencies.length; j++) {
                    dependencies.push(data.dependency[i].sub-dependencies[j].name);
                }
            }
        }
    }
    if (data.devDependencies != undefined) {
        for (i = 0; i < data.devDependencies.length; i++) {
            dependencies.push(data.devDependencies.name);
            if (data.devDependencies[i].sub-dependencies != undefined) {
                for (j = 0; j < data.devDependencies[i].sub-dependencies.length; j++) {
                    dependencies.push(data.devDependencies[i].sub-dependencies[j].name);
                }
            }
        }
    }
    return dependencies;
}

const getTopLevelDependencies = () => {
    return [... _.keys(dependencies), ... _.keys(devDependencies)];
}

const getDependenciesFor = (dependency) => {
    return dependencies[dependency] || devDependencies[dependency];
}

const getMainDependencies = () => {
    let ids = []
    dependencies.map(d => {
        ids.push(d.name)
    })
    return ids;
}

const getSubDependencies = (name) => {
    let ids = [];
    let filtered = dependencies.filter(d => d.name === name);
    console.log("filtered: ", filtered);
    if (filtered[0] != undefined) {
        filtered[0]['sub-dependencies'].map(sd => {
            ids.push(sd.name);
        });
    }   
    return ids;
}

export const network = (canvasId, onNodeClick, currentSelection, currentVisualization) => {
    // const ids = currentSelection == null ? getTopLevelDependencies() : getDependenciesFor(currentSelection);
    let sd, use, fin, usageEdges;
    console.log(currentSelection);
    if (currentVisualization === "Sub-Dependencies") {
        sd = currentSelection == null ? getMainDependencies() : getSubDependencies(currentSelection);
    } else if (currentVisualization === "Usage") {
        use = currentSelection == null ? getMainDependencies() : getUsage(currentSelection);
    } else {
        fin = getMainDependencies();
    }

    if (currentVisualization === "Sub-Dependencies") {
        fin = removeDuplicateIds(sd);
    }
    
    if (currentVisualization === "Usage") {
        // let m = mergeResults(use);
        for (var i = 0; i < use.length; i++) {
            use[i] = removeDuplicateIds(use[i]);
        }
        usageEdges = makeUsageEdges(use);
        fin = mergeResults(use);
        fin = removeDuplicateIds(fin);
        
    }

    const ids = fin;
    
    let data = { nodes: makeNodes(ids, "Node"), edges: usageEdges };
    const options = {};
    const container = document.getElementById(canvasId);
    let network = new vis.Network(container, data, options);
    network.on ('click', (ev) => {
        const nodes = ev.nodes;
        if (nodes.length != 0) {
            const clickedNode = nodes[0];
            onNodeClick(clickedNode);
        }
    });
};

const makeUsageEdges = (x) => {
    const options = {};
    let edges = new vis.DataSet(options);
    for (var i = 0; i < x.length; i++) {
        for (var j = 0; j < x[i].length - 1; j++) {
            edges.add([{ from: x[i][j], to: x[i][j+1] }]);
        }
    }
    return edges;
    // _.forEach(edgeLabels, (val) => {
    //     edges.add([{ from: val[0], to: val[1] }]);
    // });
    // return edges;
}

const mergeResults = (x) => {
    var merge = [];
    var i, j;
    for (i = 0; i < x.length; i++) {
        for (j = 0; j < x[i].length; j++) {
            merge.push(x[i][j]);
        }
    }
    return merge;
}

// const mergeResults = (x) => {
//     var merge = [];
//     var i, j;
//     for (i = 0; i < x.ids.length; i++) {
//         merge.push(x.ids[i]);
//     }
//     for (i = 0; i < x.paths.length; i++) {
//         for (j = 0; j < x.paths[i].length; j++) {
//             merge.push(x.paths[i][j]);
//         }
//     }
//     return merge;
// }

const removeDuplicateIds = (x) => {
    var dupsRemoved = [];
    var add = true;
    for (var i = 0; i < x.length; i++) {
        add = true;
        for (var j = 0; j < dupsRemoved.length; j++) {
            if (x[i] === dupsRemoved[j]) {
                add = false;
            }
        }
        if (add === true) {
            dupsRemoved.push(x[i]);
        }
    }
    return dupsRemoved;
};

const makeEdges = (edgeLabels) => {
    const options = {};
    let edges = new vis.DataSet(options);
    _.forEach(edgeLabels, (val) => {
        edges.add([{ from: val[0], to: val[1] }]);
    });
    return edges;
};

const makeNodes = (ids) => {
    const options = {};
    let nodes = new vis.DataSet(options);
    _.forEach(ids, (val) => {
        nodes.add([{ id: val, label: val, shape: "circle", widthConstraint: {minimum: 50, maximum: 100} }]);
    });
    return nodes;
};