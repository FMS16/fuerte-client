"use client";

import { useRouter } from 'next/navigation'
import React from "react";
import { useEffect, useState, useContext } from "react";
import logo from "../../assets/images/logoRecortado.png"
import Image from 'next/image';
import { UserContext } from "@/features/UserContext";
import { toast } from 'react-toastify';
import { actionTypes } from '@/features/UserContext';
import WebLoader from '../Common/WebLoader';

const Login = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [ loading, setLoading ] = useState(false);

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const router = useRouter();

    const [ showLoginForm, setShowLoginForm ] = useState(false);
    const [ mailUserExists, setMailUserExists ] = useState(false);
    const [ mailAdminExists, setMailAdminExists ] = useState(false);
    const [ initForm, setInitForm ] = useState(true);

    const { dispatch, state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;
    const [ isMobile, setIsMobile ] = useState(false);
    useEffect(() => {

        if (isAuthenticated) {
            if(isAdmin){
                router.push('/admin');
            }else{
                router.push('/');
            }

        }
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
    }, [ isAuthenticated, isMobile, isAdmin ]);

    const handleInputPassword = (e) => {
        setPassword(e.target.value);
    }



    const handleLogin = async (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            if (isMobile) {
                toast.info('No pueden haber valores vacios.', {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            } else {
                toast.info('No pueden haber valores vacios.', {
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



        setLoading(true);

        try {
            const userData = {
                "email": email.trim(),
                "password": password.trim()
            };

            let url = '';
            if (mailUserExists) {
                url = `${API_BASE_URL}/user/login`;
            } else if (mailAdminExists) {
                url = `${API_BASE_URL}/admin/login`;
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();
            setLoading(false);

            if (responseData.isSuccess) {
                sessionStorage.setItem('user', JSON.stringify(responseData.data));
                sessionStorage.setItem('isAuthenticated', JSON.stringify(true));
                sessionStorage.setItem('isAdmin', JSON.stringify(responseData.data.rol === "Admin"));

                dispatch({
                    type: actionTypes.LOGIN,
                    payload: {
                        user: responseData.data,
                    },
                });
            } else {
                setPassword('');
                if (isMobile) {
                    toast.info(responseData.message, {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    toast.info(responseData.message, {
                        position: "top-left",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }

            }
        } catch (error) {
            if (isMobile) {
                toast.info(error, {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.info(error, {
                    position: "top-left",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } finally {
            setLoading(false);
        }
    };


    const handleInputChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmitInit = async (e) => {
        e.preventDefault();
        if (email === '') {
            if (isMobile) {
                toast.info('El email no puede estar vacio.', {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.info('El email no puede estar vacio.', {
                    position: "top-left",
                    autoClose: 2500,
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
        setLoading(true); // Activar loader al iniciar la verificación
        try {
            const responseAdmin = await fetch(`${API_BASE_URL}/admin/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email.trim()), // Enviar email como objeto JSON
            });

            const responseDataAdmin = await responseAdmin.json();
            if (responseDataAdmin.isSuccess) {
                setInitForm(false);
                setLoading(false);
                if (responseDataAdmin.data === true) {
                    // El email existe como admin
                    setMailAdminExists(true);
                    setShowLoginForm(true); // Mostrar formulario de login
                } else {
                    // El email no está registrado como admin, verificar como usuario normal
                    const responseUser = await fetch(`${API_BASE_URL}/user/check-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(email.trim()), // Enviar email como objeto JSON
                    });
                    const responseDataUser = await responseUser.json();
                    if (responseDataUser.isSuccess && responseDataUser.data === true) {
                        // El email existe como usuario normal
                        setMailUserExists(true);
                        setShowLoginForm(true); // Mostrar formulario de login
                    } else {
                        setMailUserExists(false);
                        setMailAdminExists(null);
                    }
                }
            }
        } catch (error) {
            setLoading(false);
            console.error('Error en el registro:', error);
            toast.info(err, {
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


    const [ name, setName ] = useState('');
    const [ lastName, setLastName ] = useState('');

    const [ phoneRegister, setPhoneRegister ] = useState('');
    const [ passwordRegister, setPasswordRegister ] = useState('');
    const [ dateBornRegister, setDateBorRegister ] = useState('');

    const [ idCardRegister, setIdCardRegister ] = useState('');

    const [ changePassword, setChangePassword ] = useState('');

    const [ changePasswordConfirm, setChangePasswordConfirm ] = useState('');

    const [ resetCode, setResetCode ] = useState('');

    const handleInputChangeName = (e) => {
        setName(e.target.value);
    }

    const handleInputChangeChangePassword = (e) => {
        setChangePassword(e.target.value);
    }

    const handleInputChangeChangePasswordConfirm = (e) => {
        setChangePasswordConfirm(e.target.value);
    }

    const handleInputChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleInputChangePasswordRegister = (e) => {
        setPasswordRegister(e.target.value);
    }


    const handleInputResetCode = (e) => {
        setResetCode(e.target.value);
    }

    const handleInputChangePhoneRegister = (e) => {
        setPhoneRegister(e.target.value);
    }

    const handleInputChangeDateBornRegister = (e) => {
        setDateBorRegister(e.target.value);
    }

    const handleInputChangeIdCardRegister = (e) => {
        setIdCardRegister(e.target.value);
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (passwordRegister == '' || name == '' || lastName == '' || email == '' || phoneRegister == '' || idCardRegister == '') {
            if(isMobile){
                toast.info('No pueden haber valores vacios.', {
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
                toast.info('No pueden haber valores vacios.', {
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


        if (passwordRegister.length < 8) {
            if(isMobile){
                toast.info('La contraseña debe tener como mínimo 8 caracteres..', {
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
                toast.info('La contraseña debe tener como mínimo 8 caracteres..', {
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

        setLoading(true);

        try {
            const object = {
                "name": name.trim(),
                "email": email.trim(),
                "lastName": lastName.trim(),
                "password": passwordRegister.trim(),
                "phone": phoneRegister.trim(),
                "dateBorn": dateBornRegister,
                "idCard": idCardRegister
            }


            const responseRegister = await fetch(`${API_BASE_URL}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(object), // Enviar email como objeto JSON
            });
            const data = await responseRegister.json();
            if (data.isSuccess) {
                if(isMobile){
                    toast.success(data.message, {
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
                    toast.success(data.message, {
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
                

                sessionStorage.setItem('user', JSON.stringify(data.data));
                sessionStorage.setItem('isAuthenticated', JSON.stringify(true));
                sessionStorage.setItem('isAdmin', JSON.stringify(data.data.rol === "Admin"));

                dispatch({
                    type: actionTypes.LOGIN,
                    payload: {
                        user: data.data,
                    },
                });

                router.push('/');

            } else {
                if(isMobile){
                    toast.info(data.message, {
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
                    toast.info(data.message, {
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
                
            }

        } catch (err) {
            if(isMobile){
                toast.error(err, {
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
                toast.error(err, {
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
            
        } finally {
            setLoading(false);
        }
    }

    const changeEmailLogin = () => {
        setInitForm(true);
        setLoading(false);
        setEmail('');
        setMailUserExists(false);
        setMailAdminExists(false);
        setPassword('');
        setShowLoginForm(false);
    }

    const [ messageError, setMessageError ] = useState(null);

    const [ showCodeInput, setShowCodeInput ] = useState(false);

    const sendCodeNewPassword = () => {
        setMessageError('');
        setLoading(true);
        fetch(`${API_BASE_URL}/user/sendCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.trim(),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                setLoading(false);
                // Asume que 'data' tiene una estructura como { success: true, message: 'Email enviado' }
                if (data.isSuccess) {
                    // Actualiza el estado para mostrar la pantalla donde se ingresa el código
                    setShowCodeInput(true);
                    setShowLoginForm(false);
                    if(isMobile){
                        toast.info('Se ha enviado un código a tu correo electrónico', {
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
                        toast.info('Se ha enviado un código a tu correo electrónico', {
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
                    
                } else {
                    setMessageError(data.message);
                }
            })
            .catch(error => {
                setMessageError(error);
            });
    };

    const [ isVisibleFormNewPassword, setVisibleFormNewPassword ] = useState(false);

    const handleResetCodeSubmit = (e) => {
        e.preventDefault();
        setMessageError('');
        const object = {
            "email": email.trim(),
            "code": resetCode.trim()
        }
        fetch(`${API_BASE_URL}/user/verifyCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.isSuccess) {
                    setVisibleFormNewPassword(true);
                    setShowCodeInput(false);
                } else {
                    if(isMobile){
                        toast.info('El código no es correcto o ha habido un error.', {
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
                        toast.info('El código no es correcto o ha habido un error.', {
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
                    
                }
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
            });
    }

    const handleNewPassword = (e) => {
        e.preventDefault();
        if (changePassword !== changePasswordConfirm) {
            toast.info('Las contraseñas deben coincidir.', {
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
        const object = {
            "email": email.trim(),
            "newPassword": changePassword.trim()
        }
        fetch(`${API_BASE_URL}/user/setNewPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.isSuccess) {
                    toast.success(data.message, {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    router.push('/');
                } else {
                    toast.info(data.message, {
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
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
            });
    }



    return (
        <div className='login'>
            {initForm && (
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={250} height={25} alt='Fuerte logo' /></h1>
                    <h1>Ingresa tu dirección de correo electrónico para comenzar.</h1>
                    <form className='form-init' onSubmit={handleSubmitInit}>
                        <div className="input-field">
                            <input onChange={handleInputChangeEmail} value={email} type="email" required spellCheck="false" />
                            <label>Correo Electrónico</label>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Verificar Email</button>}
                        </div>
                    </form>
                </div>
            )}

            {showLoginForm && ( // Mostrar el formulario de login si showLoginForm es true
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={175} height={25} alt='Fuerte logo' /></h1>
                    <h1>¿Cuál es tu contraseña?</h1>
                    <h2 className='change-email'>{email} <button onClick={changeEmailLogin}>Editar</button></h2>
                    <div className='forgot-password'>
                        <button onClick={sendCodeNewPassword}>¿Has olvidado la contraseña?</button>
                        {messageError && (<p className='message-login'>{messageError}</p>)}
                    </div>
                    <form className='form-login' onSubmit={handleLogin}>
                        <div className="input-field">
                            <input onChange={handleInputPassword} value={password} type="password" spellCheck="false" />
                            <label>Contraseña</label>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Iniciar Sesión</button>}
                        </div>
                    </form>
                </div>
            )}

            {showCodeInput && (
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={175} height={25} alt='Fuerte logo' /></h1>
                    <h1>Enviamos un c&oacute;digo de recuperaci&oacute;n</h1>
                    <h2>A este mail: {email}</h2>
                    <button className='btn-send-code-again' onClick={sendCodeNewPassword}>Enviar de nuevo el c&oacute;digo</button>
                    {messageError && (<p className='message-login'>{messageError}</p>)}
                    <form className='form-reset-code' onSubmit={handleResetCodeSubmit}>
                        <div className="input-field">
                            <input onChange={handleInputResetCode} value={resetCode} type="text" required spellCheck="false" />
                            <label>C&oacute;digo</label>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Verificar c&oacute;digo</button>}
                        </div>
                    </form>
                </div>
            )}

            {isVisibleFormNewPassword && (
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={175} height={25} alt='Fuerte logo' /></h1>
                    <h1>Ingresa tu nueva contrase&ntilde;a</h1>
                    <form className='form-reset-code' onSubmit={handleNewPassword}>
                        <div className="input-field">
                            <input onChange={handleInputChangeChangePassword} value={changePassword} type="password" required spellCheck="false" />
                            <label>Nueva contrase&ntilde;a</label>
                        </div>
                        <div className="input-field">
                            <input onChange={handleInputChangeChangePasswordConfirm} value={changePasswordConfirm} type="password" required spellCheck="false" />
                            <label>Confirma la nueva contrase&ntilde;a</label>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Cambiar</button>}
                        </div>
                    </form>
                </div>
            )}

            {!showLoginForm && mailUserExists === false && mailAdminExists == null && ( // Mostrar el formulario de registro si showLoginForm es falso y el email no existe
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={175} height={25} alt='Fuerte logo' /></h1>
                    <h1>Únete al club.</h1>
                    <h2 className='change-email'>{email} <button onClick={changeEmailLogin}>Editar</button></h2>
                    <form className='form-register' onSubmit={handleRegister}>
                        <div className='container-input-fields'>
                            <div className="input-field input-field-50">
                                <input value={name} onChange={handleInputChangeName} type="text" required spellCheck="false" />
                                <label>Nombre</label>
                            </div>
                            <div className="input-field input-field-50">
                                <input value={lastName} onChange={handleInputChangeLastName} type="text" required spellCheck="false" />
                                <label>Apellido</label>
                            </div>
                        </div>
                        <div className="input-field">
                            <input value={dateBornRegister} onChange={handleInputChangeDateBornRegister} type="date" required spellCheck="false" />
                            <label>Fecha de nacimiento</label>
                        </div>
                        <div className="input-field">
                            <input value={idCardRegister} onChange={handleInputChangeIdCardRegister} type="text" required spellCheck="false" />
                            <label>C&eacute;dula</label>
                        </div>
                        <div className="input-field">
                            <input value={phoneRegister} onChange={handleInputChangePhoneRegister} type="text" required spellCheck="false" />
                            <label>Tel&eacute;fono</label>
                        </div>
                        <div className="input-field">
                            <input value={passwordRegister} onChange={handleInputChangePasswordRegister} type="password" required spellCheck="false" />
                            <label>Contraseña</label>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Registrarse</button>}
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Login