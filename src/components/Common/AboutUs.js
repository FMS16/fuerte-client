"use client";

import React from 'react'
import Image from 'next/image';

import img from "../../assets/images/image4.webp"
import { useEffect, useState } from 'react';

const AboutUs = () => {
  const [isMobile, setIsMobile] = useState(false);
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
  }, []);
  return (
    <div className='about-us'>
      <div className={`${isMobile ? 'container-80' : 'container-90'}`}>
        <div className='about-us-item'>
          <h1>¡Impactá, brillá e inspirá FUERTE!</h1>
          <p>Hola preciosa, soy Vicky Turusha y quiero contarte que fundé Fuerte con el principal objetivo de empoderarte y motivarte. Me inspiré en una mujer fuerte física, mental y emocionalmente, de esta manera creé prendas que reflejan el balance entre femenino, estético, cómodo y con un estilo único.</p>
          <p>Mi propósito es aportarte la motivación necesaria para que vayas por TODO, porque exactamente eso es lo que mereces. Espero que te enamores de cada una de las prendas, pero también de la misión de FUERTE, tanto como lo hago yo en cada paso de la creaci&oacute;n</p>
          <p> No quiero pasar por alto contarte que invertí muchísimo amor en este sueño que ahora es una realidad, por eso te invito a que sueñes en grande porque si hay algo que tengo en claro es que si lo podes soñar, lo podes lograr!</p>
          <p>Te quiero,</p>
          <p>Vicky</p>
        </div>
        <div className='about-us-item'>
          {/* <p className='relative'><Image src={img} objectFit='cover' objectPosition='left bottom' alt='Modelo sobre nosotros' layout='fill' /></p> */}
        </div>
      </div>
    </div>
  )
}

export default AboutUs