import * as CANNON from 'cannon'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useRender } from 'react-three-fiber'

const context = React.createContext()
export const Provider = ({ children }) => {
    
    // create a new cannon world
    const [world] = useState(() => new CANNON.World())
    useEffect(() => {
        world.broadphase = new CANNON.NaiveBroadphase()
        world.solver.iterations = 10
        world.gravity.set(0,0,-25)
    }, [world])

    useRender(() => world.step(1/60))

    return <context.Provider value={world} children={children}/>
}

export const useCannon = ({ ...props}, fn, deps=[]) => {
    const ref = useRef()

    // Cannon world object
    const world = useContext(context)
    // Physics body
    const [body] = useState(() => new CANNON.Body(props))

    useEffect(() => {
        fn(body)
        world.addBody(body)

        // Equivalent to unmounting
        return () => world.removeBody(body)
    }, deps)

    useRender(() => {
        if (ref.current) {
            ref.current.position.copy(body.position)
            ref.current.quaternion.copy(body.quaternion)
        }
    })
    return ref
}