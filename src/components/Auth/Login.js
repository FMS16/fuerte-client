"use client";

import { useRouter } from 'next/navigation'
import React from "react";
import { useEffect, useState, useContext } from "react";
import logo from "../../assets/images/logoRecortado.png"
import Image from 'next/image';
import { UserContext } from "@/features/UserContext";

const Login = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [ email, setEmail ] = useState('');
    const [password, setPassword] = useState('');

    const [ showLoginForm, setShowLoginForm ] = useState(false);
    const [ mailUserExists, setMailUserExists ] = useState(false);
    const [ mailAdminExists, setMailAdminExists ] = useState(false);
    const [ initForm, setInitForm ] = useState(true);

    const { dispatch, state } = useContext(UserContext);
    const { isAuthenticated } = state;

    const router = useRouter();

    useEffect(() => {

        if(isAuthenticated){
            router.push('/');
        }

    }, [isAuthenticated]);

    const handleInputPassword = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setMessage("Los campos no pueden ser vacíos");
            return;
        }
        setLoading(true);

        try {
            const userData = {
                email,
                password,
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

            if (!response.ok) {
                throw new Error('Error en el inicio de sesión');
            }

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

                const redirectPath = location.state?.from || '/';
                navigate(redirectPath);
            } else {
                setPassword('');
                setMessage(responseData.message);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setMessage('Error en el inicio de sesión');
        }finally{
            setLoading(false);
        }
    };


    const handleInputChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmitInit = async (e) => {
        e.preventDefault();
        if (email === '') {
            setMessage("El correo electrónico no puede estar vacío");
            return;
        }
        setLoading(true); // Activar loader al iniciar la verificación
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simular una espera de 2 segundos
            // Verificar email como admin
            const responseAdmin = await fetch(`${API_BASE_URL}/admin/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(email), // Enviar email como objeto JSON
            });
            if (!responseAdmin.ok) {
                throw new Error('Error en el registro');
            }

            const responseDataAdmin = await responseAdmin.json();
            if (responseDataAdmin.isSuccess) {
                setInitForm(false); // Desactivar el formulario inicial
                setLoading(false);
                if (responseDataAdmin.data === true) {
                    // El email existe como admin
                    setMailAdminExists(true);
                    setShowLoginForm(true); // Mostrar formulario de login
                } else {
                    // El email no está registrado como admin, verificar como usuario normal
                    const responseUser = await fetch(`${API_BASE_URL}/admin/check-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(email), // Enviar email como objeto JSON
                    });
                    if (!responseUser.ok) {
                        throw new Error('Error en el registro');
                    }
                    const responseDataUser = await responseUser.json();
                    if (responseDataUser.isSuccess && responseDataUser.data === true) {
                        // El email existe como usuario normal
                        setMailUserExists(true);
                        setShowLoginForm(true); // Mostrar formulario de login
                    } else {
                        setMailUserExists(false);
                        setMailAdminExists(null);
                        setMessage('El correo electrónico no está registrado');
                    }
                }
            } else {
                setMessage(responseDataAdmin.message);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error en el registro:', error);
            setMessage('Error en el registro');
        }
    };


    const [ name, setName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ passwordRegister, setPasswordRegister ] = useState('');
    const [ dateBornRegister, setDateBorRegister ] = useState('');

    const handleInputChangeName = (e) => {
        setName(e.target.value);
    }

    const handleInputChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleInputChangePasswordRegister = (e) => {
        setPasswordRegister(e.target.value);
    }

    const handleInputChangeDateBornRegister = (e) => {
        setDateBorRegister(e.target.value);
    }

    const handleRegister = () => {
        // Implementar lógica de registro si es necesario
    }

    const changeEmailLogin = () => {
        setInitForm(true);
        setLoading(false);
        setEmail('');
        setMailUserExists(false);
        setMailAdminExists(false);
        setPassword('');
        setMessage('');
        setShowLoginForm(false);
    }


    return (
        <div className='login'>
            {initForm && (
                <div className='container-login'>
                    <h1 className='logo-login'><Image src={logo} width={175} height={25} alt='Fuerte logo' /></h1>
                    <h1>Ingresa tu dirección de correo electrónico para comenzar.</h1>
                    <form className='form-init' onSubmit={handleSubmitInit}>
                        <div className="input-field">
                            <input onChange={handleInputChangeEmail} value={email} type="email" required spellCheck="false" />
                            <label>Correo Electrónico</label>
                        </div>
                        <div className='tof'>
                            <h2>{message}</h2>
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
                    <form className='form-login' onSubmit={handleLogin}>
                        {message !== '' && (
                            <div className='login-message'>
                               
                            </div>
                        )}

                        <div className="input-field">
                            <input onChange={handleInputPassword} value={password} type="password" required spellCheck="false" />
                            <label>Contraseña</label>
                        </div>
                        <div className='forgot-password'>
                            <button>¿Has olvidado la contraseña?</button>
                        </div>
                        <div className='input-submit'>
                            {loading ? <button className='btn-loader-spin-login'><div className='loader'></div></button> : <button type='submit'>Iniciar Sesión</button>}
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
                            <input value={dateBornRegister} onChange={handleInputChangeDateBornRegister} type="text" required spellCheck="false" />
                            <label>Fecha de Nacimiento</label>
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