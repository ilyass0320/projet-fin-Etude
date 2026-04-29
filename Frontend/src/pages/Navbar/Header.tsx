import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaCartShopping, FaCodeCompare } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
// Import correct pour l'image dans le dossier public
import logo from "/images/MOTO.png"; // Supprimez /public/
import './Header.css';
import { useCart } from '../content/CarteContent';
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const navigate = useNavigate(); // Utilisez useNavigate au lieu de useRouter
    const location = useLocation();

    useEffect(() => {
        // S'assurer qu'on est côté client
        setIsClient(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const checkLoginStatus = () => {
            if (typeof window !== 'undefined') {
                try {
                    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
                    setIsLoggedIn(loginStatus);
                } catch (error) {
                    console.error('Erreur localStorage:', error);
                    setIsLoggedIn(false);
                }
            }
        };

        checkLoginStatus();
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCartClick = () => {
        if (!isClient) return;

        try {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";

            if (loginStatus) {
                navigate("/store");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error('Erreur:', error);
            navigate("/login");
        }
    };

    const handleLoginClick = () => {
        if (!isClient) return;

        if (isLoggedIn) {
            // Déconnexion
            try {
                localStorage.removeItem("isLoggedIn");
                setIsLoggedIn(false);
                navigate("/profile");
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        } else {
            navigate("/login");
        }
    };

    // Fonction pour vérifier si le lien est actif
    const isActiveLink = (path: string) => location.pathname === path;
    const { totalItems } = useCart();


    return (
        <div
            className={`fixed w-screen h-[60px] flex justify-between items-center px-6 transition-all duration-500 ${isScrolled
                ? "bg-black/90 backdrop-blur-md shadow-md"
                : "bg-transparent"
                } text-white z-50`}
            id="SliderSc"
        >
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
                <img
                    src={logo}
                    className="rounded-xl hover:scale-105 transition-transform duration-300"
                    alt="logo"
                    width={100}
                    height={50}
                />
            </Link>

            {/* Navigation */}
            <ul className="flex flex-row space-x-6 font-medium">
                <li>
                    <Link
                        to="/acheter-location"
                        className={`hover-underline  transition duration-300 ${isActiveLink('/acheter-location') ? 'underline decoration-2 decoration-gray-500 underline-offset-4 text-white/30' : ''}`}
                    >
                        Véhicules
                    </Link>
                </li>
                <li>
                    <Link
                        to="/comparaison"
                        className={`hover-underline transition duration-300 ${isActiveLink('/comparaison') ? 'underline decoration-2 decoration-gray-500 underline-offset-4 text-white/30' : ''}`}
                    >
                        Comparer
                    </Link>
                </li>
                <li>
                    <Link
                        to="/reprise"
                        className={`hover-underline transition duration-300 ${isActiveLink('/reprise') ? 'underline decoration-2 decoration-gray-500 underline-offset-4 text-white/30' : ''}`}
                    >
                        Reprise
                    </Link>
                </li>

                <li>
                    <Link
                        to="/assistance"
                        className={`hover-underline transition duration-300 ${isActiveLink('/assistance') ? 'underline decoration-2 decoration-gray-500 underline-offset-4 text-white/30' : ''}`}
                    >
                        Assistance
                    </Link>
                </li>
            </ul>

            {/* Actions */}
            <div className="flex items-center space-x-3">

                <button
                    onClick={handleCartClick}
                    className="relative p-2 rounded-full hoverStore transition-colors duration-300 group"
                    title="Panier"
                >
                    <FaCartShopping
                        size={20}
                        className="text-white w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                    />
                    {totalItems > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shadow-lg shadow-red-500/40 ring-2 ring-black/30">
                            {totalItems > 99 ? "99+" : totalItems}
                        </span>
                    )}
                </button>

                {/* Connexion/Déconnexion */}
                <button
                    onClick={handleLoginClick}
                    className={`border px-3 py-1 rounded-[10px] transition duration-300 ${isLoggedIn
                        ? "bg-gray-900 border-gray-900 logHover"
                        : "logHover1"
                        }`}
                    title={isLoggedIn ? "Se déconnecter" : "Se connecter"}
                >
                    {isLoggedIn ? "Déconnexion" : "Se connecter"}
                </button>

                {/* Compte utilisateur */}
                <Link
                    to={isLoggedIn ? "/profile" : "/login"}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                    title="Mon compte"
                >
                    <VscAccount size={30} />
                </Link>
            </div>
        </div>
    );
};

export default Header;
