import "./recuperer-mot-pass.css"
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import './login.css';
import { MdEmail } from "react-icons/md";
import show from '/images/car-tyre-ono.jpg?url';
import Headers from "../Navbar/Header";

const RecupererMotPass = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(
                "http://localhost:8080/auth/user/oublierMotPass",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erreur lors de l'envoi");
            }

            setMessage("✅ Email de récupération envoyé ! Vérifiez votre boîte mail.");
            setTimeout(() => navigate('/login'), 3000);

        } catch (err: any) {
            setError(err.message || "Erreur lors de l'envoi de l'email de récupération");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='w-full h-15 bg-black'>
                <Headers />
            </div>
            <div className="flex flex-row justify-center items-center text-white max-w-screen overflow-hidden">
                <img src={show} alt="" className="relative min-w-screen h-[560px] brightness-45" />
                <div className="absolute p-5 rounded-xl w-full max-w-[480px] bg-slate-900/30 backdrop-blur-xl">
                    <h1 className="text-white font-bold overline underline-offset-2 decoration-3 decoration-white pb-4">
                        Récupérer Mot de passe
                    </h1>

                    {/* ✅ Messages de retour */}
                    {message && (
                        <p className="text-green-400 text-sm mb-3 bg-green-900/30 p-2 rounded-md">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded-md">
                            {error}
                        </p>
                    )}

                    {/* ✅ onSubmit ajouté */}
                    <form onSubmit={handleSubmit} className="flex flex-col w-[400px]">
                        <label htmlFor="email" className="text-gray-500">Email</label>
                        <div className="flex flex-row items-center gap-2 mb-3 p-1">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="text-white border border-black w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="abcd@gmail.com"
                                required
                            />
                            <MdEmail />
                        </div>

                        {/* ✅ Bouton natif avec état loading */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-[400px] bg-gray-900 rounded-xl py-1 cursor-pointer transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                        >
                            {loading ? "Envoi en cours..." : "Envoyer"}
                        </button>
                    </form>

                    <div className="flex flex-col mt-3">
                        <div className="flex flex-row gap-1">
                            <p>Vous n'avez pas de Compte?</p>
                            <Link to="/SignUp" className="text-gray-400 underline">
                                S'inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecupererMotPass