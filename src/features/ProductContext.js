"use client"; 

import React, { createContext, useState, useEffect } from 'react';
import WebLoader from '@/components/Common/WebLoader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Creamos el contexto
export const ProductContext = createContext();

// Creamos el proveedor del contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product/getAll`, {
          method: 'GET',
          headers: new Headers({ 'Content-type': 'application/json'}),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <WebLoader />;
  }

  if (error) {
    return <div>Error al cargar productos: {error}</div>;
  }

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};
