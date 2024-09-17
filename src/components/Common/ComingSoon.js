"use client";

import logo from "../../assets/images/logoRecortado.png"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import bannerMobile from "../../assets/images/Vicky portada.webp"
import bannerDesktop from "../../assets/images/desktop-banner.webp"

const ComingSoon = () => {
    const [ isMobile, setIsMobile ] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 600px)");
        const updateMediaQuery = () => setIsMobile(mediaQuery.matches);

        updateMediaQuery();
        mediaQuery.addEventListener('change', updateMediaQuery);

        return () => mediaQuery.removeEventListener('change', updateMediaQuery);
    }, [isMobile]);
    return (
        <div className={`pre-web`}>
            <div className="overlay"></div> 
            <Image
                src={isMobile ? bannerMobile : bannerDesktop}
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
                    <h1><Image src={logo} width={200} height={28.75} alt="Logo Fuerte" /></h1>
                    <h2>¡Gracias por estar ac&aacute; preciosa!</h2>
                    <h2>Faltan muy pocos dias.</h2>
                    <h2>Te quiero, Vicky</h2>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon