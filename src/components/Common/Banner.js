import Image from "next/image"
import Link from "next/link"

const Banner = ({ img, title, subtitle, buttonText, positionTextTop, positionTextLeft, colorText, invertedTitle, link }) => {
    const styles = {
        'left': positionTextLeft + '%',
        'top': positionTextTop + '%',
        'transform': `translateX(${-positionTextLeft}%), translateY(${positionTextTop}%)`,
        'color': colorText
    }
    
    return (
        <div className="banner">
            <Image src={img} alt="banner" 
                layout="fill" 
                objectFit="cover" 
                quality={100} 
                unoptimized
                priority ></Image>
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
                <button><Link href={link}>{buttonText}</Link></button>
            </div>
        </div>
    )
}

export default Banner