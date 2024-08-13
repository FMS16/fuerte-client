"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import "../../styles/Common.css";

const Success = ({ paymentId }) => {
    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState(null);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:7207/order/paymentid/${paymentId}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.isSuccess === true) {
                    setOrder(data.data);
                    console.log(data.data);
                }
            } catch (error) {
                setMessage(error);
                console.log(error);
            }
        };
        fetchData();

    }, [paymentId]);

    const myLoader = ({ src }) => {
        return src;
    };

    return (
        <motion.div
            className='success-payment container'
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
            }}
        >
            <motion.div
                className='result-payment-header success-payment-header'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    variants={{
                        hidden: { scale: 0.5, opacity: 0 },
                        visible: { scale: 1, opacity: 1 }
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"></path>
                    </svg>
                </motion.h1>
                <motion.h2
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    ¡Ya estamos preparando tu pedido!
                </motion.h2>
            </motion.div>

            <motion.div
                className='result-payment-body'
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
                }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                {order != null && (
                    <>
                        {/* Order Info Details */}
                        <motion.div
                            className='order-info'
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 }
                            }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                        >
                            <motion.div
                                className='order-info-operation-details-container'
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <motion.ul
                                    className='order-info-operation-details'
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 }
                                    }}
                                >
                                    <motion.li variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}>Código de transacción: <span className='bold'>{order.paymentId}</span></motion.li>
                                    <motion.li variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}>Teléfono de contacto: <span className='bold'>{order.user.phone}</span></motion.li>
                                    <motion.li variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}>Contacto: <span className='bold'>{order.user.email}</span></motion.li>
                                </motion.ul>
                            </motion.div>
                        </motion.div>

                        {/* Product Details */}
                        <motion.div
                            className='order-info-product-details-container'
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5, delay: 2 }}
                        >
                            <motion.ul
                                className='order-info-product-details'
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 }
                                }}
                            >
                                <h2>Detalle:</h2>
                                {order.products.map((orderProduct, index) =>
                                    <motion.li
                                        className='order-product-item'
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
                                    >
                                        <div className='order-detail-product-image relative'>
                                            <Image
                                                src={`${baseUrl}/${orderProduct.product.image}`}
                                                alt={orderProduct.product.image}
                                                loader={myLoader}
                                                fill
                                            />
                                        </div>
                                        <div className='order-detail-product-info'>
                                            <p>{orderProduct.product.name}</p>
                                            <p>{orderProduct.size.name} - x{orderProduct.quantity}</p>
                                        </div>
                                        <div className='order-detail-product-price'>
                                            <p>${orderProduct.product.price * orderProduct.quantity}</p>
                                        </div>
                                    </motion.li>
                                )}
                            </motion.ul>
                        </motion.div>

                        {/* Price Details */}
                        <motion.div
                            className='order-info-price-details-container'
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5, delay: 3 }}
                        >
                            <motion.ul
                                className='order-info-price-details'
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 }
                                }}
                            >
                                <li>Subtotal: <span className='price'>{order.subtotal}</span></li>
                                <li>Total: $<span className='price'>{order.total}</span></li>
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Success;
