"use client";

import React, {useEffect, useState} from 'react'
import Acordion from './Acordion'


const FAQs = () => {
    const [ isMobile, setIsMobile ] = useState(false);
  useEffect(() => {
    // Función para actualizar el estado basado en el tamaño de la ventana
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Llama a handleResize cuando el componente se monta
    handleResize();

    // Añade un event listener para manejar los cambios de tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ isMobile ]);
    return (
        <div className='faqs'>
            <div className='container-90'>
                <h1>Preguntas frecuentes</h1>
                <Acordion />
            </div>
        </div>
    )
}

export default FAQs