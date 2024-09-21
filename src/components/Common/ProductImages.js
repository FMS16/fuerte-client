"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image'; // O la librería de imágenes que uses

const ProductImages = ({ product }) => {
    const [ mainImage, setMainImage ] = useState(product.mainImage); // Imagen principal

    const images = [...product.images, product.mainImage]; // Añade la imagen principal al final

    const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL;

    const myLoader = ({ src }) => {
        return `${baseImgUrl}/${src}`;
    };

    // Variantes de animación
    const imageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <>
            <div className="product-details-image-container relative">
                <motion.div
                    className="relative"
                    key={mainImage} // Cambia la clave para forzar la salida de la animación
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={imageVariants}
                    transition={{ duration: 0.3 }} // Duración de la transición
                >
                    <Image
                        loader={myLoader}
                        src={mainImage}
                        layout="fill"
                        alt={product.name}
                    />
                </motion.div>
            </div>

            <div className="product-thumbnails-container">
                {images.map((item, index) => (
                    <div
                        key={index}
                        className="product-thumbnail"
                        onClick={() => setMainImage(item.imageUrl)} // Cambiar la imagen principal
                    >
                        <Image
                            loader={myLoader}
                            src={item.imageUrl}
                            width={80} // Ancho de las miniaturas
                            height={80} // Alto de las miniaturas
                            alt={`thumbnail-${index}`}
                            quality={100}
                            className="thumbnail-image"
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default ProductImages;
