import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraController from './CameraController';
import Model from './Model';
import GlobalRotateIcon from './icons/GlobalRotateIcon';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

function ModelPage() {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(0.02);
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  const [isReverseAnimationTriggered, setIsReverseAnimationTriggered] = useState(false);
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0]);

  const minZoom = 0.015;
  const maxZoom = 0.025;
  const zoomStep = 0.0025;

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setLoaderVisible(false);
        setIsLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const rotateLeft = () => setRotation(prev => prev + Math.PI / 8);
  const rotateRight = () => setRotation(prev => prev - Math.PI / 8);
  const zoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  const zoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));
  const navigate = useNavigate()

  const returnHome = () => {
    navigate('/')
  }

  const triggerAnimation = () => {
    setIsAnimationTriggered(true);
    setIsReverseAnimationTriggered(false);
  };

  const triggerReverseAnimation = () => {
    setIsReverseAnimationTriggered(true);
    setIsAnimationTriggered(false);
    setStateView([Math.PI / 2, 0, 0]);
  };

  const toggleView = () => {
    const currentRotation = stateView[0];
    const newRotation = currentRotation === Math.PI / 2 ? Math.PI / 4 : Math.PI / 2;
    setStateView([newRotation, 0, 0]);
  };

  return (
    <div>
      <div
        style={{
          opacity: loaderVisible ? 1 : 0,
        }}
        className='loader'
      >
        <div className='carga'></div>
        <p style={{ color: 'white' }}>Cargando</p>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <Model
            targetRotation={rotation}
            targetScale={zoom}
            setLoading={setLoading}
            stateView={stateView}
            playAnimation={isAnimationTriggered}
            reverseAnimation={isReverseAnimationTriggered}
          />
          <CameraController />
        </Suspense>
      </Canvas>
      {!loading && isLoaded && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px' }}>
          <button onClick={returnHome}>
            Volver
          </button>
          <button onClick={triggerAnimation}>
            Start Animation
          </button>
          {isAnimationTriggered && (
            <>
              <button onClick={toggleView}>Toggle View</button>
              <button onClick={triggerReverseAnimation}>
                Reverse Animation
              </button>
            </>
          )}
        </div>
      )}
      {!loading && isLoaded && (
        <div className="menubar" >
          <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateLeft}>
            <GlobalRotateIcon width='30px' height='30px' />
          </AnimatedButton>
          <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomOut}>
            <ZoomOutIcon width='30px' height='30px' />
          </AnimatedButton>
          <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomIn}>
            <ZoomInIcon width='30px' height='30px' />
          </AnimatedButton>
          <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateRight}>
            <GlobalRotateIcon width='30px' height='30px' style={{ transform: 'scaleX(-1)' }} />
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
