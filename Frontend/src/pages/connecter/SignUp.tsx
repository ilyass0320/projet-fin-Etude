import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './SignUp.css';
import show from '/public/images/thumb_400.jpg';
import Headers from '../Navbar/Header';

// Configuration de base d'axios
// axios.defaults.baseURL = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const SignUp = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [genre, setGenre] = useState('');
    const [adresse, setAdresse] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [connecter, setConnecter] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // useEffect pour vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const isSignedUp = localStorage.getItem('isSignUp');
        if (isSignedUp === 'true') {
            navigate('/login');
        }
    }, [navigate]);

    const handleUserSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/auth/user/Signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nom,
                        prenom,
                        phone,
                        email,
                        adresse,
                        genre,
                        password
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erreur backend:", errorText);
                throw new Error(errorText || "Erreur lors de l'inscription");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("clientId", data.client.id_client);
            localStorage.setItem("client", JSON.stringify(data))

            localStorage.setItem("isLoggedIn", "true");

            navigate("/login");

        } catch (error) {
            console.error("Erreur signup client :", error);
            alert("Erreur lors de la création du compte client");
        }
    };

    useEffect(() => {
        setIsAdmin(true);
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
        // ✅ Suppression des appels inutiles dans useEffect
    }, []);
    return (
        <div>
            <div className='w-full h-15 bg-black'>
                <Headers />
            </div>
            <div className='max-w-screen overflow-hidden'>
                <div className="flex flex-row justify-center items-center text-white">
                    <img src={show} alt="" className="relative min-w-screen h-[570px] brightness-40" />
                    <div className="absolute p-5 rounded-xl w-full max-w-[560px] bg-slate-900/30 backdrop-blur-xl ">
                        <h1 className="text-white font-bold overline underline-offset-2 decoration-3 decoration-white">Inscription</h1>
                        <p className="font-thin mb-5">Remplissez les informations suivantes</p>

                        <form onSubmit={handleUserSignUp} className="flex flex-col w-auto">
                            {errors && (
                                <div className="bg-red-500 text-white p-2 rounded mb-3">
                                    {errors}
                                </div>
                            )}

                            <div className="flex flex-row">
                                <div className="flex flex-col p-1">
                                    <label htmlFor="nom" className='text-gray-600'>Nom</label>
                                    <input
                                        type="text"
                                        value={nom}
                                        onChange={e => setNom(e.target.value)}
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        name="nom"
                                        required
                                        placeholder="Nom ..."
                                    />
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="prenom" className='text-gray-600'>Prénom</label>
                                    <input
                                        type="text"
                                        value={prenom}
                                        onChange={e => setPrenom(e.target.value)}
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        name="prenom"
                                        required
                                        placeholder="Prénom ..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="flex flex-col p-1">
                                    <label htmlFor="genre" className='text-gray-600'>Genre</label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={genre}
                                        onChange={e => setGenre(e.target.value)}
                                        id="genre"
                                        list="List_Gn"
                                        placeholder="Genre"
                                        required
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                    />
                                    <datalist id="List_Gn">
                                        <option value="Femme"></option>
                                        <option value="Homme"></option>
                                        <option value="Autre"></option>
                                    </datalist>
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="adresse" className='text-gray-600'>Adresse</label>
                                    <input
                                        type="text"
                                        value={adresse}
                                        onChange={e => setAdresse(e.target.value)}
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        required
                                        name="adresse"
                                        placeholder="Adresse ..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="flex flex-col p-1">
                                    <label htmlFor="phone" className='text-gray-600'>Numéro de téléphone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+212612345678"
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col p-1">
                                    <label htmlFor="email" className='text-gray-600'>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        name="email"
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        required
                                        placeholder="abcd@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <div className="flex flex-col p-1">
                                    <label htmlFor="pass" className='text-gray-600'>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        name="pass"
                                        id="pass"
                                        className="text-white border border-black mb-3 w-[250px] h-8 rounded-md p-1"
                                        required
                                        placeholder="********"
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={connecter}
                                className="text-white bg-gray-900 rounded-xl flex justify-center p-1 py-2   disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {connecter ? 'Enregistrement en cours...' : 'S\'inscrire'}
                            </button>
                        </form>

                        <div className="flex flex-col gap-2 mt-3">
                            <div className='flex flex-row'>
                                <p>Vous avez déjà un compte ?</p>
                                <Link to="/Login" className="text-gray-400 underline p-1 hover:text-white">Login</Link>
                            </div>
                            <Link to="/" className="text-gray-400 text-center underline hover:text-white">Retour à l'accueil</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;