"use client";

import logo from "../../assets/images/logoRecortado.png"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import bannerMobile from "../../assets/images/Vicky portada.jpg"
import bannerDesktop from "../../assets/images/desktop-banner.png"

const ComingSoon = () => {
    const [ isMobileOrTablet, setIsMobileOrTablet ] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        const updateMediaQuery = () => setIsMobileOrTablet(mediaQuery.matches);

        updateMediaQuery();
        mediaQuery.addEventListener('change', updateMediaQuery);

        return () => mediaQuery.removeEventListener('change', updateMediaQuery);
    }, []);
    return (
        <div className="pre-web">
            {/* <div className="overlay"></div> */}
            <Image
                src={isMobileOrTablet ? bannerMobile : bannerDesktop}
                alt="Imagen Vicky Turusha"
                layout="fill"
                objectFit="cover"
                priority
                quality={100} 
                unoptimized={true}
                className="coming-soon-banner-img"
            />

            <div className="pre-web-content">
                <div className="coming-soon-info">
                    <h1><Image src={logo} width={200} height={25} alt="Logo Fuerte" /></h1>
                    <h2>¡Gracias por estar ac&aacute; preciosa!</h2>
                    <h2>Faltan muy pocos dias</h2>
                    <h2>Te quiero,</h2>
                    <h2>Vicky</h2>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon