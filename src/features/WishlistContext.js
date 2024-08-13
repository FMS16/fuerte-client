"use client";

import React, { createContext, useReducer, useContext } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const itemExists = state.some(item => item.id === action.payload.id);
      if (itemExists) {
        return state; // Si el producto ya está en la wishlist, no lo agrega
      }
      const updatedState = [...state, action.payload];
      localStorage.setItem('wishlist', JSON.stringify(updatedState));
      return updatedState;

    case 'REMOVE_FROM_WISHLIST':
      const filteredState = state.filter(item => item.id !== action.payload.id);
      localStorage.setItem('wishlist', JSON.stringify(filteredState));
      return filteredState;
    case 'CLEAR_WISHLIST':
      localStorage.removeItem('wishlist');
      return [];

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, [], () => {
    const localData = localStorage.getItem('wishlist');
    return localData ? JSON.parse(localData) : [];
  });

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, dispatch, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
