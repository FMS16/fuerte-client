"use client";

import React, { useState, useEffect, useContext, act } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "@/features/UserContext";
import OrderStatus from "../utils/OrderStatus";
import ProductsAdmin from "@/components/Admin/ProductsAdmin";
import NewsletterAdmin from "@/components/Admin/NewsletterAdmin";
import { toast } from "react-toastify";
import WebLoader from "@/components/Common/WebLoader";
import DashboardGraph from "@/components/Admin/DashboardGraph";

export default function AdminPage() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [ activeTab, setActiveTab ] = useState("dashboard");
    const [ orders, setOrders ] = useState([]); // Estado para almacenar las órdenes
    const [ error, setError ] = useState(null); // Estado para manejar errores
    const [ menuVisible, setMenuVisible ] = useState(false);
    const { state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;
    const router = useRouter();

    const [loading, setLoading] = useState(false);

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

    }, [ state.token ]); // Dependencias: cuando cambia el tab o el token

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMenuVisible(!menuVisible);
    };

    const [ modalChangeOrderStatusVisible, setModalChangeOrderStatusVisible ] = useState(false);
    const [ modalOrderDetail, setModalOrderDetail ] = useState(false);


    const [ activeOrder, setActiveOrder ] = useState(null);

    const toggleModalChangeOrderStatus = () => {
        setActiveOrder(null);
        setModalChangeOrderStatusVisible(!modalChangeOrderStatusVisible);
    }

    const handleOrderStatusChange = async (value, order) => {
        const object = {
            order: order,
            newStatus: value
        }
        setActiveOrder(object);
        setModalChangeOrderStatusVisible(!modalChangeOrderStatusVisible);
    }

    const handleSubmitNewStatus = async () => {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/order/update-order-status/${activeOrder.order.id}/${activeOrder.newStatus}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.user.token}`, // Asegúrate de pasar el token adecuado aquí
            },
        });
        const data = await response.json();
        if(data.isSuccess == true){
            toast.success("Orden actualizada con éxito.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
        setLoading(false);
        toggleModalChangeOrderStatus();
    }

    const handleDetailOrder = (order) => {
        setActiveOrder(order);
        setModalOrderDetail(!modalOrderDetail);
    }

    if(loading){
        return (<WebLoader />);
    }

    return (
        <>
            {state.user ? (
                <>
                    <header className="admin-panel-header">
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
                        <p>
                            {state.user.name} {state.user.lastName}
                        </p>
                    </header>
                    {modalChangeOrderStatusVisible && activeOrder != null && (
                        <div className="modal-change-order-status">
                            <div className="overlay" onClick={toggleModalChangeOrderStatus}></div>
                            <div className="modal-content-change-order-status">
                                <p>
                                    Se cambiar&aacute; el estado de la orden {activeOrder.order.id} de
                                    <span className="bold"> <OrderStatus orderStatus={activeOrder.order.orderStatus} /> </span>
                                    a
                                    <span className="bold"> <OrderStatus orderStatus={parseInt(activeOrder.newStatus)} /> </span>
                                </p>
                                <div className="modal-content-options">
                                    <button onClick={() => handleSubmitNewStatus()}>Confirmar</button>
                                    <button onClick={toggleModalChangeOrderStatus}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {modalOrderDetail && activeOrder != null && (
                        <div className="modal-order-detail">
                            <div className="overlay" onClick={() => setModalOrderDetail(!modalOrderDetail)}></div>
                            <div className="modal-content-order-detail">
                                <div className="modal-content-order-detail-header">
                                    <h1>#{activeOrder.id}</h1>
                                    <h1>{new Date(activeOrder.date).toLocaleDateString()}</h1>
                                </div>
                                <div className="container">
                                    <div className="modal-content-order-detail-user">
                                        <h1>Datos del comprador:</h1>
                                        <ul className="modal-content-order-detail-list">
                                            <li>Nombre: {activeOrder.user.name} {activeOrder.user.lastName}</li>
                                            <li>CI: {activeOrder.user.idCard}</li>
                                            <li>Mail: {activeOrder.user.email}</li>
                                            <li>Tel.: {activeOrder.user.phone}</li>
                                        </ul>
                                    </div>
                                    <div className="modal-content-order-detail-order">
                                        <h1>Datos de la orden:</h1>
                                        <ul className="modal-content-order-detail-list">
                                            {activeOrder.products.map((item, index) => {
                                                return (
                                                    <li className="flex" key={index}>
                                                        <p><span dangerouslySetInnerHTML={{ __html: item.product.name }} /> <span>{item.size.name}</span></p>
                                                        <p>{item.quantity}</p>
                                                    </li>
                                                )
                                            })}
                                            <li className="flex"><span>Total:</span> <span>${activeOrder.selectedAddress.country == "Ecuador" ? activeOrder.totalUSD : activeOrder.totalUYU}</span></li>
                                            {activeOrder.paymentStatus == "pending" && (<li className="flex"><span>Estado del pago:</span> <span>Pendiente.</span></li>)}
                                        </ul>
                                    </div>
                                    <div className="modal-content-order-detail-shipping">
                                        <h1>Datos del env&iacute;o:</h1>
                                        <ul className="modal-content-order-detail-list">
                                            <li>Pa&iacute;s: {activeOrder.selectedAddress.country}</li>
                                            <li>Direcci&oacute;n: {activeOrder.selectedAddress.department}, {activeOrder.selectedAddress.street} {activeOrder.selectedAddress.doorNumber}</li>
                                            <li>Comentarios: {activeOrder.selectedAddress.comments}</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                    <div className="container admin-panel-body">
                        {activeTab === "dashboard" && <>
                            <div className="container">
                                <DashboardGraph orders={orders} />
                            </div>
                        </>}
                        {activeTab === "orders" && (
                            <>
                                <h1>Órdenes</h1>
                                <table className="admin-panel-table-orders">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Pa&iacute;s</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    {!error && (
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.selectedAddress.country}</td>
                                                    <td>${order.selectedAddress.country == "Ecuador" ? order.totalUSD : order.totalUYU}</td>
                                                    <td>
                                                        <select
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleOrderStatusChange(e.target.value, order)}
                                                        >
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <option key={index} value={index}>
                                                                    <OrderStatus orderStatus={index} />
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handleDetailOrder(order)} className="btn-order-detail-action">
                                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            </>
                        )}
                        {activeTab === "users" && <h1>Usuarios</h1>}
                        {activeTab === "products" && <ProductsAdmin />}
                        {activeTab === "newsletter" && <NewsletterAdmin />}
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
                                    <li onClick={() => handleTabClick("newsletter")}>Newsletter</li>
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
