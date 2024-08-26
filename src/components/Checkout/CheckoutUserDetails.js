

import debounce from 'lodash/debounce';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/features/UserContext';


const CheckoutUserDetails = ({ onNextStep, updateData, userDetails }) => {
    const [ emailExists, setEmailExists ] = useState(false);
    const { state } = useContext(UserContext);
    const [ localUserDetails, setLocalUserDetails ] = useState({
        name: state.user?.name || '',
        lastName: state.user?.lastName || '',
        phone: state.user?.phone || '',
        email: state.user?.email || '',
        ...userDetails
    });
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



    const router = useRouter();

    const checkEmail = useCallback(debounce(async (email) => {
        try {
            const responseUser = await fetch(`${API_BASE_URL}/user/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email.trim()),
            });

            if (!responseUser.ok) {
                throw new Error('Error en el registro');
            }

            const responseDataUser = await responseUser.json();

            if (responseDataUser.data === false) {
                const responseAdmin = await fetch(`${API_BASE_URL}/admin/check-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(email.trim()),
                });

                if (!responseAdmin.ok) {
                    throw new Error('Error en el registro');
                }

                const responseDataAdmin = await responseAdmin.json();
                setEmailExists(responseDataAdmin.data === true);
            } else {
                setEmailExists(true);
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    }, 500), []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalUserDetails(prevDetails => ({
            ...prevDetails,
            [ name ]: value,
        }));

        if (name === 'email' && value.includes('@')) {
            checkEmail(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isEmptyField = Object.values(localUserDetails).some(value => value.trim() === '');
        if (isEmptyField) {
            toast.info(`No pueden haber campos vacíos.`, {
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
        } else if (emailExists) {
            toast.info(`Ya hay una cuenta con ese mail. Inicie sesión o utilice otro.`, {
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
        } else if (localUserDetails.phone.length < 5) {
            toast.info(`Ingrese un teléfono válido.`, {
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

        updateData({ userDetails: localUserDetails });
        onNextStep();
    };

    useEffect(() => {
        // Verifica si state no es null y tiene datos
        if (state && state.user) {
            setLocalUserDetails(prevDetails => ({
                ...prevDetails,
                name: state.user.name || prevDetails.name,
                lastName: state.user.lastName || prevDetails.lastName,
                phone: state.user.phone || prevDetails.phone,
                email: state.user.email || prevDetails.email,
                ...userDetails
            }));
        } else {
            setLocalUserDetails(prevDetails => ({
                ...prevDetails,
                ...userDetails
            }));
        }
    }, [userDetails, state]); 
    

    const handleToRoot = () => {
        router.push('/');
    }

    return (
        <div className='checkout-user-details'>
            <h1 className='checkout-title'>Contacto {state.user === null && (<Link href='/login'>Iniciar sesi&oacute;n</Link>)}</h1>
            <motion.form initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }} className='checkout-form' onSubmit={handleSubmit}>
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user != null
                        ? (<><input
                            name="email"
                            type="text"
                            required
                            readOnly={true}
                            disabled={true}
                            value={state.user.email}
                            spellCheck="false"
                            onChange={handleInputChange}
                        /></>)
                        : <><input
                            name="email"
                            type="text"
                            required
                            value={localUserDetails.email ?? ''} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>Email</label></>
                    }
                </motion.div>
                {emailExists && (<p className='info'>Ya hay una cuenta con este mail, inicie sesi&oacute;n o intente con otro correo electr&oacute;nico.</p>)}
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user != null
                        ? (<><input
                            name="name"
                            type="text"
                            required
                            readOnly={true}
                            disabled={true}
                            value={state.user.name} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        /></>)
                        : <><input
                            name="name"
                            type="text"
                            required
                            value={localUserDetails.name ?? ''} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>Nombre</label></>
                    }
                </motion.div>
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user != null
                        ? (<><input
                            name="lastName"
                            type="text"
                            required
                            readOnly={true}
                            disabled={true}
                            value={state.user.lastName} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        /></>)
                        : <><input
                            name="lastName"
                            type="text"
                            required
                            value={localUserDetails.lastName ?? ''} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>Apellido</label></>
                    }

                </motion.div>
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user != null
                        ? (<><input
                            name="phone"
                            type="text"
                            required
                            readOnly={true}
                            disabled={true}
                            value={state.user.phone}
                            spellCheck="false"
                            onChange={handleInputChange}
                        /></>)
                        : <><input
                            name="phone"
                            type="text"
                            required
                            value={localUserDetails.phone ?? ''} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>Tel&eacute;fono</label></>
                    }
                </motion.div>
                {state.user != null && (<motion.p className='info' variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>La informaci&oacute;n de contacto est&aacute; sujeta al usuario y no se puede modificar.</motion.p>)}
                <motion.input variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} type='submit' value='Ir a envío' className='btn-form' />
                <motion.button variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className='btn-prev-step' onClick={handleToRoot} ><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg> Volver</motion.button>
            </motion.form>

        </div>
    );
};

export default CheckoutUserDetails;
