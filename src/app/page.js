// src/app/page.js
import Banner from "@/components/Common/Banner";
import FuerteCarousel from "@/components/Common/FuerteCarousel";
import Image from "next/image";
import bannerImg from "../assets/images/banner.jpg";

export default function Home() {
  return (
    <>
      <Banner 
        img={bannerImg} 
        title={'Ya llegamos.'} 
        subtitle={'Para empoderarte'} 
        buttonText={'Ver coleccion'} 
        positionTextLeft='15'
        positionTextTop='50'
        colorText={'white'}
      />
      <FuerteCarousel />
    </>
  );
}
