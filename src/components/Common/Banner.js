import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Banner = ({ img, title, subtitle, buttonText, positionTextTop, positionTextLeft, colorText, invertedTitle, link }) => {
    const [adjustedPositionLeft, setAdjustedPositionLeft] = useState(positionTextLeft);

    useEffect(() => {
        // Función para ajustar el valor basado en el ancho de la ventana
        const handleResize = () => {
            if (window.innerWidth > 1024) { // Consideramos PC si el ancho es mayor a 1024px
                setAdjustedPositionLeft(15); // Forzar 15 si es PC
            } else {
                setAdjustedPositionLeft(positionTextLeft); // Usar el valor inicial
            }
        };

        // Ejecutar al cargar el componente y en cada cambio de tamaño
        handleResize();
        window.addEventListener("resize", handleResize);

        // Limpieza del evento
        return () => window.removeEventListener("resize", handleResize);
    }, [positionTextLeft]); // Escuchar cambios en positionTextLeft

    const styles = {
        left: adjustedPositionLeft + '%',
        top: positionTextTop + '%',
        transform: `translateX(${-adjustedPositionLeft}%), translateY(${positionTextTop}%)`,
        color: colorText
    };

    return (
        <div className="banner">
            <Image
                src={img}
                alt="banner"
                layout="fill"
                objectFit="cover"
                quality={100}
                unoptimized
                priority
            />
            <div className="banner-text" style={styles}>
                <p>{invertedTitle}</p>
                {invertedTitle ? (
                    <>
                        <p>{title}</p>
                        <h1>{subtitle}</h1>
                    </>
                ) : (
                    <>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </>
                )}
                <Link href={link}>{buttonText}</Link>
            </div>
        </div>
    );
};

export default Banner;
