"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Contact = () => {
  const [ formData, setFormData ] = useState({
    fullName: '',
    email: '',
    option: '',
    message: ''
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [ name ]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const response = await fetch(`${API_BASE_URL}/user/contact-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            "fullName": formData.fullName,
            "email": formData.email,
            "option": formData.option,
            "message": formData.message
           })
        });

        if (!response.ok) {
          throw new Error('La respuesta del servidor no fue correcta.');
        }

        const responseFetch = await response.json();
        if (responseFetch.data == true) {
          toast.success("Mensaje enviado con éxito.", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {

        toast.error(error.message, {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    

    // Después de procesar, podrías limpiar el formulario si lo deseas
    setFormData({
      fullName: '',
      email: '',
      option: '',
      message: ''
    });
  };

  return (
    <div className='contact'>
      <div className='container-90'>
        <h1 className='title-medium'>Contact&aacute;nos</h1>
        <p>Por favor, revisa nuestra secci&oacute;n de <Link href='/faqs'>preguntas frecuentes.</Link> ¡Quiz&aacute;s ya resolvimos tu duda!</p>
        <form className='form-contact' onSubmit={handleSubmit}>
          <div className='input-field'>
            <input
              type='text'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              spellCheck='false'
              required
            />
            <label>Nombre Completo</label>
          </div>
          <div className='input-field'>
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
              spellCheck='false'
              required
            />
            <label>Email</label>
          </div>
          <div className='input-select'>
            <select
              name='option'
              value={formData.option}
              onChange={handleChange}
              required
            >
              <option value='' disabled>Seleccione una opci&oacute;n</option>
              <option>Consulta general</option>
              <option>Pagos</option>
              <option>Devoluciones</option>
              <option>Reclamo</option>
              <option>Otro</option>
            </select>
          </div>
          <div className='input-textarea'>
            <label>Mensaje</label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              rows='4'
              cols='50'
              required
            ></textarea>
          </div>

          <input type='submit' className='btn-form' value='Enviar' />
        </form>
      </div>
    </div>
  );
}

export default Contact;
