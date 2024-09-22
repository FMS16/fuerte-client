"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "@/features/UserContext";

export default function AdminPage() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [ activeTab, setActiveTab ] = useState("dashboard");
    const [ orders, setOrders ] = useState([]); // Estado para almacenar las órdenes
    const [ error, setError ] = useState(null); // Estado para manejar errores
    const [ menuVisible, setMenuVisible ] = useState(false);
    const { state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;
    const router = useRouter();
    const [ isMobile, setIsMobile ] = useState(false);

    useEffect(() => {
        if (isAdmin == false || isAuthenticated == false || state.user === null) {
            router.push("/");
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [ isAuthenticated, isAdmin, state.user, router ]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/order/getAll`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${state.user.token}`, // Asegúrate de pasar el token adecuado aquí
                    },
                });

                const data = await response.json();
                setOrders(data.data); // Guarda las órdenes en el estado
            } catch (error) {
                setError(error.message); // Manejo de errores
            }
        };


        fetchOrders();

    }, [ state.token, orders ]); // Dependencias: cuando cambia el tab o el token

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMenuVisible(!menuVisible);
    };

    return (
        <>
            {state.user ? (
                <>
                    <header className="admin-panel-header">
                        {isMobile && (
                            <button onClick={toggleMenu} className="fa-bars" aria-label="Abrir menú">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14 5H2V3h12v2zm0 4H2V7h12v2zM2 13h12v-2H2v2z"
                                    ></path>
                                </svg>
                            </button>
                        )}
                        <p>
                            {state.user.name} {state.user.lastName}
                        </p>
                    </header>
                    <div className="container">
                        {activeTab === "dashboard" && <h1>Dashboard</h1>}
                        {activeTab === "orders" && (
                            <>
                                <h1>Órdenes</h1>
                                {error ? (
                                    <p>{error}</p>
                                ) : (
                                    <ul>
                                        {orders.map((order) => (
                                            <li key={order.id}>Orden #{order.id} - Status: {order.paymentStatus}</li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                        {activeTab === "users" && <h1>Usuarios</h1>}
                        {activeTab === "products" && <h1>Productos</h1>}
                    </div>

                    <AnimatePresence>
                        {menuVisible && (
                            <motion.nav
                                key="admin-nav"
                                initial={{ x: "-100%" }}
                                animate={{ x: "0" }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="admin-nav"
                            >
                                <ul>
                                    <li onClick={() => handleTabClick("dashboard")}>Home</li>
                                    <li onClick={() => handleTabClick("products")}>Productos</li>
                                    <li onClick={() => handleTabClick("orders")}>&Oacute;rdenes</li>
                                    <li onClick={() => handleTabClick("users")}>Usuarios</li>
                                </ul>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {menuVisible && (
                            <motion.div
                                key="overlay"
                                className="overlay"
                                onClick={toggleMenu}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <p>Redirigiendo...</p>
            )}
        </>
    );
}
