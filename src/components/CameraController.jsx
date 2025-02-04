import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import * as THREE from 'three'


function CameraController () {
  const { camera } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [initialPosition, setInitialPosition] = useState({
    x: camera.position.x,
    y: camera.position.y
  })
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
  const moveSpeed = 0.01
  const limit = 0.5
  const returnSpeed = 0.05

  useEffect(() => {
    const handleMouseDown = event => {
      setIsDragging(true)
      setStartX(event.clientX)
      setStartY(event.clientY)
      setInitialPosition({ x: camera.position.x, y: camera.position.y })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setCurrentPosition({ x: 0, y: 0 })
    }

    const handleMouseMove = event => {
      if (isDragging) {
        const deltaX = event.clientX - startX
        const deltaY = startY - event.clientY
        const newX = Math.min(
          Math.max(camera.position.x - deltaX * moveSpeed, -limit),
          limit
        )
        const newY = Math.min(
          Math.max(camera.position.y - deltaY * moveSpeed, -limit),
          limit
        )

        camera.position.x = newX
        camera.position.y = newY

        setStartX(event.clientX)
        setStartY(event.clientY)
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging, startX, startY, camera, initialPosition])

  useFrame(() => {
    if (!isDragging) {
      if (camera.position.x !== currentPosition.x) {
        camera.position.x = THREE.MathUtils.lerp(
          camera.position.x,
          currentPosition.x,
          returnSpeed
        )
        if (Math.abs(camera.position.x - currentPosition.x) < 0.01) {
          camera.position.x = currentPosition.x
        }
      }
      if (camera.position.y !== currentPosition.y) {
        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          currentPosition.y,
          returnSpeed
        )
        if (Math.abs(camera.position.y - currentPosition.y) < 0.01) {
          camera.position.y = currentPosition.y
        }
      }
    }
  })

  return null
}

export default CameraController