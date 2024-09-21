"use client";

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '@/features/UserContext';
import { useRouter } from 'next/navigation';
import { actionTypes } from '@/features/UserContext';
import WebLoader from '../Common/WebLoader';
import Image from 'next/image';
import OrderStatus from '@/app/utils/OrderStatus';
import { useCurrency } from '@/features/CurrencyContext';

const UserDetailsComponent = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { state, dispatch } = useContext(UserContext);
  const [ loading, setLoading ] = useState(true);
  const [ orders, setOrders ] = useState([]);
  const [ activeIndex, setActiveIndex ] = useState(null);

  const {currency} = useCurrency();

  useEffect(() => {
    console.log(state.user);
    const fetchOrders = async () => {
      if (state.user) {
        try {
          const response = await fetch(`${baseUrl}/order/getByCustomerId/${state.user.logged.id}`);
          const data = await response.json();
          setOrders(data.data);
          console.log(data.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [ state.user, baseUrl ]);
  const router = useRouter();
  const handleNavClick = (index) => {
    if (index == 3) {
      dispatch({ type: actionTypes.LOGOUT });
      router.push('/');
    } else if (index == 1) {
      router.push('/wishlist');
    }
    console.log(orders);
    setActiveIndex(index);
  };

  if (loading) { return <WebLoader /> }

  const baseUrlImg = process.env.NEXT_PUBLIC_BASE_IMG_URL;

  const myLoader = ({ src }) => {
    return src;
  };

/*   const {currency} = useCurrency(); */

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
                Mi cuenta
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
          <div className='user-details-content container'>
            {activeIndex === 0 && (
              <div className='user-orders'>
                {orders.map(order =>
                  <div key={order.id} className='user-order'>
                    <p className='bb'><span>N&uacute;mero de &oacute;rden: </span><span>{order.id}</span></p>
                    <p className='bb'><span>N&uacute;mero de transacci&oacute;n:</span> <span>{order.paymentId == null ? order.paymentReference : order.paymentId}</span></p>
                    <p className='bb'><span>Estado:</span><span>{ <OrderStatus orderStatus={order.orderStatus} /> }</span> </p>
                    <ul>
                      {order.products.map((orderProduct, index) =>
                        <li key={index} className='user-order-product'>
                          <p><Image loader={myLoader} src={`${baseUrlImg}/${orderProduct.product.image}`} width={100} height={150} alt={`${orderProduct.product.name}`} /></p>
                          <p className='user-order-product-info'><span>{orderProduct.product.name}</span> - <span>{orderProduct.size.name}</span> - <span> x{orderProduct.quantity}</span></p>
                        </li>
                      )}
                    </ul>
                    { <p className='bt'><span>Total:</span> <span className='price'>${currency == "USD" ? order.totalUSD : order.totalUYU}</span></p> }
                  </div>)}
              </div>
            )}
            {activeIndex == 2 && state.user.rol == "Admin" && (
              <div className='user-acount-details'>
                <p>Nombre: {state.user.name}</p>
                <p>Apellido: {state.user.lastName}</p>
                <p>Email: {state.user.email}</p>
              </div>
            )}
            {activeIndex === 2 && state.user.logged != null && (
              <div className='user-acount-details'>
              <p>Nombre: {state.user.logged.name}</p>
              <p>Apellido: {state.user.logged.lastName}</p>
              <p>Email: {state.user.logged.email}</p>
              <p>Tel&eacute;fono: {state.user.logged.phone}</p>
            </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetailsComponent;
