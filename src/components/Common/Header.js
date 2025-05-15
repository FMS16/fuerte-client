"use client";

import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import "../../styles/Common.css";
import logo from "../../assets/images/logo_small.png";
import MyCart from './MyCart';
import { UserContext } from '@/features/UserContext';
import { useCart } from '@/features/CartContext';
import { useRouter } from 'next/navigation';

import logo2 from "./../../assets/images/logoRecortadoFino.png"

import { actionTypes } from '@/features/UserContext';
import { useCurrency } from '@/features/CurrencyContext';

const Header = () => {
    const [ navVisible, setNavVisible ] = useState(false);
    const [ isMobileOrTablet, setIsMobileOrTablet ] = useState(false);
    const { cart, myCartVisible, setMyCartVisible } = useCart();
    const router = useRouter();

    const { state, dispatch } = useContext(UserContext);
    const { isAuthenticated } = state;

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        const updateMediaQuery = () => setIsMobileOrTablet(mediaQuery.matches);

        updateMediaQuery();
        mediaQuery.addEventListener('change', updateMediaQuery);

        return () => mediaQuery.removeEventListener('change', updateMediaQuery);
    }, [ isAuthenticated, isMobileOrTablet ]);

    const toggleCartVisibility = () => {
        setMyCartVisible(!myCartVisible);
    };

    const toggleMenu = () => {
        setNavVisible(prev => !prev);
    }

    const toggleHrefUser = () => {
        if (state.user == null) {
            router.push('/login')
        } else {
            router.push('/user')
        }
    }

    const { currency, updateCurrency } = useCurrency();

    const handleCurrencyChange = (event) => {
        updateCurrency(event.target.value);
    };

    return (
        <header className='header'>
            <div className="header-pre">
                <div className="ticker-wrapper">
                    <div className="ticker">
                        <div className="ticker-inner">
                            <div className="ticker-item">
                                <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                            <div className="ticker-item">
                             <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                            <div className="ticker-item">
                             <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                            <div className="ticker-item">
                             <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                            <div className="ticker-item">
                             <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                            <div className="ticker-item">
                             <p className='size-small'>Lleg&oacute; el momento de impactar FUERTE!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isMobileOrTablet ? (
                <div className='header-main'>
                    <div className='header-menu-nav header-mobile-nav'>
                        <button onClick={toggleMenu} className='fa-bars' aria-label="Abrir menú">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z"></path>
                            </svg>
                        </button>
                        <button>
                            <Link href='/wishlist' aria-label="Ir a la lista de deseos"><svg strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
                            </svg></Link>
                        </button>
                    </div>
                    <h1 className='header-logo'>
                        <Link href='/' aria-label="Ir a la página principal">
                            <Image
                                src={logo}
                                alt="Logo Fuerte"
                            />
                        </Link>
                    </h1>
                    <div className='header-user-nav header-mobile-nav relative'>
                        <button onClick={toggleHrefUser} aria-label='Ir a mi usuario'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                            </svg>
                        </button>
                        <button className='relative' onClick={toggleCartVisibility} aria-label='Ver el carrito de compras'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M832 312H696v-16c0-101.6-82.4-184-184-184s-184 82.4-184 184v16H192c-17.7 0-32 14.3-32 32v536c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V344c0-17.7-14.3-32-32-32zm-432-16c0-61.9 50.1-112 112-112s112 50.1 112 112v16H400v-16zm392 544H232V384h96v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h224v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h96v456z"></path>
                            </svg>
                        </button>
                        <p className='absolute'>{cart.items.length}</p>
                    </div>
                    <AnimatePresence>
                        {navVisible && (
                            <motion.div
                                className='overlay'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleMenu}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {navVisible && (
                            <motion.nav
                                initial={{ x: '-100%' }}
                                animate={{ x: '0' }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className='nav-menu'>
                                <h1>
                                    <button onClick={toggleMenu}>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path>
                                        </svg>
                                    </button>
                                    <Link onClick={toggleMenu} href="/"><Image src={logo} alt='Logo fuerte' /></Link>
                                </h1>
                                <ul>
                                    <li><Link onClick={toggleMenu} href='/about'>Conocenos <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path><path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path></svg></Link></li>
                                    <li><Link href='/shop' onClick={toggleMenu}>Tienda <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path><path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path></svg></Link></li>
                                    <li><Link href='/faqs' onClick={toggleMenu}>Preguntas Frecuentes <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path><path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path></svg></Link></li>

                                    <li className='currency-container'>
                                        <p><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 192l128 128 128-128z"></path></svg></p>
                                        <select value={currency} onChange={handleCurrencyChange}>
                                            <option value="USD">USD</option>
                                            <option value="UYU">UYU</option>
                                        </select>
                                    </li>
                                </ul>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {myCartVisible && <MyCart />}
                    </AnimatePresence>
                </div>
            ) : (
                <div className='header-main'>
                    <div className='header-logo'>
                        <Link href="/" aria-label="Ir a la página principal" className='relative'><Image src={logo2} alt='logo' fill /></Link>
                    </div>
                    <div className='header-nav'>
                        <ul>
                            <li><Link href='/'>Inicio</Link></li>
                            <li><Link href='/shop'>Tienda</Link></li>
                            <li><Link href='/about'>Conocenos</Link></li>
                            <li><Link href='/faqs'>Preguntas frecuentes</Link></li>

                        </ul>
                    </div>
                    <div className='header-user-nav relative'>
                        <button>
                            <Link href='/wishlist' aria-label="Ir a la lista de deseos"><svg strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
                            </svg></Link>
                        </button>
                        <button onClick={toggleHrefUser} aria-label='Ir a mi usuario'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                            </svg>
                        </button>
                        <button className='relative' onClick={toggleCartVisibility} aria-label='Ver el carrito de compras'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M832 312H696v-16c0-101.6-82.4-184-184-184s-184 82.4-184 184v16H192c-17.7 0-32 14.3-32 32v536c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V344c0-17.7-14.3-32-32-32zm-432-16c0-61.9 50.1-112 112-112s112 50.1 112 112v16H400v-16zm392 544H232V384h96v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h224v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h96v456z"></path>
                            </svg>
                        </button>
                        <p className='absolute'>{cart.items.length}</p>
                    </div>
                    <AnimatePresence>
                        {myCartVisible && <MyCart />}
                    </AnimatePresence>
                </div>
            )}
        </header>
    );
}

export default Header;
