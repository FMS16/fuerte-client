import Image from "next/image"

const Banner = ({ img, title, subtitle, buttonText, positionTextTop, positionTextLeft, colorText }) => {
    const styles = {
        'left': positionTextLeft+'%',
        'top': positionTextTop+'%',
        'transform': `translateX(${-positionTextLeft}%), translateY(${positionTextTop}%)`,
        'color': colorText
    }
    return (
        <div className="banner">
            <Image src={img} alt="banner"></Image>
            <div className="banner-text" style={styles}>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <button>{buttonText}</button>
            </div>
        </div>
    )
}

export default Banner