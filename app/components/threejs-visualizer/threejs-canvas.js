import React, { useState, useEffect } from "react"
import * as THREE from "three"
import { Canvas } from "react-three-fiber"
import styled from "styled-components"
import Dependencies from './dependencies'
import Sphere from "./sphere"
import Plane from "./plane"
import { Provider } from "./useCannon"
import { dependency, devDependency } from "../../utils/format-results"

const CanvasWrapper = styled.div`
  flex-direction: column;
  grid-area: vis;
  height: 100%;
  position: relative;
`
const ThreeJSCanvas = ({ yarnlockInfo, repoInfo, upgradeInfo, ...props}) => {
  const [showPlane, setShowPlane] = useState(true)
  const [visualization, setVisualization] = useState("dependencies")
  useEffect(() => setTimeout(() => setShowPlane(false), 4000), [])
  const [selected, setSelected] = useState(null)
  const dependencies = yarnlockInfo? dependency(yarnlockInfo.dependency) : null
  const devDependencies = yarnlockInfo? devDependency(yarnlockInfo.devDependency) : null

  console.log(dependencies, devDependencies)
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
          {visualization === "dependencies" &&
          <>
            <Dependencies setSelected={setSelected} dependencies={dependencies}/>
            <Dependencies setSelected={setSelected} dependencies={devDependencies}/>
          </>
          }
          {visualization === "sub-dependencies" &&
          <>
            <Dependencies setSelected={setSelected} dependencies={dependencies}/>
            <Dependencies setSelected={setSelected} dependencies={devDependencies}/>
          </>
          }
        </Provider>
      </Canvas>
    </CanvasWrapper>
  )
}

export default ThreeJSCanvas
