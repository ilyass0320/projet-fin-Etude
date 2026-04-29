// import { useRouter } from 'next/router'
import Slider from '../Slider/slider'
import Filtrage from './FilterageAchat-location'
import Header from '../Navbar/Header'
import Footer from '../Navbar/Footer'


const acheter = () => {
    // const router = useRouter();
    return (
        <div>
            {/* <button onClick={() => router.push('/acheter')} className=""></button> */}
            <Header />
            <Slider />
            <Filtrage />
            <Footer />
        </div>
    )
}

export default acheter
