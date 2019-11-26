import React, {useEffect} from 'react'
import * as CANNON from 'cannon'
import { useCannon } from './useCannon'
import { readrepo, readPackageJson, readYarnLock, getSizeOfPackages, getUpgradeInfo } from '../../utils/get-data'

const Plane = ({ position, mass = 0 }) => {

    const getData = async () => {
        console.log('getting data')
        await readrepo('https://github.com/MalcolmChen97/React-Native-SmallApps');
        await readPackageJson('https://github.com/MalcolmChen97/React-Native-SmallApps')
        await readYarnLock('https://github.com/MalcolmChen97/React-Native-SmallApps')
        await getUpgradeInfo('https://github.com/MalcolmChen97/React-Native-SmallApps')
        await getSizeOfPackages(`["react", "lodash"]`)
    }
    useEffect(() => {
        async function getasync() {
            await getData()
        }
        getasync()
    }, [])

    const ref = useCannon({mass: mass}, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    })
    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
    )
}

export default Plane