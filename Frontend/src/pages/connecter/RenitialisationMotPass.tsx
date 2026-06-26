import show from '/images/car-tyre-ono.jpg?url';
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from 'react-icons/ri';

const RenitialisationMotPass = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // ✅ Récupérer le token depuis l'URL (?token=...)
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get("token");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // ✅ Vérification des mots de passe
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!resetToken) {
            setError("Token de réinitialisation manquant ou invalide.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/auth/user/renitialisationMotPass",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token: resetToken,
                        email,
                        password,
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erreur backend:", errorText);
                setError(errorText || "Erreur lors de la réinitialisation.");
                return;
            }

            setMessage("✅ Mot de passe réinitialisé avec succès !");
            setTimeout(() => navigate('/login'), 2000);

        } catch (error) {
            console.error("Erreur réseau :", error);
            setError("Erreur réseau. Vérifiez votre connexion.");
        }
    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center text-white">
                <img src={show} alt="" className="relative min-w-screen h-[560px] brightness-45" />
                <div className="absolute p-5 rounded-xl w-full max-w-[480px] bg-slate-900/30 backdrop-blur-xl ">
                    <h1 className="text-white font-bold overline underline-offset-2 decoration-3 decoration-white pb-4">
                        Renitialisation Mot de passe
                    </h1>

                    {/* ✅ onSubmit ajouté ici */}
                    <form onSubmit={handleSubmit} className="flex flex-col w-[400px]">
                        <label htmlFor="Email" className="text-gray-500">Email</label>
                        <div className="flex flex-row justify-between mb-3 p-1">
                            <input type="email" name="Email" value={email} onChange={e => setEmail(e.target.value)}
                                className="text-white border border-black mb-3 w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="abcd@gmail.com" required />
                            <MdEmail />
                        </div>

                        <label htmlFor="Password" className="text-gray-500">Nouveau Mot de passe</label>
                        <div className="flex flex-row justify-between mb-3 p-1">
                            <input type="password" name="Password" value={password} onChange={e => setPassword(e.target.value)}
                                className="text-white border border-black mb-3 w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="Mot de passe" required />
                            <RiLockPasswordFill />
                        </div>

                        <label htmlFor="ConfirmPassword" className="text-gray-500">Confirmer le Mot de passe</label>
                        <div className="flex flex-row justify-between mb-3 p-1">
                            <input type="password" name="ConfirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                className="text-white border border-black mb-3 w-[400px] h-8 rounded-md p-1 px-2"
                                placeholder="Confirmer le mot de passe" required />
                            <RiLockPasswordFill />
                        </div>

                        {/* ✅ Affichage des erreurs et succès */}
                        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                        {message && <p className="text-green-400 text-sm mb-2">{message}</p>}

                        <button type="submit" className="pr-3 cursor-pointer px-2 w-[400px] bg-gray-900 rounded-xl py-1">
                            Envoyer
                        </button>
                    </form>

                    <div className="flex flex-col mt-3">
                        <div className="flex flex-row gap-1">
                            <p>Vous n'avez pas de Compte?</p>
                            <Link to="/SignUp" className="text-gray-400 underline">s'inscrire</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RenitialisationMotPass