"use client";

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/features/UserContext";
import { toast } from "react-toastify";

const CheckoutShipping = ({ onNextStep, updateData, onPrevStep, shippingDetails }) => {
    const { state } = useContext(UserContext);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [newAddress, setNewAddress] = useState(false);

    const [localShippingDetails, setLocalShippingDetails] = useState({
        department: '',
        street: '',
        doorNumber: '',
        comments: '',
        country: '',
        id: -1,
        ...shippingDetails
    });
    const [ isMobile, setIsMobile ] = useState(false);
    useEffect(() => {
        // Función para actualizar el estado basado en el tamaño de la ventana
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Llama a handleResize cuando el componente se monta
        handleResize();

        // Añade un event listener para manejar los cambios de tamaño de la ventana
        window.addEventListener('resize', handleResize);

        // Limpia el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ isMobile ]);
    const [country, setCountry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalShippingDetails = { ...localShippingDetails };

        if (selectedAddressIndex !== null) {
            const selectedAddress = state.user.addresses[selectedAddressIndex];
            finalShippingDetails = {
                department: selectedAddress.department,
                street: selectedAddress.street,
                doorNumber: selectedAddress.doorNumber,
                country: selectedAddress.country,
                comments: selectedAddress.comments || '',
                id: selectedAddress.id || -1,
            };
        }

        if (!newAddress && selectedAddressIndex == null) {
            if(isMobile){
                toast.info(`Seleccione una dirección existente o agregue una nueva dirección.`, {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }else{
                toast.info(`Seleccione una dirección existente o agregue una nueva dirección.`, {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            
            return;
        }

        if (newAddress && (country === '' || !finalShippingDetails.department || !finalShippingDetails.street || !finalShippingDetails.doorNumber)) {
            if(isMobile){
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
            }else{
                toast.info(`Complete el formulario antes de avanzar.`, {
                    position: "top-left",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            
            
            return;
        }

        updateData({ shippingDetails: finalShippingDetails });
        onNextStep();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalShippingDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleNewAddressClick = () => {
        setSelectedAddressIndex(null);
        setNewAddress(true);
        setLocalShippingDetails({
            department: '',
            street: '',
            doorNumber: '',
            comments: '',
            country: '',
            id: -1
        });
    };

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setCountry(selectedCountry);
        setLocalShippingDetails(prevDetails => ({
            ...prevDetails,
            country: selectedCountry,
        }));
    };

    return (
        <div className='checkout-shipping'>
            <h1 className='checkout-title'>Env&iacute;o</h1>
            <div className='addresses-user'>
                {state.user?.addresses && state.user?.addresses.length > 0 && (
                    state.user.addresses.map((address, index) => (
                        <div key={index} className={`address-user ${selectedAddressIndex === index ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                id={`address-${index}`}
                                name="selectedAddress"
                                value={index}
                                checked={selectedAddressIndex === index}
                                onChange={() => {
                                    setSelectedAddressIndex(index);
                                    setNewAddress(false);
                                }}
                            />
                            <label htmlFor={`address-${index}`}>
                                <p>Pa&iacute;s: {address.country}</p>
                                <p>Departamento / Regi&oacute;n: {address.department}</p>
                                <p>Direcci&oacute;n: {address.street} {address.doorNumber}</p>
                            </label>
                        </div>
                    ))
                )}
            </div>
            <button className="btn-new-address" onClick={handleNewAddressClick}>Agregar nueva direcci&oacute;n</button>
            {newAddress && (
                <>
                    <div className='input-field'>
                        <select value={country} className="select-country-shipping" onChange={handleCountryChange}>
                            <option value="" disabled>Seleccione el pa&iacute;s</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Uruguay">Uruguay</option>
                        </select>
                    </div>
                    {country && (
                        <div className="checkout-form">
                            <div className='input-field'>
                                <input
                                    name="department"
                                    type="text"
                                    required
                                    value={localShippingDetails.department}
                                    spellCheck="false"
                                    onChange={handleInputChange}
                                />
                                <label>Ciudad</label>
                            </div>
                            <div className='input-field'>
                                <input
                                    name="street"
                                    type="text"
                                    required
                                    value={localShippingDetails.street}
                                    spellCheck="false"
                                    onChange={handleInputChange}
                                />
                                <label>Direcci&oacute;n detallada</label>
                            </div>
                            <div className='input-field'>
                                <input
                                    name="doorNumber"
                                    type="text"
                                    required
                                    value={localShippingDetails.doorNumber}
                                    spellCheck="false"
                                    onChange={handleInputChange}
                                />
                                <label>N&uacute;mero de casa</label>
                            </div>
                            <div className='input-field'>
                                <input
                                    name="comments"
                                    type="text"
                                    value={localShippingDetails.comments}
                                    spellCheck="false"
                                    onChange={handleInputChange}
                                />
                                <label>Comentarios adicionales</label>
                            </div>
                        </div>
                    )}
                </>
            )}
            <form className='checkout-form' onSubmit={handleSubmit}>
                <input className='btn-form' type='submit' value='Ir a pagar' />
                <button className='btn-prev-step' onClick={onPrevStep}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path>
                    </svg> Mis datos
                </button>
            </form>
        </div>
    );
};

export default CheckoutShipping;
