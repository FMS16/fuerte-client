"use client";

import Login from "@/components/Auth/Login";
import { useRouter } from 'next/navigation'
import React, { useState } from "react";
import { useEffect, useContext } from "react";
import { UserContext } from "@/features/UserContext";

export default function AdminPage() {

    const [ activeTab, setActiveTab ] = useState('dashboard');

    const { state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;

    const router = useRouter();
    const [ isMobile, setIsMobile ] = useState(false);
    useEffect(() => {

        if (isAdmin == false || isAuthenticated == false || state.user === null) {
            router.push("/");
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
    }, [ isAuthenticated, isAdmin, activeTab, isMobile ])

    const [ menuVisible, setMenuVisible ] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }

    return (
        <div className="container">
            {state.user ? (
                <>
                    <header className="admin-panel-header">
                        {isMobile && (
                            <button onClick={toggleMenu} className='fa-bars' aria-label="Abrir menú">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z"></path>
                                </svg>
                            </button>
                        )}
                    </header>
                    {activeTab == "dashboard" && (<h1>dashboard</h1>)}
                </>
            ) : (
                <p>Redirigiendo...</p>
            )}
        </div>
    );

}