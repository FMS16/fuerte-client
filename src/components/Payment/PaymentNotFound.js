"use client";

import React from 'react'
import { motion } from 'framer-motion';

const PaymentNotFound = ({ paymentId }) => {
    console.log(paymentId);
    return (
        <div>
            <motion.div
                className="not-found-payment container"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
                }}
            >
                <motion.div
                    className='result-payment-header not-found-payment-header'
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
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z" clipRule="evenodd"></path><path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clipRule="evenodd"></path></svg>
                    </motion.h1>
                    <motion.h2
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        Su pedido basado en su n&uacute;mero de transacci&oacute;n no fue encontrado.
                    </motion.h2>
                </motion.div>

                <motion.div
                    className="result-payment-body"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
                    }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5, delay: 2 }}
                    >
                        No encontramos la transacci&oacute;n especificada, ya que no se proces&oacute; o no existe. Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactarnos.
                    </motion.p>
                    {paymentId == 0 ?
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5, delay: 2.5 }}
                        >
                            Su número de transacción es inv&aacute;lido.
                        </motion.p> :
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5, delay: 2.5 }}
                        >
                            Su número de transacción es: <span className='bold'>{paymentId}</span>
                        </motion.p>
                    }

                </motion.div>
            </motion.div>
        </div>
    )
}

export default PaymentNotFound