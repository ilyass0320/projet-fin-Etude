import { Link } from "react-router-dom";
import Sliderr from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dataProd from '../../data/dataProd.json'
const Slider = () => {
    const settings = {
        // dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        arrows: false
    };
    return (

        <div className="max-w-full">
            <Sliderr {...settings} className="slider-container">
                {dataProd.map((data) => (
                    <div key={data.id} >
                        <div className=" h-[600px] flex flex-row justify-around items-center bg-[url('/images/gradient-blue.webp')] bg-cover brightness-40 text-white p-4">
                            <div className="flex flex-col space-y-2 mt-[20px]">
                                <img src={data.img_Marque} alt="" width={100} height={100} className="" />
                                <h1 className="text-5xl font-bold uppercase">{data.Marque}</h1>
                                <h2 className="text-xl font-medium uppercase mb-20">{data.model}</h2>
                                <span className="relative w-[200px] inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-gray-900">
                                    <span className="relative text-white text-2xl font-bold">{data.prix} DH</span>
                                </span>
                                <p className="w-[500px] h-[100px] text-prety">{data.description}</p>
                            </div>
                            <div className="flex drop-shadow-2xl/50 drop-shadow-black">
                                <Link to={`${data.Marque}-${data.model}`}>
                                    <img
                                        src={data.img}
                                        alt="Produit"
                                        width={600}
                                    />
                                </Link>
                            </div>
                        </div>

                    </div>
                ))}

            </Sliderr >

        </div>

    );
};

export default Slider;