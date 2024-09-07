import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'

function Model ({
  targetRotation,
  targetScale,
  setLoading,
  playAnimation,
  reverseAnimation,
  stateView
}) {
  const gltf = useLoader(GLTFLoader, '/models/TIPO-B.glb')
  const meshRef = useRef()
  const mixerRef = useRef()
  const actionRef = useRef()

  useEffect(() => {
    if (gltf && setLoading) {
      setLoading(false)
    }
  }, [gltf, setLoading])

  useEffect(() => {
    if (gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene)
      actionRef.current = mixerRef.current.clipAction(gltf.animations[0])
      actionRef.current.loop = THREE.LoopOnce
      actionRef.current.clampWhenFinished = true

      if (playAnimation === true) {
        actionRef.current.reset()
        actionRef.current.timeScale = 1
        actionRef.current.play()
      } else if (reverseAnimation === true) {
        actionRef.current.time = actionRef.current.getClip().duration
        actionRef.current.timeScale = -1
        actionRef.current.play()
      } else {
        actionRef.current.stop()
      }
    }
  }, [gltf, playAnimation, reverseAnimation])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.02
      )
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.25
      )

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        stateView[0],
        0.2
      )
    }

    if (mixerRef.current) mixerRef.current.update(0.02)
  })

  return (
    <>
      <primitive
        ref={meshRef}
        object={gltf.scene}
        scale={[0.6, 0.6, 0.6]}
        position={[0, 0, 0]}
        metalness={0.5}
        roughness={0.5}
      />
      {/* Aquí es donde añadimos el EffectComposer */}
      <EffectComposer>
        {/* Añadimos los efectos de postprocesado */}
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.0} />
        <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  )
}

export default Model
