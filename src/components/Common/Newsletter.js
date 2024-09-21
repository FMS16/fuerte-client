import React from 'react'
import logo from "../../assets/images/logoRecortadoBlanco.png";
import Image from 'next/image';
import banner from "../../assets/images/Tezza-4600.webp"

const Newsletter = () => {
    const suscribeNewsletter = () => {

    }
    return (
        <div className='newsletter'>
            <Image src={banner} className='newsletter-banner' layout='fill' quality={100} objectFit='cover' alt='Banner newsletter' />
            <div className='newsletter-container'>
                <h1><span>Unite al club</span> <Image src={logo} alt='Logo'></Image></h1>
                <h2>Para recibir promociones, novedades, descuentos y mucho m&aacute;s</h2> 
                <form className='form-newsletter'>
                    <input className='input-email' type='email' placeholder='Email' />
                    <input type='submit' className='btn-join' value='Unirme' />
                </form>
            </div>
        </div>
    )
}

export default Newsletter