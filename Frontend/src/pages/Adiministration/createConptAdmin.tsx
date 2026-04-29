import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imag from "/images/RoueBlue.png";

const CreateConptAdmin = () => {
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [role] = useState("ADMIN");
    const [genre, setGenre] = useState('');
    const [address, setAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        if (token && isLoggedIn) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/auth/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, prenom, address, email, genre, telephone, password, role }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erreur lors de l'inscription.");
            }

            const data = await response.json();

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminId", data.admin?.id || '');
            localStorage.setItem("admin", JSON.stringify(data.admin));

            navigate("/admin/dashboard");

        } catch (err: any) {
            console.error("Erreur signup admin :", err);
            setError(err.message || "Erreur lors de la création du compte.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-500 min-h-screen w-full flex items-center justify-center py-10">

            <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-3xl p-8 w-full max-w-md shadow-2xl">

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <h2 className='text-xl font-extrabold text-blue-700'>Creation du compte admin</h2>
                </div>

                {/* En-tête */}
                <div className="text-center mb-6">
                    <p className="text-blue-400 text-sm mt-1 opacity-80">
                        Remplissez les informations ci-dessous
                    </p>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-300 border-opacity-50 text-white text-sm rounded-xl px-4 py-3 mb-4 text-center">
                        ⚠️ {error}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleRegister} className="flex flex-col gap-3">

                    {/* Grille 2 colonnes */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Nom", id: "nom", type: "text", value: nom, setter: setNom, placeholder: "Nom" },
                            { label: "Prénom", id: "prenom", type: "text", value: prenom, setter: setPrenom, placeholder: "Prénom" },
                            { label: "Genre", id: "genre", type: "text", value: genre, setter: setGenre, placeholder: "Homme / Femme" },
                            { label: "Email", id: "email", type: "email", value: email, setter: setEmail, placeholder: "admin@example.com" },
                            { label: "Téléphone", id: "telephone", type: "tel", value: telephone, setter: setTelephone, placeholder: "+212 6XXXXXXXX" },
                            { label: "Adresse", id: "address", type: "text", value: address, setter: setAddress, placeholder: "Votre adresse" },
                        ].map(({ label, id, type, value, setter, placeholder }) => (
                            <div key={id} className="flex flex-col gap-1">
                                <label htmlFor={id} className="text-blue-700 text-xs font-semibold opacity-90">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    id={id}
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                    placeholder={placeholder}
                                    required
                                    className="bg-blue-400 bg-opacity-20 border border-white border-opacity-40 rounded-xl p-2 text-white placeholder-blue-100 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Rôle lecture seule */}
                    <div className="flex flex-col gap-1">
                        <label className="text-blue-700 text-xs font-semibold opacity-90">Rôle</label>
                        <div className="bg-blue-400 bg-opacity-20 border border-white border-opacity-40 rounded-xl p-2 text-blue-200 text-sm font-bold text-center tracking-widest cursor-not-allowed">
                            {role}
                        </div>
                    </div>

                    {/* Mot de passe */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-blue-700 text-xs font-semibold opacity-90">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={6}
                            required
                            className="bg-blue-400 bg-opacity-20 border border-white border-opacity-40 rounded-xl p-2 text-white placeholder-blue-100 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition text-sm shadow-2xl"
                        />
                    </div>

                    {/* Lien login */}
                    <p className="text-blue-100 text-xs text-center opacity-80">
                        Déjà un compte ?{' '}
                        <Link to="/admin" className="text-white font-bold underline hover:opacity-70 transition">
                            Se connecter
                        </Link>
                    </p>

                    {/* Bouton soumettre */}
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
                                Création en cours...
                            </span>
                        ) : "Créer le compte"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateConptAdmin;