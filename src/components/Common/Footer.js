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
                            <li><Link href='/faqs'>Contacto</Link></li>
                        </ul>
                    </div>
                    <div className='footer-list'>
                        <h1 className='footer-list-title'>Cuenta</h1>
                        <ul>
                            <li><Link href={state.user == null ? '/' : '/user'}>Mi cuenta</Link></li>
                            <li><Link href='/wishlist'>Mis favoritos</Link></li>
                            <li><Link href={state.user == null ? '/' : '/user'}>Mis compras</Link></li>
                        </ul>
                    </div>
                    <div className='footer-list'>
                        <h1 className='footer-list-title'>Sobre FUERTE</h1>
                        <ul>
                            <li><Link href='/about'>Nosotros</Link></li>
                            <li><Link href='/about'>Prop&oacute;sito</Link></li>
                        </ul>
                    </div>
                    <div className='social-footer-list'>
                        <ul>
                            <li><Link aria-label="Contacta a través de WhatsApp" href='https://wa.link/ip2hee'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" t="1569683925316" viewBox="0 0 1024 1024" version="1.1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M713.5 599.9c-10.9-5.6-65.2-32.2-75.3-35.8-10.1-3.8-17.5-5.6-24.8 5.6-7.4 11.1-28.4 35.8-35 43.3-6.4 7.4-12.9 8.3-23.8 2.8-64.8-32.4-107.3-57.8-150-131.1-11.3-19.5 11.3-18.1 32.4-60.2 3.6-7.4 1.8-13.7-1-19.3-2.8-5.6-24.8-59.8-34-81.9-8.9-21.5-18.1-18.5-24.8-18.9-6.4-0.4-13.7-0.4-21.1-0.4-7.4 0-19.3 2.8-29.4 13.7-10.1 11.1-38.6 37.8-38.6 92s39.5 106.7 44.9 114.1c5.6 7.4 77.7 118.6 188.4 166.5 70 30.2 97.4 32.8 132.4 27.6 21.3-3.2 65.2-26.6 74.3-52.5 9.1-25.8 9.1-47.9 6.4-52.5-2.7-4.9-10.1-7.7-21-13z"></path><path d="M925.2 338.4c-22.6-53.7-55-101.9-96.3-143.3-41.3-41.3-89.5-73.8-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6 0.3-119.3 12.3-174.5 35.9-53.3 22.8-101.1 55.2-142 96.5-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9 0.3 69.4 16.9 138.3 48 199.9v152c0 25.4 20.6 46 46 46h152.1c61.6 31.1 130.5 47.7 199.9 48h2.1c59.9 0 118-11.6 172.7-34.3 53.5-22.3 101.6-54.3 142.8-95.2 41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5 0.3-60.9-11.5-120-34.8-175.6z m-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-0.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-0.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-0.6 99.6-39.7 192.9-110.1 262.7z"></path></svg></Link></li>
                            <li><Link aria-label="Síguenos a través de Instagram" href='https://www.instagram.com/fuerteactive?igsh=MWdjZWJtYmd6ajB4Mw=='><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 0 0-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"></path></svg></Link></li>
                            <li><Link aria-label="Síguenos a través de TikTok" href='https://www.tiktok.com/@fuerteactive?_r=1&_d=e46f49ghccjac3&sec_uid=MS4wLjABAAAADLxUNP0Ev3MznD0sNTb7gBFHbuG0WpY1-SNvKL7PiTmaBe4tPvniFogImRAJ3CMO&share_author_id=7381497027819471878&sharer_language=es&source=h5_m&u_code=eej1l7a239a4j1&ug_btm=b8727,b0&social_share_type=4&utm_source=copy&sec_user_id=MS4wLjABAAAADLxUNP0Ev3MznD0sNTb7gBFHbuG0WpY1-SNvKL7PiTmaBe4tPvniFogImRAJ3CMO&tt_from=copy&utm_medium=ios&utm_campaign=client_share&enable_checksum=1&user_id=7381497027819471878&share_link_id=D77D5596-30A6-4F1D-BEC0-DCC1C66CF54E&share_app_id=1233'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path></svg></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='footer-copyright'>
                <span>2024 Fuerte & developed by <a href='mailto:martinsecondo16@gmail.com'>Fabricio Secondo</a>.</span>
            </div>
        </footer>
    )
}

export default Footer