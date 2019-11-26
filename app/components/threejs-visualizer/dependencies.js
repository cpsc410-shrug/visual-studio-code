import React, { useState, useEffect } from "react"
import Sphere from "./sphere"

const Dependencies = ({ dependencies, setSelected, ...props }) => {
  return (
    <>
      {dependencies.map((dependency, i) => {
        return <Sphere
          key={dependency.name + '@' + dependency.version + "_" + i}
          position={dependency.position}
          radius={dependency.radius}
          mass={dependency.mass}
          color={dependency.color}
          onClick ={() => setSelected(dependency.name)}
        />
      })}
    </>
  )
}

export default Dependencies
