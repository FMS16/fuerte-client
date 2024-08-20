"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '@/features/UserContext';
import { useCart } from '@/features/CartContext';
import Success from '@/components/Payment/Success';
import Pending from '@/components/Payment/Pending';
import Failure from '@/components/Payment/Failure';
import { useRouter } from 'next/navigation';

const Page = () => {
    const searchParams = useSearchParams();
    const { cart, dispatch } = useCart();
    const { state } = useContext(UserContext);
    const [ paymentStatus, setPaymentStatus ] = useState(null); // Estados: 'loading', 'success', 'pending', 'failure'
    const paymentId = Number(searchParams.get('payment_id'));
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const router = useRouter();

    useEffect(() => {
        if (paymentStatus === 'success' || paymentStatus == "pending" && paymentId) {
            const verifyAndCreateOrder = async () => {
                try {
                    // Primero verifica si la orden ya existe
                    const verifyResponse = await fetch(`${API_BASE_URL}/order/check-order-exists-payment-id?paymentId=${paymentId}`, {
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
                        const response = await fetch(`${API_BASE_URL}/order/add`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "orderProductRequests": items,
                                "userId": state.user !== null ? state.user.id : -1,
                                "name": "nombre",
                                "lastName": "nombre",
                                "phone": "092363626",
                                "email": "mailpruebaorden52@mail.com",
                                "paymentId": paymentId,
                                "paymentStatus": paymentStatus
                            })
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        // Manejar la respuesta de la creación de la orden aquí
                        const responseAdd = await response.json();

                        toast.info(responseAdd.message, {
                            position: "bottom-right",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });

                    } else {
                        if(paymentStatus === "pending" && paymentId){
                            const object = { "paymentId": paymentId };
                            try {
                                const response = await fetch(`${API_BASE_URL}/MercadoPago/verify-payment`, {
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
                                    router.push('/');
                                }
                            } catch (error) {
                                router.push('/');
                            }
                        }
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
                    const response = await fetch(`${API_BASE_URL}/MercadoPago/verify-payment`, {
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
                    } else if(data.data == null) {
                        setPaymentStatus('not-found');
                    }else{
                        router.push('/')
                    }
                } catch (error) {
                    router.push('/')
                }
            };

            fetchData();
        }else{
            router.push('/')
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
