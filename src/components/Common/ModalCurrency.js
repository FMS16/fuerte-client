"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCurrency } from '@/features/CurrencyContext';

const ModalCurrency = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const { currency, updateCurrency } = useCurrency();

    useEffect(() => {
        const selectedCurrency = sessionStorage.getItem('currency'); // Cambiado de 'selectedCurrency' a 'currency'
        if (!selectedCurrency) {
            setShouldRender(true);
            setIsModalOpen(true);
        }
    }, []);

    const handleCurrencyChange = (currency) => {
        updateCurrency(currency);
        setIsModalOpen(false);
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            x: '100%', // Modal starts off-screen at the right
        },
        visible: {
            opacity: 1,
            x: '0%', // Modal slides to its normal position
        },
        exit: {
            opacity: 0,
            x: '100%', // Modal slides out to the right
        }
    };

    const handleAnimationComplete = () => {
        if (!isModalOpen) {
            setShouldRender(false); // Stop rendering the modal after the exit animation completes
        }
    };

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    <div
                        className="modal"
                    >
                        <motion.div
                            className="modal-content"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={modalVariants}
                            transition={{ duration: 0.3 }}
                            onAnimationComplete={handleAnimationComplete}
                        >
                            <h3>Selecciona tu moneda</h3>
                            <div className='currency-btn-container'>
                                <button onClick={() => handleCurrencyChange('USD')}>$USD</button>
                                <button onClick={() => handleCurrencyChange('UYU')}>$UYU (Pesos Uruguayos)</button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ModalCurrency;
