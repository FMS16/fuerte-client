"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WebLoader from '@/components/Common/WebLoader';

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
                <div>
                    <h1>Payment Successful</h1>
                    <p>Your payment ID is: {paymentId}</p>
                </div>
            )}
        </>
    );
};

export default SuccessPayment;
