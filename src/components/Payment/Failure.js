"use client";

import { motion } from 'framer-motion';

const Failure = ({ paymentId }) => {
    return (
        <motion.div
            className="failure-payment container"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
            }}
        >
            <motion.div
                className='result-payment-header failure-payment-header'
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
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12" y2="17"></line>
                    </svg>
                </motion.h1>
                <motion.h2
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Su pedido fue rechazado
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
                <motion.ul
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                    }}
                >
                    <motion.li
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                    >
                        <span className="bold">Procesamiento de Pago:</span> Si pagó con tarjeta, es posible que la administradora de su tarjeta haya rechazado el pago, consulte su estado de cuenta.
                    </motion.li>
                </motion.ul>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, delay: 2 }}
                >
                    Agradecemos su paciencia, puede intentar de nuevo o probar con otro m&eacute;todo de pago. Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactarnos.
                </motion.p>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, delay: 2.5 }}
                >
                    Su número de transacción es: <span className='bold'>{paymentId}</span>
                </motion.p>
            </motion.div>
        </motion.div>
    )
}

export default Failure;
