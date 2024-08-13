"use client";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

import React, { useEffect, useState, useContext } from 'react';
import { useCart } from '@/features/CartContext';
import WebLoader from './WebLoader';
import { UserContext } from '@/features/UserContext';

const Checkout = () => {
    const { state } = useContext(UserContext);
    const { isAuthenticated } = state;
    initMercadoPago('APP_USR-1040f80d-874b-405c-a048-61ba84d055c3');
    const { cart } = useCart();
    const [ preferenceId, setPreferenceId ] = useState(null);
    useEffect(() => {
        let items = [];
        cart.map(item => {
            const object = {
                "id": item.product.id.toString(),
                "title": item.product.name,
                "description": item.size.name,
                "categoryId": "Ropa deportiva",
                "quantity": 7,
                "unitPrice": 1000,
                "currencyId": "UYU",
                "warranty": true,
                "eventDate": "2024-08-12T20:30:30.266Z"
            }
            items.push(object);
        });

        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:7207/MercadoPago/create-preference`, {
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
                console.error('Error fetching products:', error);;
            }
        };

        fetchData();

    }, [])

    return (
        <>
            {preferenceId != null && (
                <div className='checkout'>
                    <form className='form-checkout'>
                        <div className='form-checkout-input-container'>
                            <input type='text' placeholder='Nombre' />
                            <input type='text' placeholder='Apellido' />
                        </div>
                        <div className='form-checkout-input-container'>
                            <input type='text' placeholder='Teléfono' />
                            {isAuthenticated ? (
                                <input type='text' placeholder='Email' value={state.user.email} readOnly />
                            ) : (
                                <input type='text' placeholder='Email' />
                            )}
                        </div>
                    </form>
                    <Wallet 
                        initialization={{ preferenceId }}
                        customization={{ texts: { valueProp: 'smart_option' } }}
                    />
                </div>
            )}
        </>
    );
};

export default Checkout;
