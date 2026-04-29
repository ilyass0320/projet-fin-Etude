import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import './login.css';
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import show from '/public/images/thumb_400.jpg';
import Headers from "../Navbar/Header";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [connecter, setConnecter] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleUserLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');
        setConnecter(true);

        try {
            const response = await fetch(
                "http://localhost:8080/auth/user/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                setErrors(errorText || "Email ou mot de passe incorrect");
                setConnecter(false);
                return;
            }

            const data = await response.json();
            console.log("=== Réponse login ===", data);

            // ✅ Sauvegarder token et infos client
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("clientId", data.client?.id_client || data.client?.id || '');
            localStorage.setItem("client", JSON.stringify(data.client)); // ✅ data.client

            navigate('/profile');

        } catch (error) {
            console.error("Erreur login :", error);
            setErrors("Erreur de connexion. Vérifiez votre email et mot de passe.");
            setConnecter(false);
        }
    };

    useEffect(() => {
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
    }, []);

    return (
        <div>
            <div className='w-full h-15 bg-black'>
                <Headers />
            </div>
            <div className="flex flex-row justify-center items-center text-white max-w-screen overflow-hidden">
                <img src={show} alt="" className="relative min-w-screen h-[570px] brightness-40" />
                <div className="absolute p-5 rounded-xl w-full max-w-[480px] bg-slate-900/30 backdrop-blur-xl">
                    <h1 className="text-white font-bold overline underline-offset-2 decoration-3 decoration-white">
                        Connection
                    </h1>
                    <p className="font-thin mb-5">
                        Connectez-vous pour retrouver vos Véhicules préférées
                    </p>

                    {errors && (
                        <div className="bg-red-500 text-white p-2 rounded mb-3">
                            {errors}
                        </div>
                    )}

                    <form onSubmit={handleUserLogin} className="flex flex-col w-[400px]">
                        <label htmlFor="Email" className="text-gray-600">Email</label>
                        <div className="flex flex-row p-1">
                            <input
                                type="email"
                                name="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="text-white border border-black mb-3 w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="abcd@gmail.com"
                                required
                            />
                            <AiOutlineMail />
                        </div>

                        <label htmlFor="Password" className="text-gray-600">Mot de passe</label>
                        <div className="flex flex-row p-1">
                            <input
                                type="password"
                                name="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="text-white border border-black mb-3 w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="********"
                                required
                            />
                            <RiLockPasswordLine />
                        </div>

                        <Link
                            to="/recuperer_mot_pass"
                            className="text-center underline decoration-black underline-offset-2 text-gray-200"
                        >
                            Mot de passe oublié?
                        </Link>

                        <button
                            type="submit"
                            disabled={connecter}
                            className="text-white bg-gray-900 rounded-xl flex justify-center items-center p-2 mt-3 hover:bg-gray-700 disabled:bg-gray-400"
                        >
                            {connecter ? 'Connexion en cours...' : 'Se connecter'}
                            <CiLogin className="size-6 ml-2" />
                        </button>
                    </form>

                    <div className="flex flex-col mt-4">
                        <div className="flex flex-row gap-1">
                            <p>Vous n'avez pas de compte?</p>
                            <Link to="/SignUp" className="text-gray-400 underline">
                                s'inscrire
                            </Link>
                        </div>
                        <Link
                            to="/"
                            className="text-gray-400 text-center underline text-decoration-underline"
                        >
                            retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;