import vis from'vis-network';
import _ from 'lodash';

const mockData = require('./mockdata.json');
const usagemockData = require('./usagemockdata.json');
const usage = usagemockData.results;
const dependencies = mockData.dependencies;
const devDependencies = mockData.devDependencies;

const getUsage = (dependency) => {
    var ids = [];
    for (var i = 0; i < usage.length; i++) {
        // console.log(usage[i].dependency);
        if (usage[i].dependency != undefined) {
            for (var j = 0; j < usage[i].dependency.length; j++) {
                if (usage[i].dependency[j] === dependency) {
                    ids.push(usage[i].name);
                    // console.log(usage[i].name);
                }
            }
        }
    }
    return ids;
}

const getTopLevelDependencies = () => {
    return [... _.keys(dependencies), ... _.keys(devDependencies)];
}

const getDependenciesFor = (dependency) => {
    return dependencies[dependency] || devDependencies[dependency];
}

export const network = (canvasId, onNodeClick, currentSelection, currentVisualization) => {
    let x;
    if (currentVisualization === "Usage") {
        x = currentSelection == null ? getTopLevelDependencies() : getUsage(currentSelection);
    } else {
        x = currentSelection == null ? getTopLevelDependencies() : getDependenciesFor(currentSelection);
    }

    const ids = removeDuplicateIds(x);

    let data = { nodes: makeNodes(ids, "Node"), edges: new vis.DataSet({}) };
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