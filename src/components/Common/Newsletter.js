import React from 'react'
import logo from "../../assets/images/logoRecortadoFino.png";
import Image from 'next/image';

const Newsletter = () => {
    const suscribeNewsletter = () => {

    }
    return (
        <div className='newsletter'>
            <div className='newsletter-container'>
                <h1><span>Convertite en una mujer</span> <Image src={logo} alt='Logo'></Image></h1>
                {/*                 <h2>Para disfrutar de beneficios exclusivos, descuentos y m&aacute;s</h2> */}
                <form className='form-newsletter'>
                    <input className='input-email' type='email' placeholder='Email' />
                    <input type='submit' className='btn-join' value='Unirme' />
                </form>
            </div>
        </div>
    )
}

export default Newsletter