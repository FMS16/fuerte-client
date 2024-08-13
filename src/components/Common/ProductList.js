import React from 'react';
import ProductItem from './ProductItem';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = ({ products }) => {
  // Definir la animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // Cada hijo aparece 0.5 segundos después del anterior
        delayChildren: 0.3, // Retraso antes de que comience la animación
      },
    },
  };

  // Definir la animación para cada item
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }, // Animación al salir
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className='shop-container-products'
    >
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            initial="hidden"
            animate="show" 
            exit="exit" // Aplicar animación de salida
            transition={{ delay: index * 0.5 }} // Retrasar la animación de cada item
            className='shop-product-item'
          >
            <ProductItem product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductList;
