/**
 * get the material based on the dependency type
 */
const getMaterial = (dependencyObj) => {
    return dependencyObj.devDependency ? null : null
}

export default getMaterial