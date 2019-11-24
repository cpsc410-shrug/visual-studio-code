import React, { useState, useEffect } from "react"
import Sphere from "./sphere"

const Dependencies = ({ dependencies, ...props }) => {
  return (
    <>
      {dependencies.map(dependency => {
        return <Sphere
          position={dependency.position}
          radius={dependency.radius}
          mass={dependency.mass}
        />
      })}
      <Sphere position={[1, 0, 7]} radius={2} mass={1} />
      <Sphere position={[5, 2, 10]} radius={1.2} />
      <Sphere position={[-5, -2, 12]} radius={1.3} />
      <Sphere position={[4, 3, 15]} radius={1.4} />
      <Sphere position={[8, 2, 10]} radius={2.6} />
    </>
  )
}

export default Dependencies
