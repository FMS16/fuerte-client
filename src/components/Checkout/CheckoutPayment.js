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

    const [ loadingOrder, setLoadingOrder ] = useState(false);
    const [ loadingCoupon, setLoadingCoupon] = useState(false);

    const { state } = useContext(UserContext);
    const { cart } = useCart();
    const { currency, updateCurrency } = useCurrency();
    const router = useRouter();


    const [ couponDiscount, setCouponDiscount ] = useState(0); // Estado para el descuento del cupón
    const [ couponCode, setCouponCode ] = useState(""); // Estado para almacenar el código del cupón


    const [ usingCoupon, setUsingCoupon ] = useState(false);

    const [ total, setTotal ] = useState(0);

    const [ subtotal, setSubtotal ] = useState(0);
    const [ order, setOrder ] = useState(null);
    const [ paymentResponse, setPaymentResponse ] = useState(null);

    const [ isOrdenConfirmed, setOrdenIsConfirmed ] = useState(false);

    const [ saved, setSaved ] = useState(0);

    // Calculate subtotal once on mount
    useEffect(() => {
        const getSubTotal = () => {
            let subtotal = 0;
            cart.items.forEach(element => {
                subtotal += currency === "USD" ? element.product.priceUSD : element.product.priceUYU * element.quantity;
            });
            setSubtotal(subtotal);

            // Calcula el total basado en el subtotal
            let totalFunction = currency === "USD" ? subtotal + 15 : subtotal + 250;

            if (couponDiscount !== 0) {
                // Asegúrate de aplicar el descuento correctamente
                let discountAmount = (totalFunction * (couponDiscount / 100));
                totalFunction = totalFunction - discountAmount;
                setSaved(discountAmount);
            }

            setTotal(totalFunction);
        };

        getSubTotal();
    }, [ cart, currency, usingCoupon, couponDiscount, saved ]);


    // Fetch order data once on mount
    useEffect(() => {
        setLoading(false);
    }, []);


    const [ shippingPrice, setShippingPrice ] = useState(
        (shippingDetails && shippingDetails.country === "Ecuador") ? 15 : 250
    );

    useEffect(() => {

        if (shippingDetails.country == "Ecuador") {
            updateCurrency("USD")
        } else {
            updateCurrency("UYU");
        }
        if (shippingDetails && shippingDetails.country) {
            setShippingPrice(shippingDetails.country === "Ecuador" ? 15 : 250);
        }
    }, [ shippingDetails ]);

    if (loading) {
        return <WebLoader />
    }

    const confirmOrder = async () => {
        setLoadingOrder(true);
        try {
            let items = [];
            cart.items.forEach(item => {
                const object = {
                    "productId": item.product.id,
                    "sizeId": item.productSize.size.id,
                    "quantity": item.quantity
                };
                items.push(object);
            });
            const response = await fetch(`${API_BASE_URL}/order/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "orderProductRequests": items,
                    "userId": state.user ? state.user?.logged.id : -1,
                    "name": userDetails.name,
                    "lastName": userDetails.lastName,
                    "phone": userDetails.phone,
                    "email": userDetails.email,
                    "paymentId": null,
                    "paymentStatus": "pending",
                    "address": shippingDetails,
                    "dateBorn": userDetails.dateBorn,
                    "idCard": userDetails.idCard,
                    "amountDiscount": couponDiscount,
                    "shippingPrice": shippingPrice,
                    "currency": currency
                })
            });

            const responseAdd = await response.json();
            if (responseAdd.data != null) {
                setOrder(responseAdd.data);
                setOrdenIsConfirmed(true);
            } else {
                toast.info('Hubo un error, intente más tarde', {
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
        }finally{
            setLoadingOrder(false);
        }
    };



    const validateCoupon = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        setLoadingCoupon(true);
        try {
            const response = await fetch(`${API_BASE_URL}/order/check-coupon?coupon=${couponCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.isSuccess && data.data) {
                setCouponDiscount(data.data); // Actualiza el descuento del cupón
                setUsingCoupon(true);
                toast.success(data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error(data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            toast.error("Error al validar el cupón.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }finally{
            setLoadingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        // Restablece el estado del cupón
        setCouponDiscount(0);
        setCouponCode("");
        setUsingCoupon(false);
        setSaved(0);
        // Recalcula el total con el descuento restablecido
        setTotal(subtotal + (currency === "USD" ? 15 : 250));
        toast.info('Cupón eliminado.', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };


    return (
        <div className='checkout-payment'>
            <h1 className='checkout-title'>Resumen Orden:</h1>
            <div className='checkout-payment-summary'>
                <ul className='checkout-items'>
                    {cart.items.map((item, index) =>
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
                {saved != 0 && (<h2>Descuento: <span className='price saved'> -${saved}</span></h2>)}
                <h1>Total: <span className='price bold'>${total}</span></h1>
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
                                        "idCard": userDetails.idCard,
                                        "amountDiscount": couponDiscount,
                                        "shippingPrice": shippingPrice,
                                        "currency": currency
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
            {order == null && !isOrdenConfirmed && (
                <div className='checkout-coupon'>
                    <h1>¿Tienes un cup&oacute;n?</h1>
                    <form className='form-checkout-coupon' onSubmit={validateCoupon}>
                        <input
                            type='text'
                            className='input-text'
                            placeholder='Cupón de descuento'
                            value={couponCode}
                            required
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        {loadingCoupon ? <button className='input-btn btn-loader'><div className='loader'></div></button> : <button disabled={usingCoupon} type='submit' className='input-btn'>Aplicar</button>}
                    </form>
                    {usingCoupon && (
                        <div className='flex justify-between remove-coupon'>
                            <p><span className='saved'>{couponDiscount}% descuento aplicado</span></p>
                            <button onClick={handleRemoveCoupon} className='remove-coupon-btn'>Eliminar</button>
                        </div>
                    )}
                </div>
            )}
            {shippingDetails.country === "Ecuador" && !isOrdenConfirmed && order == null && (
                <>
                    <div className='order-payment-method'>
                        <h1>Seleccione el m&eacute;todo de pago</h1>
                        <div className='input-field-checkbox'>
                            <input id='order-payment-method-transfer' type='radio' />
                            <label htmlFor='order-payment-method-transfer'>Transferencia bancaria</label>
                        </div>
                    </div>
                    <div className='order-payment-method-nav'>
                        <button className='btn-prev-step' onClick={onPrevStep}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path>
                            </svg> Env&iacute;o
                        </button>
                        {loadingOrder ? <button className='btn-form btn-loader'><div className='loader'></div></button> : <button onClick={confirmOrder} className='btn-form input-btn'>Confirmar orden</button>}  
                    </div>
                </>
            )}
            {shippingDetails.country === "Ecuador" && order != null && isOrdenConfirmed && (
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
                        <li>Env&iacute;as tu comprobante <a href='https://wa.link/ip2hee'>aqu&iacute;</a></li>
                        <li>¡Listo!</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default CheckoutPayment;
