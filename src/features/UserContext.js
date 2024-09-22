"use client";

import React, { createContext, useReducer, useEffect } from 'react';

// Define actionTypes
export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
};

// Initial state fetched from localStorage
export const initialState = {
    user: null, // Iniciar como null en lugar de usar sessionStorage
    isAuthenticated: false,
    isAdmin: false,
};


// Context and Provider definition
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(userReducer, initialState);

    // Effect to check localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            const storedIsAuthenticated = JSON.parse(sessionStorage.getItem('isAuthenticated'));
            const storedIsAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));

            if (storedUser && storedIsAuthenticated) {
                dispatch({
                    type: actionTypes.LOGIN,
                    payload: {
                        user: storedUser,
                    },
                });
            }
        }
    }, []);


    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

// Reducer function to manage state updates
export const userReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('user', JSON.stringify(action.payload.user));
                sessionStorage.setItem('isAuthenticated', JSON.stringify(true));
                sessionStorage.setItem('isAdmin', JSON.stringify(action.payload.user.rol === 'Admin'));
            }

            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isAdmin: action.payload.user.rol === 'Admin',
            };

        case actionTypes.LOGOUT:
            if (typeof window !== 'undefined') {
                // Puedes usar window o localStorage aquí
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('isAuthenticated');
                sessionStorage.removeItem('isAdmin');
            }

            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isAdmin: false,
            };

        default:
            return state;
    }
};
