import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigateButton.css'; // Asegúrate de tener este CSS para los estilos

function NavigateButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/modelpage'); // Cambia '/modelpage' a la ruta que necesitas
  };

  return (
    <button className="navigate-button" onClick={handleClick}>
      Go to Model Page
    </button>
  );
}

export default NavigateButton;
