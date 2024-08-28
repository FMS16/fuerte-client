import "../../styles/Common.css"
import gif from "../../assets/images/gif.gif"
import Image from "next/image"

const WebLoader = () => {
    return (
        <div className='webloader-container'>
            <Image src={gif} width={150} height={150} alt="Loader" />
        </div>
    )
}

export default WebLoader