import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Navbar/Header';
import profileIcon from "/images/profileIcon.webp"
import { CiHome } from 'react-icons/ci';
import { TbBorderSides } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { RiShutDownLine } from 'react-icons/ri';
import { useCart } from "../content/CarteContent";
import { MdNotifications } from 'react-icons/md';

// ─── Types ────────────────────────────────────────────────────────────────────
type CommandeStatut = "en_cours" | "echoue" | "termine";

type Commande = {
    id: number;
    marque: string;
    model: string;
    prix: string;
    img_vehicule: string;
    transaction: string;
    type: string;
    statut: CommandeStatut;
    dateCommande: string; // ISO string
};

type NotificationItem = {
    id: number;
    destinataire: string;
    sujet: string;
    contenu: string;
    type: string;
    dateEnvoi: string; // ISO string
    luClient: boolean;
};

// ─── localStorage helpers ─────────────────────────────────────────────────────
const COMMANDES_KEY = "commandes_client";

const loadCommandes = (): Commande[] => {
    try {
        const raw = localStorage.getItem(COMMANDES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveCommandes = (commandes: Commande[]) => {
    localStorage.setItem(COMMANDES_KEY, JSON.stringify(commandes));
};

// ─── Notifications client (composant à part, hors du render de Account) ──────
const ClientNotifications = ({ clientEmail }: { clientEmail: string }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [open, setOpen] = useState(false);
    const [loadingNotif, setLoadingNotif] = useState(false);

    useEffect(() => {
        if (!clientEmail) return;
        setLoadingNotif(true);
        axios
            .get<NotificationItem[]>(`http://localhost:8080/api/notifications/client/${clientEmail}`)
            .then(res => setNotifications(res.data))
            .catch(() => setNotifications([]))
            .finally(() => setLoadingNotif(false));
    }, [clientEmail]);

    const nonLues = notifications.filter(n => !n.luClient).length;

    const ouvrir = () => {
        setOpen(!open);
        if (!open) {
            // marquer comme lu à l'ouverture
            notifications.forEach(n => {
                if (!n.luClient) {
                    axios.put(`http://localhost:8080/api/notifications/client/${n.id}/lu`).catch(() => {});
                }
            });
            setNotifications(prev => prev.map(n => ({ ...n, luClient: true })));
        }
    };

    return (
        <div className="relative inline-block">
            <button onClick={ouvrir} className="relative" type="button">
                <MdNotifications size={26} className="text-white" />
                {nonLues > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                        {nonLues}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border max-h-96 overflow-y-auto z-50 text-black">
                    {loadingNotif ? (
                        <p className="p-3 text-sm text-gray-500">Chargement...</p>
                    ) : notifications.length === 0 ? (
                        <p className="p-3 text-sm text-gray-500">Aucun message</p>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className="p-3 border-b">
                                <p className="font-semibold text-sm text-gray-800">{n.sujet}</p>
                                <p className="text-xs text-gray-600 mt-1">{n.contenu}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(n.dateEnvoi).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const Account = () => {
    const [image, setImage] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cart, removeFromCart, clearCart } = useCart();
    const [commandes, setCommandes] = useState<Commande[]>(loadCommandes);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prenom: '', nom: '', genre: '', phone: '', email: '', adresse: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ─── Vérifier les commandes expirées (72h) au montage et chaque minute ───
    useEffect(() => {
        const checkExpiration = () => {
            const now = Date.now();
            const heures72 = 72 * 60 * 60 * 1000;
            const updated = loadCommandes().map((cmd) => {
                const age = now - new Date(cmd.dateCommande).getTime();
                if (cmd.statut === "en_cours" && age > heures72) {
                    return { ...cmd, statut: "echoue" as CommandeStatut };
                }
                return cmd;
            });
            saveCommandes(updated);
            setCommandes(updated);
        };

        checkExpiration(); // vérification immédiate
        const interval = setInterval(checkExpiration, 60 * 1000); // chaque minute
        return () => clearInterval(interval);
    }, []);

    // ─── Commander depuis le panier → passe en "en_cours" + vide le favoris ──
    const commanderDepuisFavoris = (item: any) => {
        const dejaCommande = commandes.find(c => c.id === item.id && c.statut === "en_cours");
        if (dejaCommande) {
            alert(`${item.marque} ${item.model} est déjà en cours de commande.`);
            return;
        }

        const nouvelleCommande: Commande = {
            id: item.id,
            marque: item.marque,
            model: item.model,
            prix: item.prix,
            img_vehicule: item.img_vehicule,
            transaction: item.transaction,
            type: item.type || "voitures",
            statut: "en_cours",
            dateCommande: new Date().toISOString(),
        };

        const updated = [...commandes, nouvelleCommande];
        saveCommandes(updated);
        setCommandes(updated);

        // Retirer du panier/favoris
        removeFromCart(item.id);

        // Naviguer vers l'onglet commandes
        setActiveMenu("commande");
    };

    // ─── Finaliser → aller sur la page Commander ──────────────────────────────
    const finaliserCommande = (cmd: Commande) => {
        navigate(
            `/commander/${cmd.type}/${cmd.marque}/${cmd.model}/${cmd.id}`,
            { state: { image: cmd.img_vehicule } }
        );
    };

    // ─── Retirer une commande ─────────────────────────────────────────────────
    const retirerCommande = (id: number, dateCommande: string) => {
        const updated = commandes.filter(c => !(c.id === id && c.dateCommande === dateCommande));
        saveCommandes(updated);
        setCommandes(updated);
    };

    // ─── Profile ──────────────────────────────────────────────────────────────
    const Profile = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            const clientSauvegarde = localStorage.getItem("client");
            if (clientSauvegarde) {
                const userLocal = JSON.parse(clientSauvegarde);
                setFormData({
                    prenom: userLocal.prenom || '',
                    nom: userLocal.nom || '',
                    email: userLocal.email || '',
                    phone: userLocal.telephone || '',
                    adresse: userLocal.address || '',
                    genre: userLocal.genre || ''
                });
            }

            const res = await axios.get(
                "http://localhost:8080/auth/user/profile",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const user = res.data;
            setFormData({
                prenom: user.prenom || '',
                nom: user.nom || '',
                email: user.email || '',
                phone: user.telephone || '',
                adresse: user.address || '',
                genre: user.genre || ''
            });
            localStorage.setItem("client", JSON.stringify(user));
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.clear(); navigate("/login");
            } else {
                setError("Erreur lors du chargement du profil.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { Profile(); }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Veuillez sélectionner une image valide."); return; }
        setImage(URL.createObjectURL(file));
    };

    const handleLogout = () => { localStorage.clear(); navigate("/login"); };

    // ─── Helpers UI ───────────────────────────────────────────────────────────
    const statutBadge = (statut: CommandeStatut) => {
        if (statut === "en_cours") return (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-900 text-blue-300">🕐 En cours</span>
        );
        if (statut === "echoue") return (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-900 text-red-300">❌ Échoué</span>
        );
        return (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-900 text-green-300">✅ Terminé</span>
        );
    };

    const tempsRestant = (dateISO: string) => {
        const expiration = new Date(dateISO).getTime() + 72 * 60 * 60 * 1000;
        const reste = expiration - Date.now();
        if (reste <= 0) return "Expiré";
        const h = Math.floor(reste / (1000 * 60 * 60));
        const m = Math.floor((reste % (1000 * 60 * 60)) / (1000 * 60));
        return `${h}h ${m}min restantes`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-white text-xl animate-pulse">Chargement du profil...</div>
            </div>
        );
    }

    return (
        <div className=''>
            <Header />
            <div className='bg-black h-15'></div>
            <div className='w-full flex flex-row text-black'>

                {/* ── Sidebar ── */}
                <div className='w-1/5 min-h-screen bg-black p-2 text-white flex flex-col'>
                    <div className='flex flex-row items-center gap-2'>
                        <label className='cursor-pointer'>
                            <input type="file" accept="image/*" onChange={handleImageChange} className='hidden' />
                            <img src={image || profileIcon} alt="admin" className='border border-white w-9 h-9 rounded-full object-cover' />
                        </label>
                        <p className='uppercase text-xs'>{formData.nom || "Nom"} {formData.prenom || "Prénom"}</p>
                    </div>

                    <div className="mt-4 w-full flex justify-center">
                        <ul className="flex flex-col gap-1 w-full">
                            {[
                                { icon: <CiHome />, label: "Profile", menu: "profile" },
                                {
                                    icon: <TbBorderSides />,
                                    label: `Commandes${commandes.filter(c => c.statut === "en_cours").length > 0
                                        ? ` (${commandes.filter(c => c.statut === "en_cours").length})`
                                        : ""}`,
                                    menu: "commande"
                                },
                                { icon: <IoMdNotificationsOutline />, label: "Notifications", menu: "notif" },
                                {
                                    icon: <MdFavoriteBorder />,
                                    label: `Favoris${cart.length > 0 ? ` (${cart.length})` : ""}`,
                                    menu: "favos"
                                },
                                { icon: <RiShutDownLine />, label: "Déconnecter", menu: "logout" }
                            ].map(({ icon, label, menu }) => (
                                <li key={menu}>
                                    <button
                                        className={`flex items-center gap-3 w-full px-4 py-4 text-sm rounded-lg transition ${activeMenu === menu ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                                        onClick={() => setActiveMenu(menu)}
                                    >
                                        {icon} {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className='w-4/5 min-h-screen bg-gray-900 p-4 text-white'>

                    {/* PROFILE */}
                    {activeMenu === "profile" && (
                        <div>
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-2">{error}</div>}
                            <form onSubmit={(e) => { e.preventDefault(); Profile(); }}>
                                <div className='w-150 m-2 p-2 flex flex-col pl-5 gap-4'>
                                    <div className='flex flex-row text-gray-100'>
                                        <div className='flex flex-col m-1'>
                                            <label htmlFor="prenom" className='font-serif text-gray-500'>Prénom</label>
                                            <input type="text" name="prenom" id="prenom" placeholder='prenom...' value={formData.prenom} onChange={handleInputChange} className='border rounded-xl border-gray-800 w-70 p-2' />
                                        </div>
                                        <div className='flex flex-col m-1'>
                                            <label htmlFor="nom" className='font-serif text-gray-500'>Nom</label>
                                            <input type="text" name="nom" id="nom" value={formData.nom} placeholder='Nom...' onChange={handleInputChange} className='border rounded-xl border-gray-800 w-70 p-2' />
                                        </div>
                                    </div>
                                    <div className='flex flex-row'>
                                        <div className='flex flex-col m-1'>
                                            <label htmlFor="phone" className='font-serif text-gray-500'>Téléphone</label>
                                            <input type="tel" name="phone" id="phone" placeholder='+212 6XXXXXXXX' value={formData.phone} onChange={handleInputChange} className='border rounded-xl border-gray-800 w-70 p-2' />
                                        </div>
                                        <div className='flex flex-col m-1'>
                                            <label htmlFor="genre" className='font-serif text-gray-500'>Genre</label>
                                            <input type="text" name="genre" id="genre" placeholder='Genre' value={formData.genre} onChange={handleInputChange} className='border rounded-xl border-gray-800 w-70 p-2' />
                                        </div>
                                    </div>
                                </div>
                                <div className='rounded-xl w-200 m-2 p-2 flex flex-col pl-5'>
                                    <label htmlFor="adresse" className='font-serif text-gray-500'>Adresse</label>
                                    <input type="text" name="adresse" id="adresse" value={formData.adresse} onChange={handleInputChange} className='border rounded-xl border-gray-800 w-143 p-2' placeholder='Adresse' />
                                </div>
                                <div className='rounded-xl w-200 m-2 p-2 flex flex-col pl-5'>
                                    <p className='font-serif text-gray-500'>Email:</p>
                                    <p className='border rounded-xl border-gray-800 w-143 p-2 text-gray-400'>{formData.email || "email@example.com"}</p>
                                </div>
                                <div className='rounded-xl w-150 m-2 p-2 pl-5 flex flex-row gap-4'>
                                    <button type="submit" disabled={loading} className='bg-gray-600 p-2 rounded-xl text-white hover:bg-gray-700 disabled:opacity-50'>
                                        {loading ? 'Chargement...' : 'Enregistrer'}
                                    </button>
                                    <button type="button" className="font-semibold bg-gray-800 text-white rounded-xl px-7">Edit</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* COMMANDES */}
                    {activeMenu === "commande" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Mes Commandes
                                {commandes.filter(c => c.statut === "en_cours").length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-900 text-blue-300">
                                        {commandes.filter(c => c.statut === "en_cours").length} en cours
                                    </span>
                                )}
                            </h2>

                            {commandes.length === 0 ? (
                                <p className="text-gray-400 text-center mt-10">Aucune commande pour le moment.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {commandes.map((cmd) => (
                                        <div
                                            key={`${cmd.id}-${cmd.dateCommande}`}
                                            className={`flex flex-row items-center gap-4 p-3 rounded-xl border ${cmd.statut === "en_cours" ? "bg-gray-800 border-blue-800"
                                                    : cmd.statut === "echoue" ? "bg-gray-800 border-red-800 opacity-70"
                                                        : "bg-gray-800 border-green-800"
                                                }`}
                                        >
                                            <img src={cmd.img_vehicule} alt={cmd.marque} width={120} height={80} className="rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{cmd.marque} {cmd.model}</p>
                                                <p className="text-xs text-gray-400 capitalize">{cmd.transaction}</p>
                                                <p className="text-red-400 font-extrabold mt-1">{cmd.prix}</p>
                                                <div className="mt-2 flex items-center gap-3 flex-wrap">
                                                    {statutBadge(cmd.statut)}
                                                    {cmd.statut === "en_cours" && (
                                                        <span className="text-xs text-yellow-400">⏳ {tempsRestant(cmd.dateCommande)}</span>
                                                    )}
                                                    {cmd.statut === "echoue" && (
                                                        <span className="text-xs text-red-400">Commande expirée après 72h — véhicule retourné au catalogue</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {cmd.statut === "en_cours" && (
                                                    <button
                                                        className="bg-blue-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                                        onClick={() => finaliserCommande(cmd)}
                                                    >
                                                        Finaliser
                                                    </button>
                                                )}
                                                <button
                                                    className="bg-gray-700 text-red-400 px-3 py-1 rounded-lg text-sm hover:bg-red-800 hover:text-white transition-colors"
                                                    onClick={() => retirerCommande(cmd.id, cmd.dateCommande)}
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeMenu === "notif" && (
                        <div>
                            <h1 className="text-center text-xl font-semibold underline decoration-gray-200">Notifications</h1>
                            <div className="flex justify-center mt-4">
                                <ClientNotifications clientEmail={formData.email} />
                            </div>
                        </div>
                    )}

                    {/* FAVORIS / PANIER */}
                    {activeMenu === "favos" && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Mon Panier ({cart.length})</h2>
                                {cart.length > 0 && (
                                    <button onClick={clearCart} className="text-red-400 text-sm hover:underline">Vider le panier</button>
                                )}
                            </div>

                            {cart.length === 0 ? (
                                <p className="text-gray-400 text-center mt-10">Votre panier est vide.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {cart.map((item) => {
                                        const ajouteLe = (item as any).ajouteLe;
                                        const expiration = ajouteLe ? new Date(ajouteLe).getTime() + 72 * 60 * 60 * 1000 : null;
                                        const expire = expiration ? Date.now() > expiration : false;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`flex flex-row items-center gap-4 p-3 rounded-xl ${expire ? "bg-gray-700 border border-red-700 opacity-60" : "bg-gray-800"}`}
                                            >
                                                <img src={item.img_vehicule} alt={item.marque} width={120} height={80} className="rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-lg">{item.marque} {item.model}</p>
                                                    <p className="text-xs text-gray-400">{item.transaction}</p>
                                                    <p className="text-red-400 font-extrabold mt-1">{item.prix}</p>
                                                    <p className="text-xs text-gray-500">Qté : {item.qty}</p>
                                                    {expire && (
                                                        <p className="text-xs text-red-400 mt-1">⚠️ Expiré après 72h — retourné au catalogue</p>
                                                    )}
                                                    {!expire && ajouteLe && (
                                                        <p className="text-xs text-yellow-400 mt-1">⏳ {tempsRestant(ajouteLe)}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {/*  Commander → statut "en_cours" + retire du panier + va dans Commandes */}
                                                    {!expire && (
                                                        <button
                                                            className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                                            onClick={() => commanderDepuisFavoris(item)}
                                                        >
                                                            Commander
                                                        </button>
                                                    )}
                                                    <button
                                                        className="bg-gray-700 text-red-400 px-3 py-1 rounded-lg text-sm hover:bg-red-800 hover:text-white transition-colors"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        Retirer
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between items-center border-t border-gray-600 pt-3 mt-2">
                                        <span className="text-gray-400">Total estimé</span>
                                        <span className="text-white font-extrabold text-xl">
                                            {cart.reduce((sum, i) => {
                                                const num = parseFloat(String(i.prix).replace(/[^0-9.]/g, ""));
                                                return sum + (isNaN(num) ? 0 : num * i.qty);
                                            }, 0).toLocaleString("fr-MA")} DH
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LOGOUT */}
                    {activeMenu === "logout" && (
                        <button type="button" onClick={handleLogout} className="font-semibold bg-red-400 text-white rounded-xl p-2 hover:bg-red-800">
                            Déconnecter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Account;