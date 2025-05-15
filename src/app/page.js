'use client';

import { useEffect, useState } from 'react';
import Banner from "@/components/Common/Banner";
import ModalWeb from '@/components/Common/ModalWeb';

import bannerImg from "../assets/images/image3.webp";
import bannerImg1 from "../assets/images/image4.webp";

import bannerNew from "../assets/images/nuevoBanner.jpeg";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

/*
  useEffect(() => {
    // Mostrar modal solo la primera vez
    const hasModalShown = sessionStorage.getItem('modalShown');
    if (!hasModalShown) {
      setShowModal(true);
      sessionStorage.setItem('modalShown', 'true');
    }
  }, []);
*/
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="wrapper-banner">
        <Banner
          img={bannerNew}
          title={'TU MOTIVACIÓN'}
          subtitle={'YA ESTÁ ACÁ'}
          buttonText={'Ver colección'}
          positionTextLeft='50'
          positionTextTop='40'
          colorText={'white'}
          link={'/shop'}
          invertedTitle={false}
        />
        <Banner
          img={bannerImg1}
          title={'INSPIRACIÓN Y PROPÓSITO'}
          subtitle={'FUERTE'}
          buttonText={'Conoceme'}
          positionTextLeft='50'
          positionTextTop='50'
          colorText={'white'}
          link={'/about'}
          invertedTitle={true}
        />
      </div>

      {/* Modal */}
      <ModalWeb isVisible={showModal} onClose={handleCloseModal} />
    </>
  );
}
