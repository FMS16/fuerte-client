"use client";

import React, { createContext, useState, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

// CartContext.js
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item =>
        item.product.id === action.payload.product.id &&
        item.productSize.sizeId === action.payload.productSize.sizeId
      );

      if (existingItem) {
        // Verificar el stock disponible
        const maxQuantity = action.payload.productSize.stock;
        const newQuantity = Math.min(existingItem.quantity + 1, maxQuantity);

        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id &&
              item.productSize.sizeId === action.payload.productSize.sizeId
              ? { ...item, quantity: newQuantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [ ...state.items, { ...action.payload, quantity: 1 } ]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item =>
          !(item.product.id === action.payload.product.id && item.productSize.sizeId === action.payload.productSize.sizeId)
        )
      };

    case 'INCREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.product.id &&
            item.productSize.sizeId === action.payload.productSize.sizeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case 'DECREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.product.id &&
            item.productSize.sizeId === action.payload.productSize.sizeId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
      };


    default:
      return state;
  }
};


export const CartProvider = ({ children }) => {
  const [ cart, dispatch ] = useReducer(cartReducer, {
    items: [],
  }, () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : { items: [] };
  });

  const [ myCartVisible, setMyCartVisible ] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [ cart ]);

  return (
    <CartContext.Provider value={{ cart, dispatch, myCartVisible, setMyCartVisible }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
