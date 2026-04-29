import { Link } from 'react-router-dom';
import logoo from '/images/MOTO.png';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ImWhatsapp } from "react-icons/im";
import "./Footer.css"


// import Marques from './Marques';
// import Slider2 from '../Slider/Slider2'

const Footer = () => {
    return (
        <div className=''>
            {/*les marques*/}
            {/* <Marques /> */}
            <footer className="bg-black text-gray-400">
                {/* footer */}
                <div className='flex flex-col p-2'>
                    <div className='flex flex-row'>
                        <div>
                            <img src={logoo} alt="logo" className='w-50 rounded-2xl ' />
                            <p> Votre marché de confiance pour les voitures, les motos et les vélos.</p>
                            <div className='flex flex-row p-2 gap-2 mt-7'>
                                <Link to="facebook"><FaFacebook className="size-6 hoverFac" /></Link>
                                <Link to="instagram"><FaInstagram className="size-6 hoverIns" /></Link>
                                <Link to="twitter"><FaXTwitter className="size-6 hoverX" /></Link>
                                <Link to="whatsapp"><ImWhatsapp className="size-6 hoverWha" /></Link>
                            </div>
                        </div>
                        <div className='flex flex-row ml-[100px] gap-20 mt-5'>

                            <div>
                                <div className='flex flex-col'>
                                    <h3 className='underline text-xl'>Categorie</h3>
                                    <div className='flex flex-col'>
                                        <Link to='/acheter' className="text-base text-gray-300 hoverF">Voitures</Link>
                                        <Link to='/location' className="text-base text-gray-300 hoverF" >Motours</Link>
                                        <Link to='/reprise' className="text-base text-gray-300 hoverF">Velos</Link>
                                    </div>
                                    <h3 className="text-base text-gray-500 hoverF">Accessoires</h3>
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col'>
                                    <h3 className='underline text-xl'>Service</h3>
                                    <div className='flex flex-col'>
                                        <Link to='/acheter' className="text-base text-gray-300 hoverF">Acheter</Link>
                                        <Link to='/location' className="text-base text-gray-300 hoverF">Location</Link>
                                        <Link to='/reprise' className="text-base text-gray-300 hoverF">Reprise</Link>
                                        <Link to='/comparaison' className="text-base text-gray-300 hoverF">Comparaison</Link>
                                        <Link to='/login' className="text-base text-gray-300 hoverF">Connection</Link>
                                        <Link to='/assisstance' className="text-base text-gray-300 hoverF">Assisstance</Link>
                                        <Link to='/account' className="text-base text-gray-300 hoverF">Account</Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col'>
                                    <h3 className='underline text-xl'>Avantages</h3>
                                    <div className='flex flex-col'>
                                        <Link to='/livraison-a-domicile' className="text-base text-gray-300 hoverF">Livraison a domicile</Link>
                                        <Link to='/Achat_en_ligne' className="text-base text-gray-300 hoverF">Achat en ligne</Link>
                                        <Link to='/Immatriculation' className="text-base text-gray-300 hoverF">Immatriculation </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col'>
                                    <h3 className='underline text-xl'>Contactez-Nous</h3>
                                    <div className='flex flex-col'>
                                        <Link to="facebook" className="text-base text-gray-400 hoverFac ml-2">facebook</Link>
                                        <Link to="instagram" className="text-base text-gray-400 hoverIns ml-2">instagram</Link>
                                        <Link to="twitter" className="text-base text-gray-400 hoverX ml-2">twitter</Link>
                                        <Link to="whatsapp" className="text-base text-gray-400 hoverWha ml-2">Whatsapp</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 border-t border-gray-700 pt-8 ">
                        <p className="text-base text-gray-400 text-center ">
                            &copy; 2025 MOTO.Tous droits réservés.
                        </p>
                    </div>
                </div>
                {/* <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8 xl:col-span-1">
                            <h3><img src={logoo} alt="" className='rounded-2xl' /></h3>
                            <p className="text-gray-400 text-base">
                                Votre marché de confiance pour les voitures, les motos et les vélos.
                            </p>

                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                            <div className="md:grid md:grid-cols-5 md:gap-30 md:ml-[50px]">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                                        Categories
                                    </h3>
                                    <h4 className='pt-4 text-gray-400'>Vehicules</h4>
                                    <ul className="mt-2 space-y-4">
                                        <li>
                                            <Link to="/vehicles/cars" className="text-base text-gray-300 hover:text-white">
                                                Voitures
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/vehicles/motorcycles" className="text-base text-gray-300 hover:text-white">
                                                Motos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/vehicles/bicycles" className="text-base text-gray-300 hover:text-white">
                                                Vélos
                                            </Link>
                                        </li>
                                    </ul>
                                    <h4 className='pt-4 text-gray-400'>Accessoires</h4>
                                </div>
                                <div className="mt-12 md:mt-0  md:ml-[100px]">
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                                        Service
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                                                Acheter
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/location" className="text-base text-gray-300 hover:text-white">
                                                Location
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/reprise" className="text-base text-gray-300 hover:text-white">
                                                reprise
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/comparaison" className="text-base text-gray-300 hover:text-white">
                                                comparaison
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-12 md:mt-0  md:ml-[100px]">
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                                        Menu
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                                                Acheter
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/location" className="text-base text-gray-300 hover:text-white">
                                                Location
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/reprise" className="text-base text-gray-300 hover:text-white">
                                                reprise
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/assisstance" className="text-base text-gray-300 hover:text-white">
                                                Assisstance
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/login" className="text-base text-gray-300 hover:text-white">
                                                connection
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/store" className="text-base text-gray-300 hover:text-white">
                                                panier
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-12 md:mt-0  md:ml-[100px]">
                                    <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                                        Avantages
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                                                Livraison domicile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="text-base text-gray-300 hover:text-white">
                                                Achat en ligne
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" className="text-base text-gray-300 hover:text-white">
                                                Immatriculation
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-6 float-right mr-10 mb-5 ">
                        <a href="#" className="text-gray-400 hover:text-gray-300 ml-2">

                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-300 ml-2">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-300 ml-2">
                            <Instagram className="h-6 w-6" />
                        </a>
                    </div>
                    <div className="mt-5 border-t border-gray-700 pt-8 ">
                        <p className="text-base text-gray-400 text-center ">
                            &copy; 2025 MOTO.Tous droits réservés.
                        </p>
                    </div>
                </div> */}
            </footer>
        </div>
    )
}

export default Footer
