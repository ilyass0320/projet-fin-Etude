import { useState, useEffect } from 'react';
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

const Account = () => {
    const [image, setImage] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        genre: '',
        phone: '',
        email: '',
        adresse: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const Profile = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            //Affichage immédiat depuis localStorage
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

            //Données fraîches depuis le backend
            const res = await axios.get(
                "http://localhost:8080/auth/user/profile",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            //Données fraîches depuis le backend
            const user = res.data;
            console.log("Profil reçu:", user);

            setFormData({
                prenom: user.prenom || '',
                nom: user.nom || '',
                email: user.email || '',
                phone: user.telephone || '',
                adresse: user.address || '',
                genre: user.genre || ''
            });

            // Mettre à jour localStorage
            localStorage.setItem("client", JSON.stringify(user));

        } catch (err: any) {
            console.error("Erreur profil:", err);
            console.error("Status:", err.response?.status);

            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.clear();
                navigate("/login");
            } else {
                setError("Erreur lors du chargement du profil.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Profile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Veuillez sélectionner une image valide.");
            return;
        }
        setImage(URL.createObjectURL(file));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-white text-xl animate-pulse">
                    Chargement du profil...
                </div>
            </div>
        );
    }

    return (
        <div className=''>
            <Header />
            <div className='bg-black h-15'></div>
            <div className=''>
                <div className='w-full flex flex-row text-black'>

                    {/* Sidebar */}
                    <div className='w-1/5 min-h-screen bg-black p-2 text-white flex flex-col'>
                        <div className=''>
                            <div className='flex flex-row items-center gap-2'>
                                <label className='cursor-pointer'>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className='hidden' />
                                    <img
                                        src={image || profileIcon}
                                        alt="admin"
                                        className='border border-white w-9 h-9 rounded-full object-cover'
                                    />
                                </label>
                                {/* Nom dynamique */}
                                <p className='uppercase text-xs'>
                                    {formData.nom || "Nom"} {formData.prenom || "Prénom"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 w-full flex justify-center">
                            <ul className="flex flex-col gap-1 w-full">
                                {[
                                    { icon: <CiHome />, label: "Profile", menu: "profile" },
                                    { icon: <TbBorderSides />, label: "Commandes", menu: "commande" },
                                    { icon: <IoMdNotificationsOutline />, label: "Notifications", menu: "notif" },
                                    { icon: <MdFavoriteBorder />, label: "Favoris", menu: "favos" },
                                    { icon: <RiShutDownLine />, label: "Déconnecter", menu: "logout" }
                                ].map(({ icon, label, menu }) => (
                                    <li key={menu}>
                                        <button
                                            className={`flex items-center gap-3 w-full px-4 py-4 text-sm rounded-lg transition ${activeMenu === menu ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'
                                                }`}
                                            onClick={() => setActiveMenu(menu)}
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='w-4/5 min-h-screen bg-gray-900 p-4 text-white'>

                        {activeMenu === "profile" && (
                            <div className=''>
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-2">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={(e) => { e.preventDefault(); Profile(); }}>
                                    <div className='w-150 m-2 p-2 flex flex-col pl-5 gap-4'>
                                        <div className='flex flex-row text-gray-100'>
                                            <div className='flex flex-col m-1 text-md'>
                                                <label htmlFor="prenom" className='font-serif text-gray-500'>Prénom</label>
                                                <input
                                                    type="text"
                                                    name="prenom"
                                                    id="prenom"
                                                    placeholder='prenom...'
                                                    value={formData.prenom}
                                                    onChange={handleInputChange}
                                                    className='border rounded-xl border-gray-800 w-70 p-2'
                                                />
                                            </div>
                                            <div className='flex flex-col m-1'>
                                                <label htmlFor="nom" className='font-serif text-gray-500 text-gray-200'>Nom</label>
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    id="nom"
                                                    value={formData.nom}
                                                    placeholder='Nom...'
                                                    onChange={handleInputChange}
                                                    className='border rounded-xl border-gray-800 w-70 p-2'
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-row'>
                                            <div className='flex flex-col m-1'>
                                                <label htmlFor="phone" className='font-serif text-gray-500'>Téléphone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder='+212 6XXXXXXXX'
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className='border rounded-xl border-gray-800 w-70 p-2'
                                                />
                                            </div>
                                            <div className='flex flex-col m-1'>
                                                <label htmlFor="genre" className='font-serif text-gray-500'>Genre</label>
                                                <input
                                                    type="text"
                                                    name="genre"
                                                    id="genre"
                                                    placeholder='Genre'
                                                    value={formData.genre}
                                                    onChange={handleInputChange}
                                                    className='border rounded-xl border-gray-800 w-70 p-2'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='rounded-xl w-200 m-2 p-2 flex flex-col pl-5'>
                                        <label htmlFor="adresse" className='font-serif text-gray-500'>Adresse</label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            id="adresse"
                                            value={formData.adresse}
                                            onChange={handleInputChange}
                                            className='border rounded-xl border-gray-800 w-143 p-2'
                                            placeholder='Adresse'
                                        />
                                    </div>

                                    <div className='rounded-xl w-200 m-2 p-2 flex flex-col pl-5'>
                                        <p className='font-serif text-gray-500'>Email:</p>
                                        {/* ✅ Email dynamique */}
                                        <p className='border rounded-xl border-gray-800 w-143 p-2 text-gray-400'>
                                            {formData.email || "email@example.com"}
                                        </p>
                                    </div>

                                    <div className='rounded-xl w-150 m-2 p-2 pl-5 flex flex-row gap-4'>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className='bg-gray-600 p-2 rounded-xl text-white hover:bg-gray-700 disabled:opacity-50'
                                        >
                                            {loading ? 'Chargement...' : 'Enregistrer'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="font-semibold bg-gray-800 text-white rounded-xl px-7"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeMenu === "commande" && (
                            <div>
                                <div className='mt-4'>
                                    <div className="overflow-x-auto rounded-xl">
                                        <table className='w-full border-collapse bg-gray-600 text-white text-center'>
                                            <thead className='bg-gray-900 text-white m-2'>
                                                <tr>
                                                    <th className='p-2'>Image</th>
                                                    <th className='p-2'>Description</th>
                                                    <th className='p-2'>Prix</th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='p-2'>
                                                        <img src={profileIcon} alt="" width={100} height={100} />
                                                    </td>
                                                    <td className='p-2'>2018 BMW X4 xDrive30i</td>
                                                    <td className='p-2 font-extrabold'>350,000 DH</td>
                                                    <td>
                                                        <button className='bg-gray-900 text-white p-2 m-2 rounded-xl hoverMod'>
                                                            Finaliser La commande
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className='bg-gray-700 text-white p-2 m-2 rounded-xl hoverSup'>
                                                            Retirer La commande
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMenu === "notif" && (
                            <div>
                                <h1 className="text-center text-xl font-semibold underline decoration-gray-200">
                                    Notifications
                                </h1>
                            </div>
                        )}

                        {activeMenu === "favos" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Mon Panier ({cart.length})</h2>
                                    {cart.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="text-red-400 text-sm hover:underline"
                                        >
                                            Vider le panier
                                        </button>
                                    )}
                                </div>

                                {cart.length === 0 ? (
                                    <p className="text-gray-400 text-center mt-10">Votre panier est vide.</p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-row items-center gap-4 bg-gray-800 p-3 rounded-xl"
                                            >
                                                <img
                                                    src={item.img_vehicule}
                                                    alt={item.marque}
                                                    width={120}
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-bold text-lg">{item.marque} {item.model}</p>
                                                    <p className="text-xs text-gray-400">{item.transaction}</p>
                                                    <p className="text-red-400 font-extrabold mt-1">{item.prix}</p>
                                                    <p className="text-xs text-gray-500">Qté : {item.qty}</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                                                        onClick={() => { }}
                                                    >
                                                        Commander
                                                    </button>
                                                    <button
                                                        className="bg-gray-700 text-red-400 px-3 py-1 rounded-lg text-sm hover:bg-red-800 hover:text-white"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        Retirer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-between items-center border-t border-gray-600 pt-3 mt-2">
                                            <span className="text-gray-400">Total estimé</span>
                                            <span className="text-white font-extrabold text-xl">
                                                {cart.reduce((sum, i) => {
                                                    const num = parseFloat(
                                                        String(i.prix).replace(/[^0-9.]/g, "")
                                                    );
                                                    return sum + (isNaN(num) ? 0 : num * i.qty);
                                                }, 0).toLocaleString("fr-MA")} DH
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeMenu === "logout" && (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="font-semibold bg-red-400 text-white rounded-xl p-2 hover:bg-red-800"
                            >
                                Déconnecter
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;