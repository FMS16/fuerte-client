"use client";

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '@/features/UserContext';
import { useRouter } from 'next/navigation';
import { actionTypes } from '@/features/UserContext';
import WebLoader from '../Common/WebLoader';

const UserDetailsComponent = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (state.user) {
        try {
          const response = await fetch(`${baseUrl}/order/getById/${state.user.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setOrders(data.data);
          console.log(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [state.user, baseUrl]); 
  const router = useRouter();
  const handleNavClick = (index) => {
    if(index == 3){
      dispatch({type: actionTypes.LOGOUT});
      router.push('/');
    }
    setActiveIndex(index);
  };

  if(loading){return <WebLoader />}

  return (
    <div className='user-details container'>
      {state.user && (
        <>
          <h1>Tu perfil</h1>
          <nav className='user-nav-details'>
            <ul>
              <li onClick={() => handleNavClick(0)}>
                Mis &oacute;rdenes
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </li>
              <li onClick={() => handleNavClick(1)}>
                Mis favoritos
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </li>
              <li onClick={() => handleNavClick(2)}>
                Mi direcci&oacute;n
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </li>
              <li onClick={() => handleNavClick(3)}>
                Cerrar Sesi&oacute;n
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z" clipRule="evenodd"></path>
                  <path fillRule="evenodd" d="M2 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H2.5A.5.5 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </li>
            </ul>
          </nav>
          <div className='user-details-content'>
            {activeIndex === 0 && (
              <div>
                <h2 className='title-small'>Mis &oacute;rdenes</h2>
                {/* Aquí renderiza el contenido de órdenes */}
              </div>
            )}
            {activeIndex === 1 && (
              <div>
                <h2 className='title-small'>Mis favoritos</h2>
                {/* Aquí renderiza el contenido de favoritos */}
              </div>
            )}
            {activeIndex === 2 && (
              <div>
                <h2 className='title-small'>Mi direcci&oacute;n</h2>
                {/* Aquí renderiza el contenido de dirección */}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetailsComponent;
