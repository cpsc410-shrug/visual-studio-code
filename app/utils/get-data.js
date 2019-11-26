export const readrepo = async (url) => {
    return fetch(`http://www.localhost:8000/repo/readrepo?repoPath=${url}`, {
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        if (!res.ok) {
            return null;
        }
        return res.json()
     }).then(data => {return data})
}

export const readPackageJson = async (url) => {
    return fetch(`http://www.localhost:8000/repo/readjs?repoPath=${url}`, {
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        return res.json()
     }).then(data => {return data})
}

export const readYarnLock = async(url) => {
    return fetch(`http://www.localhost:8000/repo/readyarnlock?repoPath=${url}`, {
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        return res.json()
     }).then(data => {return data})
}

export const getSizeOfPackages = async(dependencies) => {
    return fetch(`http://www.localhost:8000/upgradepath/size?dep=${dependencies}`, {
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        return res.json()
     }).then(data => {return data})
}

export const getUpgradeInfo = async(url) => {
    return fetch(`http://www.localhost:8000/upgradepath/upgrade?repo=${url}`, {
        method: 'GET',
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        if (!res.ok) {
            console.log(res)
        } else {
            return res.json()
        }
     }).then(data => {
         return data
        })
}