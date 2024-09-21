"use client";

import React, {useState, useEffect} from 'react'
import logo from "../../assets/images/logoRecortadoBlanco.png";
import Image from 'next/image';
import banner from "../../assets/images/Tezza-4600.webp"
import { toast } from 'react-toastify';

const Newsletter = () => {
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  }, []);
    const subscribeNewsletter = async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        const emailInput = event.target.elements[0]; // Obtiene el primer input del formulario
        const email = emailInput.value;

        if (!email) {
            if (isMobile) {
                toast.info('No puede ser vacío el email.', {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else {
                toast.info('No puede ser vacío el email.', {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email),
            });

            const data = await response.json();

            if (data.data == true) {
                if (isMobile) {
                    toast.success('Subscrito al newsletter con éxito.', {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    toast.success('Subscrito al newsletter con éxito.', {
                        position: "top-left",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
                emailInput.value = ''; // Limpia el input después de la suscripción
            } else {
                if (isMobile) {
                    toast.info(data.message, {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
    
                } else {
                    toast.info(data.message, {
                        position: "top-left",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            }
        } catch (error) {
            if (isMobile) {
                toast.info(error, {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else {
                toast.info(error, {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    };
    return (
        <div className='newsletter'>
            <Image priority={true} src={banner} className='newsletter-banner' layout='fill' quality={100} objectFit='cover' alt='Banner newsletter' />
            <div className='newsletter-container'>
                <h1><span>Unite al club</span> <Image src={logo} alt='Logo'></Image></h1>
                <h2>Para recibir promociones, novedades, descuentos y mucho m&aacute;s</h2> 
                <form className='form-newsletter' onSubmit={subscribeNewsletter}>
                    <input className='input-email' type='email' placeholder='Email' />
                    <input type='submit' className='btn-join' value='Unirme' />
                </form>
            </div>
        </div>
    )
}

export default Newsletter