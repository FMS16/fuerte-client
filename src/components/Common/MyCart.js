"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/features/CartContext';
import WebLoader from './WebLoader';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCurrency } from '@/features/CurrencyContext';

const MyCart = () => {
    const { cart, myCartVisible, setMyCartVisible, dispatch } = useCart();
    const [ subtotal, setSubTotal ] = useState(0);
    const [ loading, setLoading ] = useState(false);

    const { currency } = useCurrency();

    const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL;



    useEffect(() => {
        const calculatedSubtotal = cart.items.reduce((total, item) => {
            const itemTotal = currency === 'USD'
                ? item.product.priceUSD * item.quantity
                : item.product.priceUYU * item.quantity;
            return total + itemTotal;
        }, 0);

        setSubTotal(calculatedSubtotal);
    }, [ cart.items, currency ]);

    useEffect(() => {
        if (myCartVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [ myCartVisible ]);

    const toggleCartVisibility = () => {
        setMyCartVisible(!myCartVisible);
    };

    const handleQuantity = (number, item) => {
        console.log(item);
        if (number === 1 && item.quantity >= item.productSize.stock) {
            return; // No incrementa si la cantidad es igual o mayor al stock disponible
        }
    
        dispatch({
            type: number === 0 ? 'DECREMENT_QUANTITY' : 'INCREMENT_QUANTITY',
            payload: {
                product: item.product,
                productSize: item.productSize
            }
        });
    };
    


    const removeFromCart = (item) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    };

    const handleToCheckout = () => {
        setLoading(true);
    };

    const myLoader = ({ src }) => {
        return src;
    };

    return (
        <div className='cart-container' id='cart-container'>
            <motion.div className='my-cart'
                id='my-cart'
                initial={{ x: '100%' }}
                animate={{ x: '0' }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className='cart-header'>
                    <button onClick={toggleCartVisibility}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path>
                        </svg>
                    </button>
                    <h1>TU CARRITO</h1>
                </div>
                {cart.items.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='cart-body'>
                        <h1 className='cart-no-items'>Aún no tienes elementos en el carrito.</h1>
                    </motion.div>
                ) : (
                    <div className='cart-body'>
                        <AnimatePresence>
                            {cart.items.map((item, index) => (
                                
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className='cart-item' key={index}>
                                    
                                    <div className='cart-item-image relative'>
                                        <Link onClick={toggleCartVisibility} href={`/product/${item.product.id}`}>
                                            <Image alt={item.product.name} loader={myLoader} fill src={`${baseImgUrl}/${item.product.mainImage}`} />
                                        </Link>
                                    </div>
                                    <div className='cart-item-info'>
                                        <h1 dangerouslySetInnerHTML={{ __html: item.product.name }}  />
                                        <h2 className='price'>
                                            ${currency === 'USD' ? item.product.priceUSD : item.product.priceUYU}
                                        </h2>
                                        <h2>{item.productSize.size.name}</h2>
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
                                                    disabled={item.quantity >= item.product.stock}
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
                                    <Link onClick={toggleCartVisibility} href='/checkout'>LO QUIERO!</Link>
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
