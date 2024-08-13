"use client";

import React, { createContext, useReducer, useEffect } from 'react';

// Define actionTypes
export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    GET_USERS: 'GET_USERS', // Nueva acción para obtener usuarios
};

// Initial state fetched from localStorage
export const initialState = {
    user: null, // Iniciar como null en lugar de usar sessionStorage
    isAuthenticated: false,
    isAdmin: false,
    users: [], // Nuevo estado para almacenar usuarios
};


// Context and Provider definition
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // Effect to check localStorage on mount
    useEffect(() => {
        console.log('Initial sessionStorage values:', {
            user: sessionStorage.getItem('user'),
            isAuthenticated: sessionStorage.getItem('isAuthenticated'),
            isAdmin: sessionStorage.getItem('isAdmin'),
        });
    
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
    }, []);
    
    

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7207/user/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.user.token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo los usuarios');
            }

            const responseData = await response.json();

            if (responseData.isSuccess) {
                dispatch({
                    type: actionTypes.GET_USERS,
                    payload: {
                        users: responseData.data,
                    },
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <UserContext.Provider value={{ state, dispatch, fetchUsers }}>
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

        case actionTypes.GET_USERS:
            return {
                ...state,
                users: action.payload.users,
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
                users: [], // Limpiar usuarios al cerrar sesión
            };

        default:
            return state;
    }
};
