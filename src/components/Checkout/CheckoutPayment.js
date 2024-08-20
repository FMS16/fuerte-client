"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '@/features/CartContext';
import ProductList from '../Common/ProductList';
import ProductItem from '../Common/ProductItem';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CheckoutPayment = ({ onPrevStep, currency, shippingPrice }) => {
    initMercadoPago('APP_USR-1040f80d-874b-405c-a048-61ba84d055c3');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const API_IMG_URL = process.env.NEXT_PUBLIC_BASE_IMG_URL;

    const [ subtotal, setSubtotal ] = useState(0);

    const { cart } = useCart();
    const [ preferenceId, setPreferenceId ] = useState(null);
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    useEffect(() => {
        const fetchData = async () => {
            let items = cart.map(item => ({
                id: item.product.id.toString(),
                title: item.product.name,
                description: item.size.name,
                categoryId: "Ropa deportiva",
                quantity: item.quantity,
                unitPrice: item.product.price,
                currencyId: currency,
                warranty: true,
                eventDate: isoString
            }));

            try {
                const response = await fetch(`${API_BASE_URL}/MercadoPago/create-preference`, {
                    method: 'POST',
                    headers: new Headers({ 'Content-type': 'application/json' }),
                    body: JSON.stringify(items)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPreferenceId(data.id);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const getSubTotal = async () => {
            let subtotal = 0;
            cart.forEach(element => {
                subtotal += element.product.price * element.quantity;
            });
            setSubtotal(subtotal);
        }


        fetchData();
        getSubTotal();
    }, [ cart ]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const childVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <div className='checkout-payment'>
            <h1 className='checkout-title'>Resumen Pago:</h1>
            <div className='checkout-payment-summary'>
                <h2>Subtotal: <span className='price'>${subtotal}</span></h2>
                <h2>Env&iacute;o: <span className='price'>${shippingPrice}</span></h2>
                <h1>Total: <span className='price bold'>${subtotal + shippingPrice}</span></h1>
            </div>
            {preferenceId && (
                <>
                    <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
                    <p className='info'>No es necesario tener una cuenta de MercadoPago para pagar, se puede pagar con tarjeta de cr&eacute;dito y d&eacute;bito sin tener una cuenta.</p>
                </>

            )}
            <button className='btn-prev-step' onClick={onPrevStep}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg> Env&iacute;o</button>
        </div>
    );
}

export default CheckoutPayment;
