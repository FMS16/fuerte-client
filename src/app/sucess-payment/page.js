"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WebLoader from '@/components/Common/WebLoader';
import { motion } from 'framer-motion';

const SuccessPayment = () => {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isValidPaymentId, setIsValidPaymentId] = useState(false);

    useEffect(() => {
        if (paymentId) {
            const getData = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/MercadoPago/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ "paymentId": paymentId })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    if (data.data === "approved") {
                        setIsValidPaymentId(true);
                    } else {
                        router.push('/');
                    }
                } catch (error) {
                    router.push('/');
                } finally {
                    setLoading(false);
                }
            }

            getData();
        } else {
            router.push('/');
        }
    }, [paymentId]);

    if (loading) {
        return <WebLoader />;
    }

    return (
        <>
            {isValidPaymentId && (
                <motion.div 
                    className='container order-confirmed-page'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <motion.h1 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <span>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 20c-.801 0-1.555-.312-2.121-.879l-4-4c-.567-.566-.879-1.32-.879-2.121s.312-1.555.879-2.122c1.133-1.133 3.109-1.133 4.242 0l1.188 1.188 3.069-5.523c.526-.952 1.533-1.544 2.624-1.544.507 0 1.012.131 1.456.378.7.39 1.206 1.028 1.427 1.798.221.771.127 1.581-.263 2.282l-5 9c-.454.818-1.279 1.384-2.206 1.514-.139.019-.277.029-.416.029zm-4-8c-.268 0-.518.104-.707.293s-.293.439-.293.707.104.518.293.707l4 4c.223.221.523.33.844.283.312-.043.586-.232.737-.504l5-9c.13-.233.161-.503.088-.76-.073-.257-.243-.47-.478-.6-.473-.264-1.101-.078-1.357.388l-4.357 7.841-3.062-3.062c-.19-.189-.44-.293-.708-.293z"></path>
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.h2 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Orden confirmada
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Tu c&oacute;digo de transacci&oacute;n es: <strong>{paymentId}</strong>
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        Podr&aacute;s ver el detalle de la &oacute;rden en <span className='italic'> mis pedidos </span> en tu cuenta.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        Por ayuda, comunicate <a href='https://wa.link/ip2hee'>aqu&iacute;</a>
                    </motion.p>
                </motion.div>
            )}
        </>
    );
};

export default SuccessPayment;
