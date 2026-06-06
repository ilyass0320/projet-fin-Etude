import { FaArrowLeft, FaRobot } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

type Message = {
    id: number;
    text: string;
    from: "bot" | "user";
    time: string;
};

function getTime() {
    return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Fetch marques depuis la BDD ──────────────────────────────────────────────
async function fetchMarques(): Promise<string> {
    try {
        const res = await fetch("/api/marques"); // ← adapte l'URL si besoin
        const data = await res.json();
        // Adapte selon ta structure : data est un tableau d'objets ou de strings
        const noms: string[] = data.map((m: { nom?: string; name?: string; marque?: string }) =>
            m.nom ?? m.name ?? m.marque ?? String(m)
        );
        return `Voici toutes les marques disponibles dans notre catalogue :\n${noms.map((n) => `• ${n}`).join("\n")}`;
    } catch {
        return "Impossible de récupérer les marques pour le moment. Veuillez réessayer plus tard.";
    }
}

// ─── Réponses statiques par mots-clés ─────────────────────────────────────────
const responses: { keywords: string[]; answer: string }[] = [
    {
        keywords: ["batterie", "décharge", "ne démarre pas", "démarrage", "démarrer"],
        answer: "Un problème de démarrage est souvent lié à la batterie. Vérifiez sa tension (doit être ≥ 12.4V) et les bornes pour tout signe de corrosion. Si elle a plus de 4 ans, envisagez de la remplacer.",
    },
    {
        keywords: ["huile", "vidange", "niveau d'huile", "fuite huile", "fuite d'huile"],
        answer: "Pour la vidange, respectez les intervalles indiqués dans votre carnet (généralement tous les 10 000 à 15 000 km). Utilisez une huile conforme aux spécifications du constructeur (ex : 5W-40).",
    },
    {
        keywords: ["pneu", "pression", "crevé", "crevaison", "usure", "roue"],
        answer: "La pression recommandée se trouve dans le manuel ou sur l'autocollant à l'intérieur de la portière conducteur. Contrôlez-la à froid tous les mois et avant les longs trajets.",
    },
    {
        keywords: ["frein", "freinage", "disque", "plaquette", "grincement"],
        answer: "Si vous entendez un grincement ou ressentez des vibrations au freinage, cela indique probablement des plaquettes ou disques usés. Faites contrôler rapidement — c'est une question de sécurité.",
    },
    {
        keywords: ["climatisation", "clim", "chauffage", "température", "ventilation"],
        answer: "Si la climatisation ne refroidit plus, le circuit de gaz réfrigérant est peut-être à recharger (à faire chez un garagiste agréé tous les 2-3 ans environ).",
    },
    {
        keywords: ["voyant", "témoin", "tableau de bord", "lumière", "orange", "rouge"],
        answer: "Quel voyant s'allume ? Moteur (orange/rouge), pression huile, batterie ? Décrivez sa couleur et sa forme pour que je puisse vous guider précisément.",
    },
    {
        keywords: ["révision", "entretien", "contrôle technique", "ct", "maintenance"],
        answer: "Le contrôle technique est obligatoire tous les 2 ans en France. La révision dépend du constructeur — consultez votre carnet d'entretien pour les intervalles recommandés.",
    },
    {
        keywords: ["moteur", "bruit moteur", "claquement", "fumée", "surchauffe", "chauffe"],
        answer: "Un bruit anormal ou une surchauffe du moteur nécessite une attention immédiate. Coupez le moteur et attendez qu'il refroidisse. Ne roulez pas si le témoin de température est dans le rouge.",
    },
    {
        keywords: ["boîte de vitesse", "embrayage", "vitesse", "levier", "patine"],
        answer: "Un embrayage qui patine ou un levier de vitesse dur à passer sont des signes d'usure. L'embrayage se remplace généralement entre 100 000 et 150 000 km selon l'utilisation.",
    },
    {
        keywords: ["carburant", "essence", "diesel", "gasoil", "réservoir", "consommation"],
        answer: "Une consommation excessive de carburant peut indiquer un filtre à air encrassé, des injecteurs usés ou un problème de pression des pneus. Vérifiez ces points en premier.",
    },
    {
        keywords: ["suspension", "amortisseur", "ressort", "cahotement", "rebond"],
        answer: "Si votre voiture rebondit excessivement ou si vous entendez des bruits de choc dans les virages, vos amortisseurs sont probablement usés. À vérifier impérativement pour votre sécurité.",
    },
    {
        keywords: ["bonjour", "salut", "bonsoir", "hello", "coucou"],
        answer: "Bonjour ! Je suis votre expert automobile. Décrivez-moi votre problème ou posez-moi une question sur votre véhicule, je suis là pour vous aider.",
    },
    {
        keywords: ["merci", "super", "parfait", "génial", "nickel"],
        answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur votre véhicule. Bonne route !",
    },
];

// ─── Mots-clés pour la demande de marques ─────────────────────────────────────
const marquesKeywords = ["marque", "les marques", "marques existantes", "quelles marques", "quelles sont les marques"];

// ─── getBotResponse devient async ─────────────────────────────────────────────
async function getBotResponse(userText: string): Promise<string> {
    const lower = userText.toLowerCase();

    // Cas spécial : demande de marques → fetch BDD
    if (marquesKeywords.some((kw) => lower.includes(kw))) {
        return await fetchMarques();
    }

    // Réponses statiques
    const match = responses.find((r) => r.keywords.some((kw) => lower.includes(kw)));
    return (
        match?.answer ??
        "Je comprends votre préoccupation. Pourriez-vous me donner plus de détails sur le problème rencontré ? (marque, modèle, kilométrage, symptômes précis)"
    );
}

// ─────────────────────────────────────────────────────────────────────────────

const initialMessages: Message[] = [
    {
        id: 1,
        text: "Bonjour ! Je suis votre assistant automobile. Comment puis-je vous aider aujourd'hui ?",
        from: "bot",
        time: getTime(),
    },
];

export default function ExpertPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // ← handleSend devient async
    const handleSend = async () => {
        const text = message.trim();
        if (!text) return;

        const userMsg: Message = { id: Date.now(), text, from: "user", time: getTime() };
        setMessages((prev) => [...prev, userMsg]);
        setMessage("");
        setIsTyping(true);

        // Attend la réponse (fetch BDD si besoin, sinon statique)
        const botText = await getBotResponse(text);

        setIsTyping(false);
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                text: botText,
                from: "bot",
                time: getTime(),
            },
        ]);
    };

    return (
        <div className="w-full h-screen flex flex-col" style={{ background: "#0a0d14" }}>

            {/* Header */}
            <div style={{ background: "#0f1117", borderBottom: "0.5px solid #1e2333" }}
                className="px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-400 hover:text-blue-300 transition p-1"
                >
                    <FaArrowLeft size={16} />
                </button>

                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}>
                    <FaRobot size={22} color="white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="font-medium text-sm text-slate-100 truncate">Expert Automobile</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <p className="text-xs text-slate-400">Disponible 24h/24 et 7j/7</p>
                    </div>
                </div>

                <button className="text-slate-500 hover:text-slate-400 transition p-1">
                    <BsThreeDotsVertical size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
                {messages.map((msg) =>
                    msg.from === "bot" ? (
                        <div key={msg.id} className="flex items-start gap-2 max-w-[85%]">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: "#0b204a" }}>
                                <FaRobot size={16} color="white" />
                            </div>
                            <div>
                                <div className="px-3 py-2.5 text-sm text-slate-200 leading-relaxed whitespace-pre-line"
                                    style={{ background: "#161b2e", border: "0.5px solid #1e2d4d", borderRadius: "4px 14px 14px 14px" }}>
                                    {msg.text}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 ml-1">{msg.time}</p>
                            </div>
                        </div>
                    ) : (
                        <div key={msg.id} className="flex justify-end">
                            <div>
                                <div className="px-3 py-2.5 text-sm text-white leading-relaxed"
                                    style={{ background: "#0f349c", borderRadius: "14px 4px 14px 14px" }}>
                                    {msg.text}
                                </div>
                                <p className="text-[10px] text-green-500 mt-1 mr-1 text-right">{msg.time} ✓✓</p>
                            </div>
                        </div>
                    )
                )}

                {isTyping && (
                    <div className="flex items-start gap-2 max-w-[85%]">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "#1d3461" }}>
                            <FaRobot size={22} color="white" />
                        </div>
                        <div className="px-4 py-3 flex gap-1 items-center"
                            style={{ background: "#161b2e", border: "0.5px solid #1e2d4d", borderRadius: "4px 14px 14px 14px" }}>
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                    style={{ animation: `pulse 1s ease-in-out ${delay}s infinite` }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ background: "#0f1117", borderTop: "0.5px solid #1e2333" }} className="px-3 py-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: "#161b2e", border: "0.5px solid #1e2d4d" }}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Écrire votre message..."
                        className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
                        style={{ background: message.trim() ? "#0731a4" : "#1e2333" }}
                    >
                        <IoSend size={15} className="text-white ml-0.5" />
                    </button>
                </div>
            </div>

        </div>
    );
}