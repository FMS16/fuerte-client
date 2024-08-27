"use client";

import React, { useState, useRef, useEffect } from 'react';

function Acordion() {
  const [ activeIndex, setActiveIndex ] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <React.Fragment>
      {accordionData.map((item, index) => (
        <AcordionItem
          key={index}
          title={item.title}
          content={item.content}
          isActive={activeIndex === index}
          onClick={() => toggleAccordion(index)}
        />
      ))}
    </React.Fragment>
  );
}

function AcordionItem({ title, content, isActive, onClick }) {
  const contentRef = useRef(null);
  const [ maxHeight, setMaxHeight ] = useState('0px');

  useEffect(() => {
    if (isActive) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [ isActive ]);

  return (
    <div className='acordion-item'>
      <div className='acordion-title' onClick={onClick}>
        {title}
      </div>
      <div
        ref={contentRef}
        className='acordion-item-content'
        style={{
          maxHeight: maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          padding: isActive ? '15px 0' : '0', // Padding solo cuando está activo
        }}
      >
        {content}
      </div>
    </div>
  );
}

const accordionData = [
  {
    title: '¿Qué tienen de especial las prendas FUERTE?',
    content: (
      <>
        <p>Nuestras prendas están confeccionados con la más avanzada tecnología Seamless, permitiendo:</p>
        <ul>
          <li>Comodidad incomparable: Sin costuras que causen rozaduras, experimentarás una sensación suave.</li>
          <li>Libertad de movimiento total: Gracias a su elasticidad, podrás realizar movimientos sin restricciones.</li>
          <li>Transpirabilidad avanzada: Diseñada con tecnología de tejido que permite una mejor ventilación, manteniéndote fresco y seco durante el ejercicio.</li>
          <li>Durabilidad y resistencia: A pesar de su ligereza, la tela Seamless es duradera y resistente, manteniendo su forma y calidad.</li>
          <li>Ajuste personalizado: Se adapta a tu cuerpo, realzando tu figura y aumentando tu confianza durante el entrenamiento.</li>
          <li>Scrunch en nuestros leggings: modelando y realzando tu melocotoncito jeje :)</li>
        </ul>
      </>
    ),
  },
  {
    title: '¿Dónde y cuándo recibiré mi compra?',
    content: <>
      <p> Tu paquete será entregado en la dirección especificada en el check out mediante el servicio de entregas de DAC en los próximos 2-4 días hábiles. En caso de no poder recibirlo en el domicilio, podrás retirarlo en la oficina DAC más cercana a tu domicilio con el número de rastreo. </p>
      <p>Si tu compra fue efectuada desde Ecuador, recibirás tu pedido en la dirección especificada en el check out mediante el servicio de entregas Servientrega dentro de 10-15 días hábiles. En caso de no encontrarte en el domicilio, podrás retirarlo en la oficina Servientrega más cercana a tu domicilio.</p>
    </>,
  },
  {
    title: 'Costos y zonas de envío',
    content: <>
      <p>Los envíos tienen un costo de $210 a todo el país, abonados en el check out de la compra. </p>
      <p>Los envíos a Ecuador tienen un precio promocional de $15 a todo el país.</p>
    </>,
  },
  {
    title: 'Cambios y devoluciones',
    content: <>
      <p>Debajo de los productos contas con una Guia de tallas de referencia para tu facilidad, pero si no te quedó la prenda o tiene alguna falla, no te preocupes, tenes 15 días para realizar un cambio por el mismo u otro producto del mismo precio. </p>
        <p>Debes mandarnos un mail a <span className='bold'>devoluciones@fuerte.com.uy</span> para coordinar el envío de la devolución. </p>
      <p>Tené en cuenta que las prendas deben conservar el empaque y las etiquetas intactas. El precio de los envíos corre por cuenta del cliente.</p>
    </>,
  },
];

export default Acordion;
