import Slider from "react-slick";
import { Link } from "react-router-dom"; // ou next/link si Next.js
import dataDes from "../../data/dataDescription.json"
// Import des styles CSS pour react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import './slider1.css';

function SliderComponent() {
    const settings = {
        dots: false, // Changé de commentaire à false
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        arrows: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    fade: false, // Désactiver fade sur mobile
                }
            }
        ]
    };

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {dataDes.map((data) => (
                    <div key={data.id} className="slide-item">
                        <div className="relative">
                            <div className="h-[565px] min-w-screen relative overflow-hidden ">
                                <img
                                    src={data.img}
                                    alt={data.titre || "Image du slider"}
                                    className="absolute left-0 top-0 w-full h-full object-cover z-[-1] text-shadow-2xs text-shadow-black"
                                    loading="lazy"
                                />
                                {/* Overlay pour améliorer la lisibilité du texte */}
                                <div className="absolute inset-0 bg-black/30 z-0"></div>

                                <div className="absolute top-25 left-5 text-white w-[80%] z-10 ">
                                    {/* <h1 className="text-5xl font-extrabold pb-7 leading-tight animate-typing overflow-hidden"> */}
                                    <h1 className="animate-typing overflow-hidden whitespace-nowrap  border-r-transparent  text-5xl text-white font-bold pb-8 leading-tight text-shadow-sm text-shadow-black">
                                        {data.titre}
                                    </h1>
                                    <p className="text-xl mt-7 font-light w-[70%] leading-relaxed space-y-7 text-shadow-md text-shadow-black">
                                        {data.description}
                                    </p>

                                    {/* Boutons d'action */}
                                    <div className="mt-8 flex gap-4">

                                        <Link
                                            to="/acheter"
                                            className="border border-white text-white  px-30 py-2 rounded-lg font-mediumf hover:bg-white hover:text-gray-900 hover:scale-105"
                                        >
                                            En savoir plus
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="#comment-ca-marche"
                                className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 group transition-opacity duration-300 ${isScrolled ? 'opacity-30 hover:opacity-60' : 'opacity-100'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById('comment-ca-marche');
                                    if (element) {
                                        element.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                            inline: 'nearest'
                                        });
                                    }
                                }}
                            >
                                <div className="flex justify-center">
                                    <svg
                                        className="size-12 animate-bounce text-white border border-gray-900 bg-gray-900 p-2 rounded-3xl hover:bg-gray-800 hover:border-gray-800 transition-colors group-hover:animate-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </div>
                            </a>
                        </div>

                    </div>
                ))
                }
            </Slider >
        </div >
    );
}

export default SliderComponent;