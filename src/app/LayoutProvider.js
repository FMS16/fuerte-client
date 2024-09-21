"use client";

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const ToastContainer = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  { ssr: false }
);

export const LayoutProvider = ({ children }) => {
  const pathname = usePathname();
  
  useEffect(() => {
    if (pathname !== '/checkout' && pathname !== '/login') {
      import('react-toastify/dist/ReactToastify.css');
    }
  }, [pathname]);

  return (
    <>
      {pathname !== "/checkout" && pathname !== "/login" && <Header />}
      {children}
      {pathname !== "/checkout" && pathname !== "/login" && <Footer />}
      <ToastContainer />
    </>
  );
};
