"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/features/WishlistContext';
import { AnimatePresence, motion } from 'framer-motion';
import ProductList from './ProductList';

const WishlistComponent = () => {
    const { wishlist } = useWishlist();
    const [ isEmpty, setIsEmpty ] = useState(true);

    useEffect(() => {
        setIsEmpty(wishlist.length === 0);
    }, [wishlist]);

    return (
        <div className='section wishlisted-products-page container'>
            <h1 className='section-title'>Wishlist</h1>
            <button className='btn-continue-shopping'>
                <Link href='/shop'>Continuar Comprando</Link>
            </button>
            <AnimatePresence>
                { !isEmpty && (
                    <motion.div
                        key="product-list"  // Clave única para el contenedor
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ProductList products={wishlist} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WishlistComponent;
