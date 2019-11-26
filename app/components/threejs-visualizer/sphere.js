import React from "react"
import * as THREE from "three"
import * as CANNON from "cannon"
import { useCannon } from "./useCannon"

const Sphere = ({
  position,
  radius = 1,
  mass = 15,
  friction = 50,
  color,
  onClick,
  ...props
}) => {
  const ref = useCannon({ mass: mass, friction: friction }, body => {
    body.addShape(new CANNON.Sphere(radius))
    body.position.set(...position)
    body.linearDamping = 0.5
  })
  return (
    <mesh
      ref={ref}
      onClick={onClick}
      castShadow
      receiveShadow
      position={[0, 0, 0]}
    >
      <sphereBufferGeometry attach='geometry' args={[radius, 32, 32]} />
      <meshStandardMaterial attach='material' color={color} roughness={0.3} />
    </mesh>
  )
}

export default Sphere
