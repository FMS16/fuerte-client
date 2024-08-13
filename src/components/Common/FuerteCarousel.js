import logo from "../../assets/images/logoRecortadoFino.png";
import Image from "next/image";
const FuerteCarousel = () => {
    const slides = [];
    for (let i = 0; i < 14; i++) {
        slides.push(
            <div className="slide" key={i}>
                <Image src={logo} alt="Logo" />
            </div>
        );
    }
    return (
        <div className="slider">
            <div className="slide-track">
                {slides}
                {slides}
            </div>
        </div>
    );
};

export default FuerteCarousel;
