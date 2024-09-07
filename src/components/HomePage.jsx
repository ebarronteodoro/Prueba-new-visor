import React, { useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import NavigateButton from './NavigateButton'
import AnimatedButton from './AnimatedButton'

const BuildingModel = ({ targetRotation, targetScale, onLoadingComplete }) => {
  const { scene } = useGLTF('/models/Edificio optimizado.glb')

  const [currentRotation, setCurrentRotation] = useState(targetRotation)
  const [currentScale, setCurrentScale] = useState(targetScale)

  useEffect(() => {
    if (typeof onLoadingComplete === 'function') {
      onLoadingComplete(false)
    }
  }, [onLoadingComplete])

  useFrame(() => {
    // Interpolación suave para la rotación
    setCurrentRotation(
      THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1)
    )
    scene.rotation.y = currentRotation

    // Interpolación suave para el zoom
    setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))
    scene.scale.set(currentScale, currentScale, currentScale)
  })

  return (
    <primitive object={scene} position={[-1, -8, 0]} scale={[0.4, 0.4, 0.4]} metalness={0.5} roughness={0.1} />
  )
}

const CameraController = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, -5, 10)
    camera.lookAt(new THREE.Vector3(0, -5, 0))
  }, [camera])

  useFrame(() => camera.updateProjectionMatrix())
  return null
}

function HomePage () {
  const [rotation, setRotation] = useState(Math.PI / 4)
  const [zoom, setZoom] = useState(0.5)
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [interactionTimeout, setInteractionTimeout] = useState(null)

  const minZoom = 0.35
  const maxZoom = 1
  const zoomStep = 0.05

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  // Manejo de rotación automática
  useEffect(() => {
    let interval
    if (autoRotate) {
      interval = setInterval(() => {
        setRotation(prev => prev + 0.002) // Ajustar velocidad de rotación
      }, 16)
    }

    return () => {
      if (interval) clearInterval(interval) // Limpiar intervalo cuando no se rota automáticamente
    }
  }, [autoRotate])

  // Funciones para controlar rotación y zoom
  const rotateLeft = () => {
    setRotation(prev => prev + Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation() // Reiniciar la rotación automática después de un tiempo
  }

  const rotateRight = () => {
    setRotation(prev => prev - Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation() // Reiniciar la rotación automática después de un tiempo
  }

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom))
    stopAutoRotation()
    restartAutoRotation() // Reiniciar la rotación automática después de un tiempo
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom))
    stopAutoRotation()
    restartAutoRotation() // Reiniciar la rotación automática después de un tiempo
  }

  // Manejo de interacción con el mouse
  const handleMouseDown = event => {
    setMouseDown(true)
    setStartX(event.clientX)
    stopAutoRotation()
  }

  const handleMouseUp = () => {
    setMouseDown(false)
    restartAutoRotation()
  }

  const handleMouseMove = event => {
    if (!mouseDown) return
    const deltaX = event.clientX - startX
    setRotation(prev => prev + deltaX * 0.02)
    setStartX(event.clientX)
  }

  const handleWheel = event => {
    event.preventDefault()
    const direction = event.deltaY < 0 ? 1 : -1
    setZoom(prev => {
      const newZoom = prev + direction * zoomStep
      return Math.max(minZoom, Math.min(newZoom, maxZoom))
    })
    stopAutoRotation()
  }

  useEffect(() => {
    const preventDefault = event => event.preventDefault()
    window.addEventListener('wheel', preventDefault, { passive: false })
    return () => {
      window.removeEventListener('wheel', preventDefault)
    }
  }, [])

  // Detener la rotación automática cuando hay interacción
  const stopAutoRotation = () => {
    setAutoRotate(false)
    clearTimeout(interactionTimeout)
  }

  // Reiniciar la rotación automática después de un tiempo sin interacción
  const restartAutoRotation = () => {
    clearTimeout(interactionTimeout)
    const timeout = setTimeout(() => {
      setAutoRotate(true)
    }, 3000) // Tiempo de espera antes de reiniciar la rotación automática
    setInteractionTimeout(timeout)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel} // Agregar el evento de scroll
      style={{ width: '100vw', height: '100vh' }}
    >
      {loading && (
        <div className='loader'>
          <div className='carga'></div>
          <p style={{ color: 'white' }}>Cargando</p>
        </div>
      )}
      <Canvas>
        <Suspense fallback={null}>
          <Sky sunPosition={[0, 5, -50]} turbidity={1} rayleigh={1} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <BuildingModel
            targetRotation={rotation}
            targetScale={zoom}
            onLoadingComplete={setLoading}
          />
          <CameraController />
        </Suspense>
      </Canvas>
      {!loading && isLoaded && (
        <div
          className='menubar'
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            display: 'flex',
            gap: '15px'
          }}
        >
          <AnimatedButton onClick={rotateLeft}>Rotate Left</AnimatedButton>
          <AnimatedButton onClick={zoomOut}>Zoom Out</AnimatedButton>
          <AnimatedButton onClick={zoomIn}>Zoom In</AnimatedButton>
          <AnimatedButton onClick={rotateRight}>Rotate Right</AnimatedButton>
          <NavigateButton />
        </div>
      )}
    </div>
  )
}

export default HomePage
