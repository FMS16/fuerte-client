import React from 'react'
import logo from "../../assets/images/logoRecortadoFino.png";
import Image from 'next/image';

const Newsletter = () => {
    const suscribeNewsletter = () =>{

    }
    return (
        <div className='newsletter'>
            <div className='newsletter-container'>
                <h1>Convertite en una mujer <Image src={logo} alt='Logo'></Image></h1>
{/*                 <h2>Para disfrutar de beneficios exclusivos, descuentos y m&aacute;s</h2> */}
                <button className='btn-join'>UNIRME AL CLUB</button>
            </div>

        </div>
    )
}

export default Newsletter