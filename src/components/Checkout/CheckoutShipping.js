"use client";


import React, { useState, useEffect, useCallback } from 'react';

const CheckoutShipping = ({ onNextStep, updateData, onPrevStep }) => {

    const handleSubmit = () =>{
        onNextStep();
    }

    return (
        <div className='checkout-shipping'>
            <h1 className='checkout-title'>Env&iacute;o</h1>
            <form className='checkout-form' onSubmit={handleSubmit}>
                
                <input className='btn-form' type='submit' value='Ir a pagar' />
                <button className='btn-prev-step' onClick={onPrevStep}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg> Mis datos</button>
            </form>
        </div>
    );
}

export default CheckoutShipping;
