import Image from "next/image"

const Banner = ({ img, title, subtitle, buttonText, positionTextTop, positionTextLeft, colorText, invertedTitle }) => {
    const styles = {
        'left': positionTextLeft + '%',
        'top': positionTextTop + '%',
        'transform': `translateX(${-positionTextLeft}%), translateY(${positionTextTop}%)`,
        'color': colorText
    }
    
    return (
        <div className="banner">
            <Image src={img} alt="banner" unoptimized quality={100}></Image>
            <div className="banner-text" style={styles}>
                <p>{invertedTitle}</p>
                {invertedTitle ? <>
                    <p>{title}</p>
                    <h1>{subtitle}</h1>
                </> :
                    <>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </>}
                <button>{buttonText}</button>
            </div>
        </div>
    )
}

export default Banner