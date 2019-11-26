import { map, filter } from 'ramda'
import { getSizeOfPackages, getUpgradeInfo } from '.././utils/get-data'
import generateColorForString from './generate-color'
const mockData = require('../components/threejs-visualizer/mockdata.json')
const mockData2 = require('../components/threejs-visualizer/mockdata2.json')

let ids = [];
let x = 0
let y = 0
let z = 0

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatData = (data) => {
    return {
        name: data.name,
        version: data.version,
        mass: 20,
        radius: 2,
        "sub-dependencies": map(formatData)(data["sub-dependencies"] ? data["sub-dependencies"] : []),
        position: [getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(0, 10)],
        color: generateColorForString(data.name + "@" + data.version)
    }
}

const formatUpgradeInfo = (data, upgradeData) => {
    return filter(x => x.moduleName === data.name && x.installed !== x.latest, upgradeData)
}

export const dependency = (info) => map(formatData)(info)
export const devDependency = (info) => map(formatData)(info)
const getMass = async (arr) => {
    await getSizeOfPackages(arr)
}
