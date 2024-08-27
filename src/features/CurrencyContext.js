"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD'); // Default currency

    useEffect(() => {
        // Load currency from sessionStorage
        const storedCurrency = localStorage.getItem('currency');
        if (storedCurrency) {
            setCurrency(storedCurrency);
        }
    }, []);

    const updateCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, updateCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
