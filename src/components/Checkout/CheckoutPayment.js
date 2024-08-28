"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Card from '@mercadopago/sdk-react/bricks/cardPayment';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useCart } from '@/features/CartContext';
import { UserContext } from '@/features/UserContext';
import { useCurrency } from '@/features/CurrencyContext';
import "../../styles/Common.css";
import WebLoader from '../Common/WebLoader';

initMercadoPago('APP_USR-1040f80d-874b-405c-a048-61ba84d055c3', { locale: 'es-UY' });

const CheckoutPayment = ({ onPrevStep, userDetails, shippingDetails }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [ loading, setLoading ] = useState(true);
    const { state } = useContext(UserContext);
    const { cart } = useCart();
    const { currency } = useCurrency();
    const router = useRouter();

    const [ subtotal, setSubtotal ] = useState(0);
    const [ order, setOrder ] = useState(null);
    const [ paymentResponse, setPaymentResponse ] = useState(null);

    // Calculate subtotal once on mount
    useEffect(() => {
        const getSubTotal = () => {
            let subtotal = 0;
            cart.forEach(element => {
                subtotal += currency === "USD" ? element.product.priceUSD : element.product.priceUYU * element.quantity;
            });
            setSubtotal(subtotal);
        };
        getSubTotal();

    }, [ cart, currency ]); // Depend on cart and currency


    // Fetch order data once on mount
    useEffect(() => {
        if (shippingDetails.country === "Ecuador") {
            const fetchData = async () => {
                try {
                    let items = [];
                    cart.forEach(item => {
                        const object = {
                            "productId": item.product.id,
                            "sizeId": item.size.id,
                            "quantity": item.quantity
                        };
                        items.push(object);
                    });

                    const response = await fetch(`${API_BASE_URL}/order/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "orderProductRequests": items,
                            "userId": state.user ? state.user.id : -1,
                            "name": userDetails.name,
                            "lastName": userDetails.lastName,
                            "phone": userDetails.phone,
                            "email": userDetails.email,
                            "paymentId": null,
                            "paymentStatus": "pending",
                            "address": shippingDetails,
                            "dateBorn": userDetails.dateBorn,
                            "idCard": userDetails.idCard
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const responseAdd = await response.json();
                    setOrder(responseAdd.data);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    toast.error(error.message, {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            };

            fetchData();
        } else {
            setLoading(false);
        }

    }, []);

    
    const [ shippingPrice, setShippingPrice ] = useState(
        (shippingDetails && shippingDetails.country === "Ecuador") ? 15 : 250
    );

    useEffect(() => {
        if (shippingDetails && shippingDetails.country) {
          setShippingPrice(shippingDetails.country === "Ecuador" ? 15 : 250);
        }
      }, [shippingDetails]);

    if (loading) {
        return <WebLoader />
    }


    return (
        <div className='checkout-payment'>
            <h1 className='checkout-title'>Resumen Pago:</h1>
            <div className='checkout-payment-summary'>
                <ul className='checkout-items'>
                    {cart.map((item, index) =>
                        <li key={index}>
                            <div>
                                <span>{item.product.name}</span>
                                <span>x{item.quantity}</span>
                            </div>
                            <div>
                                <span className='price'>${(currency === "USD" ? item.product.priceUSD : item.product.priceUYU) * item.quantity}</span>
                            </div>
                        </li>
                    )}
                </ul>
                <h2>Env&iacute;o: <span className='price'>${currency === "USD" ? 15 : 250}</span></h2>
                <h1>Total: <span className='price bold'>${subtotal + (currency === "USD" ? 15 : 250)}</span></h1>
            </div>
            {shippingDetails.country === 'Uruguay' && (
                <Card
                    initialization={{ amount: subtotal * shippingPrice }}
                    onSubmit={async (param) => {
                        const response = await fetch(`${API_BASE_URL}/MercadoPago/process-payment`, {
                            method: 'POST',
                            headers: new Headers({ 'Content-type': 'application/json' }),
                            body: JSON.stringify({
                                transactionAmount: subtotal * shippingPrice,
                                token: param.token,
                                description: "Pago FUERTE.",
                                installments: param.installments,
                                paymentMethodId: param.payment_method_id,
                                payerEmail: param.payer.email,
                                issuerId: param.issuer_id
                            }),
                        });
                        const data = await response.json();
                        if (data.data.status === "approved") {
                            try {
                                let items = [];
                                cart.forEach(item => {
                                    const object = {
                                        "productId": item.product.id,
                                        "sizeId": item.size.id,
                                        "quantity": item.quantity
                                    };
                                    items.push(object);
                                });

                                const response = await fetch(`${API_BASE_URL}/order/add`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        "orderProductRequests": items,
                                        "userId": state.user ? state.user.id : -1,
                                        "name": userDetails.name,
                                        "lastName": userDetails.lastName,
                                        "phone": userDetails.phone,
                                        "email": userDetails.email,
                                        "paymentId": null,
                                        "paymentStatus": "pending",
                                        "address": shippingDetails,
                                        "dateBorn": userDetails.dateBorn,
                                        "idCard": userDetails.idCard
                                    })
                                });

                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }

                                const responseAdd = await response.json();
                                if (responseAdd.isSuccess) {
                                    router.push(`/sucess-payment?paymentId=${data.data.id}`);
                                } else {
                                    toast.info(`Su pago se procesó pero tuvimos un error. ¡No es tu culpa! En breves nos comunicaremos contigo a ${userDetails.email}`, {
                                        position: "bottom-right",
                                        autoClose: 10000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                    });
                                }
                            } catch (error) {
                                toast.error(error.message, {
                                    position: "bottom-right",
                                    autoClose: 1500,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }
                        } else if (data.data.status === "rejected") {
                            toast.error('Su entidad bancaria ha rechazado el pago. Consulte el saldo disponible.', {
                                position: "bottom-right",
                                autoClose: 10000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        } else if (data.data.status === "in_process" || data.data.status === "pending") {
                            toast.warn('Su pago no se procesó y está pendiente. Intente más tarde o con otro método de pago.', {
                                position: "bottom-right",
                                autoClose: 10000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                        setPaymentResponse(data.data);
                    }}
                />
            )}
            {shippingDetails.country === "Ecuador" && order != null && (
                <div className='checkout-transfer'>
                    <h1>Tu Id de compra es: <span>{order.id}</span></h1>
                    <ol className='transfer-steps'>
                        <h2>Qu&eacute; debo hacer?</h2>
                        <li>Transferir el monto total a la siguiente cuenta:</li>
                        <ul className='transfer-bank-information'>
                            <li>Banco: Banco Pichincha</li>
                            <li>Caja de ahorro: <span className='bold'>2207816263</span></li>
                            <li>Referencia de la transferencia: <span className='bold'>{order.id}</span></li>
                            <li>Titular: Viktoriya Turusha</li>
                            <li>Pasaporte: CD098553</li>
                        </ul>
                        <li>Env&iacute;as tu comprobante <a href=''>aqu&iacute;</a></li>
                        <li>¡Listo!</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default CheckoutPayment;
