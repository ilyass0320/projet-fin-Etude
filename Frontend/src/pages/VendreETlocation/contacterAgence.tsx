import { use, useEffect, useState } from "react";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useLocation, useParams } from "react-router-dom";


export default function ContactAgence() {
    const { type, marque, model, id } = useParams<{ type: string; marque: string; model: string; id: string }>();
    const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const category = type === "voiture" ? "voiture" : type === "moto" ? "moto" : "velos";
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
    const location = useLocation();
    // ✅ Récupérer l'image passée depuis PageDetails
    const vehiculeImage = location.state?.image || null;
    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1800);
    };
    // ✅ Pré-remplir le message après montage du composant
    useEffect(() => {
        if (marque && model) {
            setForm(prev => ({
                ...prev,
                message: `Bonjour, je suis intéressé(e) par le ${marque} ${model}.`
            }));
        }
    }, [marque, model]);

    const inputClass =
        "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f5f0e8] text-sm font-light placeholder:text-white/50 outline-none transition-all duration-200 focus:border-gray-500 focus:bg-gray-900 focus:ring-2 focus:ring-[#d4a373]/10";

    const labelClass = "block text-[0.9rem] font-medium uppercase tracking-widest text-gray-400 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Background orbs */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full bg-gray-800 -top-24 -right-24 pointer-events-none"
                style={{ filter: "blur(80px)" }}

            />
            <div
                className="absolute w-[400px] h-[400px] rounded-full bg-gray-800 -bottom-20 -left-20 pointer-events-none"
                style={{ filter: "blur(60px)" }}
            />

            <div className="w-full max-w-[70em] bg-gray-900 border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative">
                {/* Header */}
                <div className="px-8 pt-9 pb-7 border-b border-white/[0.06]">
                    <div className="w-10 h-[3px] bg-gray-700 rounded-full mb-4" />
                    <div className="flex flex-row gap-2 w-full">
                        <div className="w-1/2">
                            <h1
                                className="text-[1.85rem] font-bold text-[#f5f0e8] leading-tight mb-2"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Nous sommes ici pour vous aider.
                            </h1>
                            <p className="text-xl text-white/35 font-light leading-relaxed w-full mb-5">
                                Une question sur ce véhicule ? Notre équipe est disponible à tout moment pour vous accompagner.
                            </p>
                            <a
                                href="tel:+212612345676"
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-700 border border-white/[0.50] text-white text-[1rem] opacity-70 font-bold tracking-wide transition-all duration-200"                    >
                                <MdOutlinePhoneInTalk size={20} />
                                +212 6 12 34 56 76
                            </a>
                        </div>
                        <div className="w-1/2">
                            {/* Récapitulatif du véhicule sélectionné */}
                            {marque && model && (
                                <div className="mt-4 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/60 h-40 flex flex-row items-center  w-full">
                                    <div className="w-2/3">
                                        <span className="text-white/30 uppercase tracking-widest text-xs">Véhicule sélectionné</span>
                                        <p className="text-white/70 text-ms capitalize">{type}</p>
                                        <p className="text-[#f5f0e8] font-semibold text-base mt-1">
                                            {marque} {model}
                                        </p>
                                    </div>
                                    <div className="w-1/3 h-30">{/* ✅ Afficher l'image si elle existe */}
                                        {vehiculeImage ? (
                                            <img
                                                src={vehiculeImage}
                                                alt={`${marque} ${model}`}
                                                className="w-full h-24 object-contain mt-1"
                                            />
                                        ) : "image non disponible"}</div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Body */}
                <div className="px-10 py-8">
                    {sent ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-gray-600"
                                style={{ boxShadow: "0 8px 24px rgba(47, 55, 168, 0.3)" }}
                            >
                                <FaCheck size={30} className="text-[#fffff]" />
                            </div>
                            <p
                                className="text-[1.3rem] text-[#f5f0e8] mb-1.5"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Message envoyé !
                            </p>
                            <p className="text-[0.82rem] text-white/35 font-light">
                                Nous vous répondrons dans les plus brefs délais.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Nom</label>
                                    <input className={inputClass} name="nom" placeholder="Votre nom" value={form.nom} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={labelClass}>Prénom</label>
                                    <input className={inputClass} name="prenom" placeholder="Votre prénom" value={form.prenom} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className={labelClass}>Email</label>
                                <input className={inputClass} name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} />
                            </div>

                            <div className="mb-4">
                                <label className={labelClass}>Téléphone</label>
                                <input className={inputClass} name="telephone" placeholder="+212 6 XX XX XX XX" value={form.telephone} onChange={handleChange} />
                            </div>

                            <div className="mb-5">
                                <label className={labelClass}>Message</label>
                                <textarea
                                    className={`${inputClass} resize-none h-28 leading-relaxed`}
                                    name="message"
                                    placeholder="Votre message..."
                                    value={form.message}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl text-gray-400 bg-gray-700 text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Envoi en cours..." : "Envoyer le message →"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}





