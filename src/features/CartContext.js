"use client";

import React, { createContext, useState, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const { product, size } = action.payload;
      const existingItem = state.find(item => item.product.id === product.id && item.size.id === size.id);
      if (existingItem) {
        return state.map(item =>
          item.product.id === product.id && item.size.id === size.id
            ? {
              ...item,
              quantity: item.quantity <= 5 ? item.quantity + 1 : 5
            }
            : item
        );
      } else {
        return [...state, { product, size, quantity: 1 }];
      }

    case 'REMOVE_FROM_CART':
      return state.filter(item => !(item.product.id === action.payload.product.id && item.size.id === action.payload.size.id));

    case 'INCREMENT_QUANTITY':
      return state.map(item =>
        item.product.id === action.payload.id && item.size.id === action.payload.size.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREMENT_QUANTITY':
       return state.map(item =>
        item.product.id === action.payload.id && item.size.id === action.payload.size.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ); 

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};




export const CartProvider = ({ children }) => {
  const [ cart, dispatch ] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
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