import { useEffect, useState } from 'react';
import imag from "/images/RoueBlue.png";
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Si déjà connecté → rediriger vers le dashboard
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        if (token && isLoggedIn) {
            navigate("/Admin");
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/auth/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Identifiants incorrects.");
            }

            const data = await response.json();
            console.log("=== Réponse login Admin ===", data);

            // Sauvegarder token et infos admin
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminId", data.admin?.id || '');
            localStorage.setItem("admin", JSON.stringify(data.admin));

            // Rediriger vers le dashboard
            navigate("/Admin");

        } catch (err: any) {
            console.error("Erreur login admin :", err);
            setError(err.message || "Erreur lors de la connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-500 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

            {/* Carte flip */}
            <div style={{ perspective: "1200px" }}>
                <div className="relative cursor-pointer transition-all duration-700" style={{ width: "420px", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",}}>
                    {/* ── FACE AVANT ── */}
                    <div className="w-full flex flex-col justify-center items-center" style={{ backfaceVisibility: "hidden" }}>
                        <img src={imag} alt="Logo" className="rounded-3xl m-3 w-full max-w-sm shadow-2xl"/>
                        <p className="text-white text-sm font-light mb-3 tracking-widest uppercase opacity-80">
                            Espace Administrateur
                        </p>
                        <button onClick={() => setIsFlipped(true)} type="button" className="bg-white text-blue-600 font-bold py-2 px-14 rounded-xl hover:bg-gray-100 transition duration-300 shadow-lg text-sm tracking-wide">
                            Se connecter
                        </button>
                    </div>
                    {/* ── FACE ARRIÈRE ── */}
                    <div className="absolute top-0 left-0 w-full flex flex-col justify-center items-center h-full" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)",}}>
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-3xl p-8 w-full shadow-2xl">
                            {/* En-tête */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-extrabold text-blue-700 tracking-wide">
                                    Connexion Admin
                                </h1>
                                <p className="text-blue-400 text-sm mt-1 opacity-80">
                                    Accédez à votre tableau de bord
                                </p>
                            </div>

                            {/* Message d'erreur */}
                            {error && (
                                <div className="bg-red-500 bg-opacity-20 border border-red-300 border-opacity-50 text-white text-sm rounded-xl px-4 py-3 mb-4 text-center">
                                    {error}
                                </div>
                            )}

                            {/* Formulaire */}
                            <form onSubmit={handleLogin} className="flex flex-col gap-4">

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="email" className="text-blue-700 text-sm font-semibold opacity-90">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        className="bg-blue-400 text-white bg-opacity-20 border border-white border-opacity-40 rounded-xl p-3 text-white placeholder-blue-100 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition text-sm"
                                        placeholder="admin@example.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="password" className="text-blue-700 text-sm font-semibold opacity-90">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        name="password"
                                        minLength={6}
                                        className="bg-blue-400 text-white bg-opacity-20 border border-white border-opacity-40 rounded-xl p-3 text-white placeholder-blue-100 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition text-sm"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <p className="text-blue-400 text-xs text-center opacity-80">
                                    Pas encore de compte ?{' '}
                                    <Link
                                        to="/createConptAdmin"
                                        className="text-blue-900 font-bold underline hover:opacity-70 transition"
                                    >
                                        S'inscrire
                                    </Link>
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition duration-300 shadow-lg text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Connexion...
                                        </span>
                                    ) : "Se connecter"}
                                </button>

                                <button
                                    onClick={() => { setIsFlipped(false); setError(null); }}
                                    type="button"
                                    className="w-full bg-transparent border-2 border-white border-opacity-60 text-white font-semibold py-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition duration-300 text-sm"
                                >
                                    ← Retour
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}