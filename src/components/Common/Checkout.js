"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useCart } from '@/features/CartContext';
import Image from 'next/image';
import logo from "../../assets/images/logoRecortadoFino.png"
import { UserContext } from '@/features/UserContext';
import "../../styles/Common.css";
import CheckoutUserDetails from '../Checkout/CheckoutUserDetails';
import { motion } from 'framer-motion';
import CheckoutShipping from '../Checkout/CheckoutShipping';
import CheckoutPayment from '../Checkout/CheckoutPayment';

const Checkout = () => {
    const { state } = useContext(UserContext);
    const [ currentStep, setCurrentStep ] = useState('USER_DETAILS');
    const [ checkoutData, setCheckoutData ] = useState({
        userDetails: {},
        shippingDetails: {},
        paymentDetails: {},
    });
    const [ isOrderSummaryVisible, setOrderSummaryVisible ] = useState(false);

    const handleNextStep = () => {
        setCurrentStep(prevStep => {
            switch (prevStep) {
                case 'USER_DETAILS': return 'SHIPPING';
                case 'SHIPPING': return 'PAYMENT';
                case 'PAYMENT': return 'SUMMARY';
                default: return prevStep;
            }
        });
    };

    const handlePreviousStep = () => {
        setCurrentStep(prevStep => {
            switch (prevStep) {
                case 'SHIPPING': return 'USER_DETAILS';
                case 'PAYMENT': return 'SHIPPING';
                case 'SUMMARY': return 'PAYMENT';
                default: return prevStep;
            }
        });
    };

    const updateCheckoutData = (newData) => {
        setCheckoutData(prevData => ({
            ...prevData,
            ...newData
        }));
    };

    useEffect(() => {

    }, [ checkoutData ]);

    return (
        <>
            <div className='checkout container-90'>
                {isOrderSummaryVisible && (
                    <div className='checkout-order-summary'>
                    </div>
                )}
                <p className='checkout-logo'><Image  src={logo} width={160} height={20} alt='Logo' /></p>
                
                <div className='checkout-process-info'>
                    <ol className='relative'>
                        <li className={currentStep === 'USER_DETAILS' ? 'active' : ''}>
                            Datos
                            {currentStep === 'USER_DETAILS' ? <motion.div layoutId="tab-indicator" className="product-details-active-size"></motion.div> : null}
                        </li>
                        <li className={currentStep === 'SHIPPING' ? 'active' : ''}>
                            Env&iacute;o
                            {currentStep === 'SHIPPING' ? <motion.div layoutId="tab-indicator" className="product-details-active-size"></motion.div> : null}
                        </li>
                        <li className={currentStep === 'PAYMENT' ? 'active' : ''}>
                            Pago
                            {currentStep === 'PAYMENT' ? <motion.div layoutId="tab-indicator" className="product-details-active-size"></motion.div> : null}
                        </li>
                        <li className={currentStep === 'SUMMARY' ? 'active' : ''}>Confirmaci&oacute;n</li>
                    </ol>
                </div>
                 {currentStep === 'USER_DETAILS' && (
                    <CheckoutUserDetails
                        userDetails={checkoutData.userDetails ?? {}} // Proporciona un objeto vacío por defecto
                        onNextStep={handleNextStep}
                        updateData={updateCheckoutData}
                    />
                )}
                {currentStep === 'SHIPPING' && (
                    <CheckoutShipping
                        onNextStep={handleNextStep}
                        onPrevStep={handlePreviousStep}
                        userDetails = {checkoutData.userDetails}
                        updateData={updateCheckoutData}
                        shippingDetails = {checkoutData.shippingDetails ?? {}}
                    />
                )} 
                {currentStep === 'PAYMENT' && (
                    <CheckoutPayment
                        onPrevStep={handlePreviousStep}
                        userDetails = {checkoutData.userDetails}
                        shippingDetails={checkoutData.shippingDetails}

                    />
                )}
            </div>

        </>
    );
};

export default Checkout;
