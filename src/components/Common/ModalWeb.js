import React from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import img from "./../../assets/images/modal.jpeg";

const ModalWeb = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  // Renderizar en el portal (directamente en <body>)
  return ReactDOM.createPortal(
    <div className="modal-web">
      <div onClick={onClose} className="overlay"></div>
      <div className="modal-web-content">
        <div className="modal-web-img">
          <Image src={img} fill alt="Imagen Modal" />
        </div>
      </div>
    </div>,
    document.body // El portal renderiza aquí
  );
};

export default ModalWeb;
