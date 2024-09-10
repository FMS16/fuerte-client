"use client";

import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ProductContext } from '@/features/ProductContext'
import ProductList from '@/components/Common/ProductList';
import { useRouter } from 'next/navigation';

export default function Shop() {
  const { products } = useContext(ProductContext);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
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
  }, []);
  return (
    <div className="shop container section">
      <ProductList products={products} />
    </div>
  )
}