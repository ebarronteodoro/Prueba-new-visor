import React, { useState } from 'react';
import './AnimatedButton.css'; // El archivo de estilos separado

const AnimatedButton = ({ onMouseDown, children, className = '', ...props }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = (event) => {
    setIsClicked(true);

    // Llama a la función onMouseDown si está definida
    if (onMouseDown) {
      onMouseDown(event);
    }

    // Remueve la clase 'clicked' después de 100ms (o el tiempo que prefieras)
    setTimeout(() => {
      setIsClicked(false);
    }, 50);
  };

  return (
    <button 
      onMouseDown={handleMouseDown} 
      className={`${className} ${isClicked ? 'clicked' : ''}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
