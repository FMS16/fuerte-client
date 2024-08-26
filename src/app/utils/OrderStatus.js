"use client";

import React from 'react';

const OrderStatus = ({ orderStatus }) => {
    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return 'Recibida';
            case 1:
                return 'Procesando';
            case 2:
                return 'Despachada';
            case 3:
                return 'Enviada';
            case 4:
                return 'Entregada';
            default:
                return 'Procesando';
        }
    };

    return (
        <>
            {getStatusText(orderStatus)}
        </>
    );
}

export default OrderStatus;
