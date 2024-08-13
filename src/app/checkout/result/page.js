"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '@/features/UserContext';
import { useCart } from '@/features/CartContext';
import Success from '@/components/Payment/Success';
import Pending from '@/components/Payment/Pending';
import Failure from '@/components/Payment/Failure';

const Page = () => {
    const searchParams = useSearchParams();
    const { cart, dispatch } = useCart();
    const { state } = useContext(UserContext);
    const { isAuthenticated } = state;
    const [ paymentStatus, setPaymentStatus ] = useState(null); // Estados: 'loading', 'success', 'pending', 'failure'
    const paymentId = Number(searchParams.get('payment_id'));

    useEffect(() => {
        if (paymentStatus === 'success' && paymentId) {
            const verifyAndCreateOrder = async () => {
                try {
                    // Primero verifica si la orden ya existe
                    const verifyResponse = await fetch(`https://localhost:7207/order/check-order-exists-payment-id?paymentId=${paymentId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!verifyResponse.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const verifyData = await verifyResponse.json();
                    if (verifyData.data == null) {
                        // La orden no existe, crea una nueva
                        let items = [];
                        cart.map(item => {
                            const object = {
                                "productId": item.product.id,
                                "sizeId": item.size.id,
                                "quantity": item.quantity
                            }
                            items.push(object);
                        });
                        console.log(items);
                        const response = await fetch('https://localhost:7207/order/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "orderProductRequests": items,
                                "userId": isAuthenticated != null ? user.id : -1,
                                "name": "nombre",
                                "lastName": "nombre",
                                "phone": "092363626",
                                "email": "mailpruebaorden52@mail.com",
                                "paymentId": paymentId
                            })
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        // Manejar la respuesta de la creación de la orden aquí
                        const responseAdd = await response.json();
                        console.log(responseAdd);
                    } else {
                        // La orden ya existe, manejar si es necesario
                    }

                } catch (error) {
                    console.error('Error handling order creation:', error);
                } finally {
                    
                }
            };

            verifyAndCreateOrder();
        }
    }, [ paymentStatus, paymentId ]);

    useEffect(() => {
        const paymentId = Number(searchParams.get('payment_id'));
        if (paymentId) {
            const object = { "paymentId": paymentId };
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://localhost:7207/MercadoPago/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(object)
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    // Manejo de diferentes estados de pago
                    if (data.data === "approved") {
                        setPaymentStatus('success');
                    } else if (data.data === "pending") {
                        setPaymentStatus('pending');
                    } else if (data.data === "failure") {
                        setPaymentStatus('failure');
                    } else {
                        setPaymentStatus('failure'); // Manejo por defecto para estados desconocidos
                    }
                } catch (error) {
                    setPaymentStatus('failure');
                }
            };

            fetchData();
        }
    }, [ searchParams, paymentId ]);


    // Mostrar el resultado basado en el estado del pago
    return (
        <div>
            {paymentStatus === 'success' && <Success paymentId={paymentId} />}
            {paymentStatus === 'pending' && <Pending paymentId={paymentId} />}
            {paymentStatus === 'failure' && <Failure paymentId={paymentId} />}
        </div>
    );
};

export default Page;
