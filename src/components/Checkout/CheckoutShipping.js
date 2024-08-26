"use client";


import React, { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '@/features/UserContext';
import { useCart } from '@/features/CartContext';

const CheckoutShipping = ({ onNextStep, updateData, onPrevStep, shippingDetails, userDetails }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const {cart} = useCart();

    const { state } = useContext(UserContext);
    const [ localShippingDetails, setLocalShippingDetails ] = useState({
        department: '',
        street: '',
        doorNumber: '',
        comments: '',
        country: '',
        ...shippingDetails
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localShippingDetails.department === '' || localShippingDetails.street === '' || localShippingDetails.doorNumber === '') {
            toast.info(`Complete el formulario antes de avanzar.`, {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
    
        updateData({ shippingDetails: localShippingDetails });
    
        onNextStep();
    };
    

    const [ country, setCountry ] = useState('');

    const onChangeSelectCountry = (e) => {
        const { value } = e.target;
        setCountry(value);
        setLocalShippingDetails(prevDetails => ({
            ...prevDetails,
            country: value,
        }));
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalShippingDetails(prevDetails => ({
            ...prevDetails,
            [ name ]: value,
        }));
    };


    return (
        <div className='checkout-shipping'>
            <h1 className='checkout-title'>Env&iacute;o</h1>
            <form className='checkout-form' onSubmit={handleSubmit}>
                <div className='input-field'>
                    <select value={country} onChange={onChangeSelectCountry}>
                        <option value="" disabled>Seleccione el pa&iacute;s</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Uruguay">Uruguay</option>
                    </select>
                </div>
                {country == "Ecuador" && (
                    <>
                        <div className='input-field'>
                            <input
                                name="department"
                                type="text"
                                required
                                value={localShippingDetails.department ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Departamento / Regi&oacute;n</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="street"
                                type="text"
                                required
                                value={localShippingDetails.street ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Calle</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="doorNumber"
                                type="text"
                                required
                                value={localShippingDetails.doorNumber ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>N&uacute;mero de puerta</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="comments"
                                type="text"
                                value={localShippingDetails.comments ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Comentarios</label>
                        </div>
                    </>
                )}
                {country == "Uruguay" && (<>
                        <div className='input-field'>
                            <input
                                name="department"
                                type="text"
                                required
                                value={localShippingDetails.department ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Departamento / Regi&oacute;n</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="street"
                                type="text"
                                required
                                value={localShippingDetails.street ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Calle</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="doorNumber"
                                type="text"
                                required
                                value={localShippingDetails.doorNumber ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>N&uacute;mero de puerta</label>
                        </div>
                        <div className='input-field'>
                            <input
                                name="comments"
                                type="text"
                                value={localShippingDetails.comments ?? ''}
                                spellCheck="false"
                                onChange={handleInputChange}
                            />
                            <label>Comentarios</label>
                        </div>
                    </>)}
                <input className='btn-form' type='submit' value='Ir a pagar' />
                <button className='btn-prev-step' onClick={onPrevStep}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg> Mis datos</button>
            </form>
        </div >
    );
}

export default CheckoutShipping;
