'use client';

import Footer from '@/components/Common/Footer';
import Header from '@/components/Common/Header';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const LayoutProvider = ({ children }) => {
    const pathname = usePathname();
    
    return (
        <>
            {pathname !== "/checkout" && pathname !== "/login" && pathname !== "/admin" && <Header />}
            {children}
            {pathname !== "/checkout" && pathname !== "/login" && pathname !== "/admin" && <Footer />}
            <ToastContainer />
        </>
    );
};
