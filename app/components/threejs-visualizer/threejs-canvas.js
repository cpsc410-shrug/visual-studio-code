import React, { useState, useEffect } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import styled from "styled-components"
import Sphere from "./sphere"
import Plane from "./plane"
import { Provider } from "./useCannon"

const CanvasWrapper = styled.div`
  flex-direction: column;
  grid-area: vis;
  height: 100%;
  position: relative;
`
const ThreeJSCanvas = props => {
  const [showPlane, setShowPlane] = useState(true)
  useEffect(() => setTimeout(() => setShowPlane(false), 4000), [])
const callAPI = () => {
    fetch(`${process.env.API_URL}/repo/readrepo`)
        .then(res => console.log(res))
}
  return (
    <CanvasWrapper>
      <Canvas
        camera={{ position: [0, 0, 25] }}
        onCreated={({ gl }) => (
          (gl.shadowMap.enabled = true),
          (gl.shadowMap.type = THREE.PCFSoftShadowMap)
        )}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.6}
          position={[40, 40, 60]}
          angle={0.5}
          penumbra={1}
          castShadow
        />
        <Provider>
          <Plane position={[0, 0, -10]} mass={0} />
          {showPlane && <Plane position={[0, 0, 0]} mass={0} />}
          <Sphere position={[1, 0, 7]} radius={2} mass={1} />
          <Sphere position={[5, 2, 10]} radius={1.2}/>
          <Sphere position={[-5, -2, 12]} radius={1.3}/>
          <Sphere position={[4, 3, 15]} radius={1.4}/>
          <Sphere position={[8, 2, 10]} radius={2.6}/>
          {!showPlane && <Sphere position={[3, 7, 10]} />}
          {/* <Sphere /> */}
        </Provider>
      </Canvas>
    </CanvasWrapper>
  )
}

export default ThreeJSCanvas
