// src/app/page.js
import Banner from "@/components/Common/Banner";

import Image from "next/image";
import bannerImg from "../assets/images/image3.webp";
import bannerImg1 from "../assets/images/image4.webp"
import bannerImg2 from "../assets/images/Tezza-4600.webp"

export default function Home() {
  return (
    <>
      <div className="wrapper-banner">
        <Banner
          img={bannerImg}
          title={'TU MOTIVACIÓN'}
          subtitle={'YA ESTÁ ACÁ'}
          buttonText={'Ver colección'}
          positionTextLeft='15'
          positionTextTop='50'
          colorText={'white'}
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
          invertedTitle={true}
        />
      </div>

    </>
  );
}
