"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import Newsletter from './Newsletter'
import { useContext } from 'react'
import { UserContext } from '@/features/UserContext'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';


const Footer = () => {
    const [ isMobileOrTablet, setIsMobileOrTablet ] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        const updateMediaQuery = () => setIsMobileOrTablet(mediaQuery.matches);

        updateMediaQuery();
        mediaQuery.addEventListener('change', updateMediaQuery);

        return () => mediaQuery.removeEventListener('change', updateMediaQuery);
    }, []);
    const { state } = useContext(UserContext);
    const router = useRouter();
    const toggleHrefUser = () => {
        if (state.user == null) {
            router.push('/login')
        } else {
            router.push('/user')
        }
    }
    return (
        <footer className='footer'>
            <div className='footer-container'>
                
                <div className='footer-item'>
                    <Newsletter />
                </div>
                <div className='footer-item footer-links c-flex'>
                    <div className='footer-list'>
                        <h1 className='footer-list-title'>Informaci&oacute;n</h1>
                        <ul>
                            <li><Link href='/faqs'>Preguntas frecuentes</Link></li>
                            <li><Link href='/faqs'>Env&iacute;os</Link></li>
                            <li><Link href='/faqs'>Devoluciones</Link></li>
                            <li><Link href='/faqs'>Gu&iacute;a de tallas</Link></li>
                            <li><Link href='/contact'>Contacto</Link></li>
                        </ul>
                    </div>
                    <div className='footer-list'>
                        <h1 className='footer-list-title'>Cuenta</h1>
                        <ul>
                            <li onClick={toggleHrefUser}><a>Mi cuenta</a></li>
                            <li><Link href='/wishlist'>Mis favoritos</Link></li>
                            <li onClick={toggleHrefUser}><a >Mis compras</a></li>
                        </ul>
                    </div>
                    <div className='footer-list'>
                        <h1 className='footer-list-title'>Sobre FUERTE</h1>
                        <ul>
                            <li><Link href='/about'>Nosotros</Link></li>
                            <li><Link href='/about'>Prop&oacute;sito</Link></li>
                        </ul>
                    </div>
                    
                </div>
            </div>
            <div className='footer-copyright'>
                <span>2024 Fuerte & developed by Fabricio Secondo.</span>
            </div>
        </footer>
    )
}

export default Footer