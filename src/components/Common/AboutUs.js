
import React from 'react'
import Image from 'next/image';

import img from "../../assets/images/bannerDos.jpg"

const AboutUs = () => {
  return (
    <div className='about-us'>
      <div className='container-80'>
        <h1>¡Impactá, brillá e inspirá FUERTE!</h1>
        <p>Hola preciosa, soy Vicky Turusha y quiero contarte que fundé Fuerte con el principal objetivo de empoderarte y motivarte. Me inspiré en una mujer fuerte física, mental y emocionalmente, de esta manera creé prendas que reflejan el balance entre femenino, estético, cómodo y con un estilo único.</p>
        <p>Mi propósito es aportarte la motivación necesaria para que vayas por TODO, porque exactamente eso es lo que mereces. Espero que te enamores de cada una de las prendas, pero también de la misión de FUERTE, tanto como lo hago yo en cada paso de la creació</p>
        <p> No quiero pasar por alto contarte que invertí muchísimo amor en este sueño que ahora es una realidad, por eso te invito a que sueñes en grande porque si hay algo que tengo en claro es que si lo podes soñar, lo podes lograr!</p>
        <p>Te quiero,</p>
        <p>Vicky</p>
        <p className='relative'><Image src={img} alt='Modelo sobre nosotros' fill /></p>
      </div>
    </div>
  )
}

export default AboutUs