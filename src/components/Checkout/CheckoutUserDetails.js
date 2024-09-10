

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
        name: state.user?.logged.name || '',
        lastName: state.user?.logged.lastName || '',
        phone: state.user?.logged.phone || '',
        email: state.user?.logged.email || '',
        dateBorn: state.user?.logged.dateBorn || '',
        idCard: state.user?.logged.idCard || '',
        ...userDetails
    });
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
            if(isMobile){
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
            }else{
                toast.info(`No pueden haber campos vacíos.`, {
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
        } else if (emailExists) {
            if(isMobile){
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
            }else{
                toast.info(`Ya hay una cuenta con ese mail. Inicie sesión o utilice otro.`, {
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
        } else if (localUserDetails.phone.length < 5) {
            if(isMobile){
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
            }else{
                toast.info(`Ingrese un teléfono válido.`, {
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

        updateData({ userDetails: localUserDetails });
        onNextStep();
    };

    useEffect(() => {
        // Verifica si state no es null y tiene datos
        if (state && state.user) {
            setLocalUserDetails(prevDetails => ({
                ...prevDetails,
                name: state.user.logged.name || prevDetails.name,
                lastName: state.user.logged.lastName || prevDetails.lastName,
                phone: state.user.logged.phone || prevDetails.phone,
                email: state.user.logged.email || prevDetails.email,
                dateBorn: state.user.logged.dateBorn || prevDetails.dateBorn,
                idCard: state.user.logged.idCard || prevDetails.idCard,
                ...userDetails
            }));
        } else {
            setLocalUserDetails(prevDetails => ({
                ...prevDetails,
                ...userDetails
            }));
        }
    }, [ userDetails, state ]);


    const handleToRoot = () => {
        router.push('/');
    }

    return (
        <div className={`checkout-user-details `}>
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
                            value={state.user.logged.email}
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
                            value={state.user.logged.name} // Valor predeterminado vacío
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
                            value={state.user.logged.lastName} // Valor predeterminado vacío
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
                            value={state.user.logged.phone}
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
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user != null
                        ? (<><input
                            name="dateBorn"
                            type="text"
                            required
                            readOnly={true}
                            disabled={true}
                            value={state.user.logged.dateBorn}
                            spellCheck="false"
                            onChange={handleInputChange}
                        /></>)
                        : <><input
                            name="dateBorn"
                            type="date"
                            required
                            value={localUserDetails.dateBorn ?? ''} // Valor predeterminado vacío
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>Fecha de nacimiento</label></>
                    }
                </motion.div>
                <motion.div className="input-field" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                    {state.user == null
                        ? (<><input
                            name="idCard"
                            type="text"
                            required
                            value={localUserDetails.idCard ?? ''}
                            spellCheck="false"
                            onChange={handleInputChange}
                        />
                            <label>C&eacute;dula</label></>)
                        : null
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
