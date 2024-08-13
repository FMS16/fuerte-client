"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/features/CartContext';
import WebLoader from './WebLoader';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MyCart = () => {
    const { cart, myCartVisible, setMyCartVisible, dispatch } = useCart();
    const [ subtotal, setSubTotal ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const baseUrl = "https://localhost:7207/uploads";

    useEffect(() => {
        const calculatedSubtotal = cart.reduce((total, item) => {
            const itemTotal = item.product.price * item.quantity;
            return total + itemTotal;
        }, 0);

        setSubTotal(calculatedSubtotal);
    }, [ cart ]);

    useEffect(() => {
        if (myCartVisible) {
            document.body.style.overflow = 'hidden';
        }
    }, [ myCartVisible ]);

    const toggleCartVisibility = () => {
        if (myCartVisible) {
            setMyCartVisible(false);
            document.body.style.overflow = 'auto';
        } else {
            setMyCartVisible(true);
            document.body.style.overflow = 'hidden';
        }

    };


    const handleQuantity = (number, item) => {
        dispatch({ type: number === 0 ? 'DECREMENT_QUANTITY' : 'INCREMENT_QUANTITY', payload: { id: item.product.id, size: item.size } });
    };

    const removeFromCart = (item) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    };

    const handleToCheckout = () => {
        setLoading(true);
    };

    return (
        <div className='cart-container' id='cart-container'>
            <motion.div className='my-cart'
                id='my-cart'
                initial={{ x: '100%' }}
                animate={{ x: '0' }}
                exit={{ x: '100%' }}>
                <div className='cart-header'>
                    <button onClick={toggleCartVisibility}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg></button>
                    <h1>TU CARRITO</h1>
                </div>
                {cart.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='cart-body'>
                        <h1 className='cart-no-items'>Aún no tienes elementos en el carrito.</h1>
                    </motion.div>
                ) : (
                    <div className='cart-body'>
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className='cart-item' key={index}>
                                    <div className='cart-item-image'>
                                        <img src={`${baseUrl}/${item.product.image}`} />
                                    </div>
                                    <div className='cart-item-info'>
                                        <h1>{item.product.name}</h1>
                                        <h2 className='price'>${item.product.price}</h2>
                                        <h2>{item.size.name}</h2>
                                        <div className='cart-item-options-container'>
                                            <div className='quantity-container'>
                                                <button
                                                    disabled={item.quantity === 1}
                                                    onClick={() => handleQuantity(0, item)}
                                                    className='cart-quantity-decrement'
                                                >
                                                    -
                                                </button>
                                                <button className='cart-quantity'>{item.quantity}</button>
                                                <button
                                                    disabled={item.quantity >= 5}
                                                    onClick={() => handleQuantity(1, item)}
                                                    className='cart-quantity-increment'
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p onClick={() => removeFromCart(item)}>Eliminar</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className='cart-footer'>
                            <div className='cart-subtotal'>
                                <p>Subtotal:</p>
                                <p className='price'>${subtotal}</p>
                            </div>
                            <div className='cart-navigate'>
                                <button className='cart-checkout'>
                                    <Link onClick={toggleCartVisibility} href='/checkout'>LO QUIERO <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg>
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
            <AnimatePresence>
                {myCartVisible && (
                    <motion.div
                        className='overlay'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCartVisibility}
                    />
                )}
            </AnimatePresence>
            {loading && <WebLoader />}
        </div>
    );
};

export default MyCart;
