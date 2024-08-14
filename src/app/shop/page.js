"use client";

import React, { useEffect } from 'react'
import { useContext } from 'react'
import { ProductContext } from '@/features/ProductContext'
import ProductList from '@/components/Common/ProductList';
import { useRouter } from 'next/navigation';

export default function Shop() {
  const { products } = useContext(ProductContext);
  const router = useRouter();

  return (
    <div className="shop container section">
      <ProductList products={products} />
    </div>
  )
}