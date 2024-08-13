import logo from "../../assets/images/logoRecortadoFino.png";
import Image from "next/image";
const FuerteCarousel = () => {

    return (
        <div class="slider">
        <div class="slide-track">
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>

            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
            <div class="slide">
                <Image src={logo} width={160} height={25} alt="Logo" />
            </div>
        </div>
    </div>

    );
};

export default FuerteCarousel;
