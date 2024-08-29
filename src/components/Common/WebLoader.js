import "../../styles/Common.css"
import gif from "../../assets/images/gif2.gif"
import Image from "next/image"

const WebLoader = () => {
    return (
        <div className='webloader-container'>
            <Image src={gif} width={125} height={125} alt="Loader" />
        </div>
    )
}

export default WebLoader