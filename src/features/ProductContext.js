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
        // products tiene 
        data.sort((a, b) => b.id - a.id);
        setProducts(data.data);
      } catch (error) {
        console.error('Error:', error);
      } 

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <WebLoader />;
  }

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};
