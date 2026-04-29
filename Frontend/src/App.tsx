import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider1 from "./pages/Slider/Slider1";
import logo from "/images/Logo_vehicules.png";
import logo1 from "/images/Qualite_Garanter.png";
import logo2 from "/images/SatisfactionGarantie.png";
import Thinking from "/images/Thinking.jpg"
import Footer from './pages/Navbar/Footer';
import SwiperA from "./pages/Slider/SliderClient";
import { useState } from 'react';
// import { Divide } from 'lucide-react';
import { IoCarSportOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { MdGppGood } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiKeyCard } from "react-icons/gi";
import { RiArrowRightWideLine } from "react-icons/ri";

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Header from "./pages/Navbar/Header";
import Marques from "./pages/Navbar/Marques";

const information = [
  { id: 1, title: "une large choix", Image: { logo }, description: "Découvrez une large game de marques et de modeles adaptes a votre budget et a votre style. Choisissez parmi nos nombreuses option en essence et diesel.", image: logo },
  { id: 2, title: "qualite garantie", Image: { logo1 }, description: "Nous garantissons des véhicules et accessoires rigoureusement contrôlés pour assurer fiabilité et satisfaction. Chaque véhicule est inspecté avant location ou vente, et nos accessoires proviennent de marques reconnues pour leur durabilité. Avec notre engagement qualité, vous achetez et louez en toute confiance.", image: logo1 },
  { id: 3, title: "Satisfaction garantie", Image: { logo2 }, description: "Réservez en toute confiance ! Profitez d’une garantie de 3 jours sur votre réservation et, après l’achat ou la location, bénéficiez de 10 jours pour observer votre véhicule ou accessoire. En plus, l’immatriculation est garantie pour tout achat de véhicule. Sécurité et tranquillité assurées !", image: logo2 }
];
function App() {
  const [activeBu, setActiveBu] = useState("acheter");
  const [isFlipped, setIsFlipped] = useState({});
  const handleFlip = (id) => {
    setIsFlipped(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      {/* slider description de contenant de site web */}
      <Header />
      <Slider1 />

      {/* comment ca marche le process */}
      <div id="comment-ca-marche" className='mt-[100px] flex flex-col justify-center items-center' >
        <h1 className='text-3xl font-bold mb-3'>Comment ca marche?</h1>
        {/* Animation button active */}
        <div className={`bg-gray-900  transition-all ${activeBu === "Location" ? "translate-x-full" : "translate-x-0"}`}></div>
        {/* button acheter */}
        <div className=' flex flex-row border border-gray-900 rounded-3xl font-stretch-50% text-[40px]'>
          <button className={`px-16 py-1 rounded-3xl text-center text-sm font-semibold transition-all ${activeBu === "acheter" ? "text-white bg-gray-900" : "text-black"}`} onClick={() => setActiveBu("acheter")}>Acheter</button>
          <button className={`px-16 py-1 rounded-3xl text-center text-sm font-semibold transition-all ${activeBu === "Location" ? "text-white bg-gray-900" : "text-black"}`} onClick={() => setActiveBu("Location")}>Location</button>
        </div>


        {/* afficher selon l'ongle active */}
        <div>
          {
            activeBu === "acheter" ? (
              <div className='flex flex-row mt-2'>
                <div className='w-[200px] flex flex-col items-center'>
                  <FaSearch className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Découvez Nos véhicules</h1>
                  <p className='font-thin text-center text-sm'>Parcourir notre catalogue du voitures, Motors, Velos et leurs accessoires</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  < MdOutlineVerified className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>choisissez une véhicules </h1>
                  <p className='font-thin text-center text-sm'>Séléctionnez le véhicule que vous voulez</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  <IoCarSportOutline className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Acheter votre Véhicule</h1>
                  <p className='font-thin text-center text-sm'>Faites votre achat</p>
                </div>
              </div>
            ) : (
              <div className='flex flex-row mt-2'>
                <div className='w-[200px] flex flex-col items-center'>
                  <FaSearch className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Découvez Votre véhicules</h1>
                  <p className='font-thin text-center text-sm'>Parcourir notre catalogue du voitures, Motors, Velos et leurs accessoires</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  <MdGppGood className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Reservation du Vehicule</h1>
                  <p className='font-thin text-center text-sm'>Sélectionnez votre véhicule, ajoutez les options souhaitées ,la date (Debut, Fin) et dévoiler l'etat technique du vehicule a decider .</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  <RiAccountPinBoxFill className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Informations Personnelle</h1>
                  <p className='font-thin text-center text-sm'>Faites votre achat</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  <FaMoneyCheckDollar className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>Paiement et Confirmation</h1>
                  <p className='font-thin text-center text-sm'>Faites votre achat</p>
                </div>
                <div className='w-[200px] flex flex-col items-center'>
                  <GiKeyCard className='w-[40px] h-[40px] p-2 rounded-full text-white bg-gray-900' />
                  <h1 className='font-bold capitalize'>récupération du vehicule</h1>
                  <p className='font-thin text-center text-sm'>Présentez-vous à l'agence avec vos documents pour finaliser la prise en charge.</p>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {/* pourquoi choisir */}
      <div className='relative w-full h-[300px] mt-[100px] pb-[10px] border border-gray-400 rounded-2xl drop-shadow-4xl '>
        <img src={Thinking} alt="" className='absolute w-full  h-[35em] brightness-50 ' />
        <h1 className='absolute text-5xl text-white font-bold top-5 left-1/4 mb-10  '>Pourquoi choisir <span className='font-extrabold pl-3 text-gray-300'>MOTO?</span></h1>
        <div className='absolute flex flex-row justify-between gap-5 h-[270px] w-[76em] p-3 m-4 rounded-2xl bg-white opacity-80 top-70 z-10'>

          <div className="flex flex-row gap-5">{
            information.map((index) => (
              <div key={index.id} className="card flex flex-col w-[24em] ">
                <div className="cursor-poniter w-full h-full" style={{ perspective: '1000px' }} onClick={() => handleFlip(index.id)}>
                  <div className="relative w-full h-full transition-transform duration-700" style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped[index.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>

                    <div className='absolute inset-0 flex flex-col justify-center items-center p-4' style={{ backfaceVisibility: 'hidden' }}>
                      <img src={index.image} alt="" width={70} className='' />
                      <h2 className='text-2xl text-gray-900 font-bold capitalize ' >{index.title}</h2>
                      <RiArrowRightWideLine className="size-6 ml-2 opacity-50 mt-7" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-gray-900 rounded-2xl" style={{
                      backfaceVisibility: "hidden",
                      transform: 'rotateY(180deg)'
                    }}>
                      <h2 className='text-2xl font-bold capitalize text-white underline' >{index.title}</h2>
                      <p className='font-thin text-white text-center text-sm p-2 leading-relaxed'>{index.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* camion livraison */}
      < div className='mt-[20em] p-2 flex flex-row ' >
        <div className="w-[50em] h-[25em] transform group-hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden shadow-lg">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover brightness-60"
          >
            <source src="/videos/moto_livraison_camion.mp4" type="video/mp4" />
          </video>
        </div>
        {/* <img src={Camion} alt="" width={900} className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500" /> */}
        <div className="card w-[40em] flex flex-col justify-center items-center m-4">
          <h1 className='font-extrabold text-4xl pb-2 uppercase'>Moto</h1>
          <p className='font-light text-center  ' >Découvrez notre camion spécialement conçu pour la livraison à domicile de véhicules, alliant design, sécurité et efficacité logistique. Ce véhicule utilitaire innovant permet de transporter des Voiturs, Motos et Velos dans des conditions optimales.</p>
        </div>
      </div >
      <SwiperA />
      <Marques />
      <Footer />
    </div >
  )
}

export default App
