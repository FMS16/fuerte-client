import React from 'react'
import Acordion from './Acordion'


const FAQs = () => {
    return (
        <div className='faqs'>
            <div className='container-90'>
                <Acordion />
                <p>Si tienes alguna duda, no dudes en contactarnos por Whatsapp o a <span className='bold'>hola@fuerte.com.uy</span>, estaremos encantados de atenderte.</p>
            </div>
        </div>
    )
}

export default FAQs