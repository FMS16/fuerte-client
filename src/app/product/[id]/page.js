"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/features/CartContext";
import { useWishlist } from "@/features/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Bounce } from 'react-toastify';
import { useCurrency } from "@/features/CurrencyContext";
import WebLoader from "@/components/Common/WebLoader";

import guiaTalla from "../../../assets/images/Guía de tallas .png"
import ProductImages from "@/components/Common/ProductImages";

export default function ProductDetails({ params }) {
  const [ product, setProduct ] = useState(null);
  const [ activeSize, setActiveSize ] = useState(null);
  const { dispatch: wishlistDispatch, isInWishlist } = useWishlist();
  const { dispatch: cartDispatch, myCartVisible, setMyCartVisible } = useCart();

  const [ loading, setLoading ] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL;

  const { currency } = useCurrency();

  const [ isMobile, setIsMobile ] = useState(false);
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

  const addToCart = (product, productSize) => {
    if (productSize) {
      cartDispatch({ type: 'ADD_TO_CART', payload: { product, productSize } });
      setMyCartVisible(!myCartVisible);
    } else {
      toast.error("Por favor, selecciona un tamaño disponible.", { transition: Bounce });
    }
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/product/getById/${Number(params.id)}`);
        /* if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } */
        const data = await response.json();
        setProduct(data.data);

        // Seleccionar el primer tamaño disponible por defecto
        const defaultSize = data.data.productSizes.find(ps => ps.stock > 0);
        setActiveSize(defaultSize ? defaultSize.sizeId : null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [ params.id, currency ]);

  if (loading) { return <WebLoader /> }

  const myLoader = ({ src }) => {
    return `${baseImgUrl}/${src}`;
  };

  const toggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product);
      } else {
        addToWishlist(product);
      }
    }
  };

  const removeFromWishlist = (product) => {
    wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id: product.id } });
  };

  const addToWishlist = (product) => {
    wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: { ...product } });
  };

  return (
    <div className="product-details-container">
      {product != null && (
        <motion.div
          className="product-details"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!isMobile ? (
            <motion.div
              className="product-details-image-container"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: {
                  opacity: 1, y: 0,
                  transition: {
                    staggerChildren: 0.3, // Retraso entre cada imagen
                  },
                },
              }}
            >
              <motion.p className="relative" variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
                <Image loader={myLoader} src={product.mainImage} fill={true} alt={product.name} />
              </motion.p>

              {product.images.map(item => (
                <motion.p key={item.id} className="relative" variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
                  <Image quality={100} loader={myLoader} src={item.imageUrl} fill={true} alt={product.name} />
                </motion.p>
              ))}
            </motion.div>
          ) : (
            <>
              <ProductImages product={product} />
            </>
          )}



          <motion.div className="product-options-container" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <motion.div
              className="product-details-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ul className="product-details-sizes">
                {product.productSizes.map(ps => (
                  <li
                    key={ps.sizeId}
                    className="product-details-size"
                    onClick={() => {
                      if (ps.stock > 0) {
                        setActiveSize(ps.sizeId);
                      }
                    }}
                  >
                    <button
                      className={`${ps.stock === 0 ? 'disabled' : ''}`}
                      disabled={ps.stock === 0}
                    >
                      {ps.size.name}
                    </button>
                    {activeSize == ps.sizeId ? (
                      <motion.div layoutId="tab-indicator" className="product-details-active-size"></motion.div>
                    ) : null}
                  </li>
                ))}
              </ul>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <p className="price">${currency === 'USD' ? product.priceUSD : product.priceUYU}</p>
            </motion.div>

            <motion.div
              className="product-details-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                className="btn-add-to-cart"
                onClick={() => {
                  const selectedProductSize = product.productSizes.find(ps => ps.sizeId === activeSize);
                  if (selectedProductSize) {
                    addToCart(product, selectedProductSize);
                  } else {
                    // Manejar el caso donde no hay un tamaño seleccionado
                    toast.error("Por favor, selecciona un tamaño disponible.", { transition: Bounce });
                  }
                }}
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M832 312H696v-16c0-101.6-82.4-184-184-184s-184 82.4-184 184v16H192c-17.7 0-32 14.3-32 32v536c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V344c0-17.7-14.3-32-32-32zm-432-16c0-61.9 50.1-112 112-112s112 50.1 112 112v16H400v-16zm392 544H232V384h96v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h224v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-88h96v456z"></path>
                </svg>
                Añadir al carrito
              </button>
              {isInWishlist(product.id) ?
                <AnimatePresence>
                  <motion.button initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }} className='btn-details-add-to-wishlist is-wishlisted' onClick={toggleWishlist}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path></svg>
                  </motion.button>
                </AnimatePresence>
                :
                <motion.button initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }} className='btn-details-add-to-wishlist' onClick={toggleWishlist}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
                  </svg>
                </motion.button>}
            </motion.div>
            {!isMobile && (
              <motion.div
                className="product-details-size-guide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >

              </motion.div>
            )}
          </motion.div>

        </motion.div>
      )}

    </div>
  );
}
