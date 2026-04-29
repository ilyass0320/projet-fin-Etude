import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Marques = () => {
    const settings_1 = {
        // dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        pauseOnHover: true,
    };

    return (
        <div className='max-w-full overflow-hidden mt-50'>
            <div className=' bg-gray-100 w-full h-25'>
                <Slider {...settings_1} >
                    <div className='slider-item items-center'>
                        <img src="/images/Audi-logo.png" alt="audi" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/bmw-logo.png" alt="bmw" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Citroen_logo.png" alt="citroen" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Dacia_logo.png" alt="dacia" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Ford-Logo.png" alt="ford" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Kia.jpg" alt="kia" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/logo-Peugeot.png" alt="peugeot" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Merc_logo.png" alt="Mercides" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/nissan_logo.png" alt="nisaan" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/renault-logo.png" alt="renault" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/harley-davidson-logo.jpg" alt="harley" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/honda_logo.jpg" alt="honda" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/kawasaki-logo.jpg" alt="kawasaki" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/suzuki_logo.jpg" alt="suzuki" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/yamaha_logo.jpg" alt="yamaha" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/scott-logo.png" alt="scott" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/giantLogo.png" alt="giand" width={100} />
                    </div>
                    <div className='slider-item'>
                        <img src="/images/Lapierre-logo.jpg" alt="lapierre" width={100} />
                    </div>
                </Slider>
            </div>
        </div>
    )
}

export default Marques
