"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    initMercadoPago,
    createCardToken,
    CardNumber,
    SecurityCode,
    ExpirationDate,
} from '@mercadopago/sdk-react';
import {
    getIdentificationTypes,
    getPaymentMethods,
    getIssuers,
    getInstallments,
} from '@mercadopago/sdk-react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';


import Card, { useCardPaymentBrick } from '@mercadopago/sdk-react/bricks/cardPayment';

import { useCart } from '@/features/CartContext';
import "../../styles/Common.css"
import Success from '../Payment/Success';
initMercadoPago('APP_USR-1040f80d-874b-405c-a048-61ba84d055c3', { locale: 'es-UY' });


const CheckoutPayment = ({ onPrevStep, currency, shippingPrice }) => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [ subtotal, setSubtotal ] = useState(0);
    const { cart } = useCart()

    const router = useRouter();

    useEffect(() => {
        const getSubTotal = async () => {
            let subtotal = 0;
            cart.forEach(element => {
                subtotal += element.product.price * element.quantity;
            });
            setSubtotal(subtotal);
        };
        getSubTotal();
    }, [ cart ]);


    const [paymentResponse, setPaymentResponse] = useState(null);


    return (
        <div className='checkout-payment'>
            <h1 className='checkout-title'>Resumen Pago:</h1>
            <div className='checkout-payment-summary'>
                <h2>Subtotal: <span className='price'>${subtotal}</span></h2>
                <h2>Env&iacute;o: <span className='price'>${shippingPrice}</span></h2>
                <h1>Total: <span className='price bold'>${subtotal + shippingPrice}</span></h1>
            </div>
            <Card
                initialization={{ amount: subtotal + shippingPrice }}
                onSubmit={async (param) => {
                    const response = await fetch(`${API_BASE_URL}/MercadoPago/process-payment`, {
                        method: 'POST',
                        headers: new Headers({ 'Content-type': 'application/json' }),
                        body: JSON.stringify({
                            transactionAmount: subtotal + shippingPrice,
                            token: param.token,
                            description: "Descripción de la transacción",  // Asegúrate de que este campo esté presente y con un valor
                            installments: param.installments,
                            paymentMethodId: param.payment_method_id,
                            payerEmail: param.payer.email,
                            issuerId: param.issuer_id
                        }),
                    });
                    const data = await response.json();
                    console.log(data);

                    if(data.data.status == 'rejected'){
                        
                    }else if(data.data.status == 'pending'){
                        
                    }
                    setPaymentResponse(data.data);
                }}
            />
            <button className='btn-prev-step' onClick={onPrevStep}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path>
                </svg> Env&iacute;o
            </button>
        </div>
    );
}

export default CheckoutPayment;