import { useEffect, useState } from 'react'
import profileIcon from "/images/profileIcon.webp"
import "./animation.css"
import { Users, Car, BadgeDollarSign, ChartBarStacked, ArrowDownUp, LogOut } from 'lucide-react';
import axios from 'axios';
import { PiTruckFill } from "react-icons/pi";
import { GrUserWorker } from "react-icons/gr";
import { AiFillProduct } from "react-icons/ai";
import { PieChart, Pie, Tooltip, Label, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceDot } from 'recharts';
import { IoAnalyticsSharp, IoHome } from 'react-icons/io5';
import { TbBorderSides, TbTruckDelivery } from 'react-icons/tb';
import { FiSearch } from "react-icons/fi";
import { MdOutlinePayment } from 'react-icons/md';
import { CiHome } from 'react-icons/ci';
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdPeopleOutline } from "react-icons/md";
import { RiShutDownLine } from 'react-icons/ri';
import { MdOutlineInventory } from "react-icons/md";

export default function DashbordAdmin() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clients, setClients] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [admin, setAdmin] = useState<any>({});
    const [activeMenu, setActiveMenu] = useState<string>('statistiques');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientId, setClientId] = useState<number | null>(null);
    const [selectedCategorie, setSelectedCategorie] = useState<string>('');
    const [commandes, setCommandes] = useState<number | null>(0);

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        role: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [categorie, setCategorie] = useState({
        id: '',
        categorie: '',
        imageIcon: null as File | null,
    });

    const [newClient, setNewClient] = useState({
        nom: '',
        prenom: '',
        email: '',
        genre: '',
        telephone: '',
        password: '',
        adresse: '',
    });

    const [listCouleur, setListCouleur] = useState("");
    const [listImages, setListImages] = useState("");

    const [produit, setProduit] = useState({
        nomCategorie: selectedCategorie || categorie.categorie,
        id: '',
        marque: '',
        model: '',
        annee: '',
        couleur: '',
        prix: '',
        imageProduit: null as File | null,
    });

    const [produits, setProduits] = useState<any>([]);

    // ─── API CALLS ────────────────────────────────────────────────────────────

    const getToken = () => localStorage.getItem("adminToken");

    const getProfileAdmin = async () => {
        try {
            const token = getToken();
            if (!token) {
                window.location.href = '/admin/login';
                return;
            }

            // Affichage immédiat depuis localStorage
            const adminSauvegarde = localStorage.getItem("admin");
            if (adminSauvegarde) {
                const adminLocal = JSON.parse(adminSauvegarde);
                setFormData({
                    prenom: adminLocal.prenom || '',
                    nom: adminLocal.nom || '',
                    email: adminLocal.email || '',
                    telephone: adminLocal.telephone || '',
                    role: adminLocal.role || 'ADMIN',
                });
                setAdmin(adminLocal);
            }

            const response = await axios.get(
                'http://localhost:8080/auth/admin/profile',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const adminData = response.data;
            setAdmin(adminData);
            setFormData({
                prenom: adminData.prenom || '',
                nom: adminData.nom || '',
                email: adminData.email || '',
                telephone: adminData.telephone || '',
                role: adminData.role || 'ADMIN',
            });
            localStorage.setItem("admin", JSON.stringify(adminData));

        } catch (error: any) {
            console.error("Erreur profil:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.clear();
                window.location.href = '/admin/login';
            }
        }
    };

    const getAllClients = async () => {
        try {
            const token = getToken();
            const response = await axios.get(
                'http://localhost:8080/auth/admin/allClients',
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            );
            setClients(response.data.listClients || []);
        } catch (error: any) {
            console.error("Erreur:", error);
            setError("Erreur lors du chargement des clients");
            if (error.response?.status === 401) localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    const getAllProduits = async () => {
        try {
            const token = getToken();
            const response = await axios.get("http://localhost:8080/auth/produit/allProduits",
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            );
            setProduits(response.data.produitList || []);
        } catch (error: any) {
            console.error("Erreur:", error);
            setError("Erreur lors du chargement des produits");
        }
    };

    const getAllCategories = async () => {
        try {
            const token = getToken();
            const response = await axios.get(
                "http://localhost:8080/auth/categorie/AllCategories",
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            );
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("error", error);
        }
    };

    const handleAjouteProduit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            const produitData = {
                marque: produit.marque || "",
                model: produit.model || "",
                annee: produit.annee || null,
                prix: parseFloat(produit.prix.toString().replace(/\s/g, "")) || 0,
                couleur: produit.couleur || "",
                categories: selectedCategorie || categorie.categorie,
            };
            fd.append("produit", new Blob([JSON.stringify(produitData)], { type: "application/json" }));
            if (produit.imageProduit) fd.append("img", produit.imageProduit);

            await axios.post("http://localhost:8080/auth/produit/Ajouter", fd, {
                headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" },
                transformRequest: (data) => data,
            });
            await getAllCategories();
            alert('Produit ajouté avec succès !');
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du produit:", error);
        }
    };

    const handleAjouteCategorie = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("nomCategorie", categorie.categorie);
            if (categorie.imageIcon) fd.append("imageIcon", categorie.imageIcon);

            await axios.post('http://localhost:8080/auth/categorie/AjouterCateg', fd, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
            });
            await getAllCategories();
            alert('Categorie ajoutée avec succès !');
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du categorie:", error);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!newClient.nom || !newClient.prenom || !newClient.email || !newClient.telephone) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            await axios.post('http://localhost:8080/auth/user/Signup', newClient, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
            });
            setNewClient({ nom: '', prenom: '', email: '', genre: '', telephone: '', password: '', adresse: '' });
            await getAllClients();
            alert('Client ajouté avec succès !');
        } catch (error: any) {
            console.error("Erreur lors de l'ajout:", error);
            if (error.response?.status === 409) alert('Cet email existe déjà.');
            else alert("Erreur lors de l'ajout du client");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClient = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
        try {
            await axios.delete(`http://localhost:8080/auth/user/delete/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            getAllClients();
            alert('Client supprimé avec succès');
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Veuillez sélectionner une image valide."); return; }
        setImage(URL.createObjectURL(file));
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/admin/login';
    };

    useEffect(() => {
        getAllClients();
        getProfileAdmin();
        getAllCategories();
        getAllProduits();
    }, []);

    // ─── STATIC DATA ──────────────────────────────────────────────────────────

    const dataGraphe = [
        { name: 'Jan', sales: 4000 }, { name: 'Fév', sales: 3000 },
        { name: 'Mar', sales: 5000 }, { name: 'Avr', sales: 4500 },
        { name: 'Mai', sales: 6000 }, { name: 'Jun', sales: 5500 },
        { name: 'Jul', sales: 5500 }, { name: 'Aoû', sales: 4800 },
        { name: 'Sep', sales: 5200 }, { name: 'Oct', sales: 5700 },
        { name: 'Nov', sales: 6100 }, { name: 'Déc', sales: 6500 },
    ];

    // ─── SIDEBAR CONFIG (from AdminAccount) ───────────────────────────────────

    const sidebarItems = [
        { icon: <IoHome size={18} />, label: "Dashboard", menu: "statistiques" },
        { icon: <CiHome size={18} />, label: "Profile", menu: "profile" },
        { icon: <IoAnalyticsSharp size={18} />, label: "Statistiques", menu: "statistiques_alt" },
        { icon: <MdPeopleOutline size={18} />, label: "Clients", menu: "users" },
        { icon: <MdOutlineInventory size={18} />, label: "Produits", menu: "products" },
        { icon: <TbBorderSides size={18} />, label: "Commandes", menu: "commandes" },
        { icon: <MdOutlinePayment size={18} />, label: "Paiements", menu: "paiements" },
        { icon: <TbTruckDelivery size={18} />, label: "Livraisons", menu: "livraison" },
        { icon: <IoMdNotificationsOutline size={18} />, label: "Notifications", menu: "notif" },
        { icon: <RiShutDownLine size={18} />, label: "Déconnecter", menu: "logout" },
    ];

    // ─── RENDER ───────────────────────────────────────────────────────────────

    return (
        <div className="w-full flex flex-row text-black min-h-screen">
            <div className="w-1/5 min-h-screen bg-gray-950 p-3 text-white flex flex-col">
                <div className="flex flex-row items-center gap-2 mb-6 p-2">
                    <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <img
                            src={image || profileIcon}
                            alt="admin"
                            className="border-2 border-blue-500 w-10 h-10 rounded-full object-cover"
                        />
                    </label>
                    <div>
                        <p className="uppercase text-xs font-bold">
                            {formData.nom || "Nom"} {formData.prenom || "Prénom"}
                        </p>
                        <p className="text-blue-400 text-xs">{formData.role || "ADMIN"}</p>
                    </div>
                </div>


                <ul className="flex flex-col gap-1 w-full">
                    {sidebarItems.map(({ icon, label, menu }) => (
                        <li key={menu}>
                            <button
                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm rounded-lg transition
                                    ${activeMenu === menu
                                        ? 'bg-gray-700 text-white'
                                        : 'hover:bg-gray-800 text-gray-300'
                                    }`}
                                onClick={() => menu === 'logout' ? handleLogout() : setActiveMenu(menu)}
                            >
                                {icon}
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="w-4/5 min-h-screen bg-gray-900 p-6 text-white">

                {/* Top bar */}
                <div className="flex flex-row justify-between items-center mb-6">
                    <h1 className="uppercase font-extrabold text-lg tracking-widest text-white">Moto</h1>
                    <div className="flex flex-row items-center gap-3">
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="text"
                                className="border border-gray-600 bg-gray-800 text-white text-sm rounded-xl px-3 py-1 w-40"
                                placeholder="Rechercher..."
                            />
                            <FiSearch className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* ── STATISTIQUES ── */}
                {(activeMenu === "statistiques" || activeMenu === "statistiques_alt") && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-200">Tableau de Bord</h2>
                        <div className="flex flex-row gap-4 w-full mb-6">
                            {[
                                { label: "Clients", value: Array.isArray(clients) ? clients.length : 0, icon: <Users size={20} />, color: "text-red-400" },
                                { label: "Véhicules", value: Array.isArray(produits) ? produits.length : 0, icon: <Car size={20} />, color: "text-green-400" },
                                { label: "Commandes", value: 0, icon: <ArrowDownUp size={20} />, color: "text-blue-400" },
                                { label: "Paiements", value: "40 DH", icon: <BadgeDollarSign size={20} />, color: "text-yellow-400" },
                                { label: "Catégories", value: Array.isArray(categories) ? categories.length : 0, icon: <ChartBarStacked size={20} />, color: "text-purple-400" },
                            ].map(({ label, value, icon, color }) => (
                                <div key={label} className="flex flex-col border border-gray-700 rounded-xl bg-gray-800 p-4 flex-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className={`font-bold text-lg ${color}`}>{value}</span>
                                        <span className={color}>{icon}</span>
                                    </div>
                                    <p className="text-xs font-mono pt-2 text-gray-400">{label}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-gray-300 mb-2">Graphe des ventes</h2>
                        <LineChart width={850} height={280} data={dataGraphe} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis domain={[0, 7000]} stroke="#ccc" />
                            <Tooltip />
                            <ReferenceLine y={4000} stroke="red" strokeDasharray="5 5">
                                <Label value="Objectif: 4000" position="insideTopRight" fill="red" />
                            </ReferenceLine>
                            <ReferenceDot x="Mai" y={6000} r={8} fill="green" stroke="none">
                                <Label value="Pic" position="top" fill="green" />
                            </ReferenceDot>
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>

                        <div className="mt-4 flex flex-row gap-4">
                            <div className="w-2/3">
                                <h2 className="text-gray-300 mb-2">Répartition des ventes</h2>
                                <div className="h-52 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                                    graphe des ventes
                                </div>
                            </div>
                            <div className="w-1/3 flex items-center justify-center">
                                <PieChart width={260} height={260}>
                                    <Pie
                                        data={[
                                            { name: 'Femme', uv: 400, fill: "#8884d8" },
                                            { name: 'Homme', uv: 600, fill: "#82ca9d" },
                                        ]}
                                        dataKey="uv"
                                    >
                                        <Tooltip />
                                    </Pie>
                                </PieChart>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-gray-300 mb-2">Derniers clients</h2>
                            <div className="overflow-x-auto rounded-xl">
                                <table className="w-full border-collapse bg-gray-800 text-white text-center">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="border border-gray-900 p-2">ID</th>
                                            <th className="border border-gray-900 p-2">Nom</th>
                                            <th className="border border-gray-900 p-2">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-900 p-2">1</td>
                                            <td className="border border-gray-900 p-2">John Doe</td>
                                            <td className="border border-gray-900 p-2">john.doe@example.com</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-gray-300 mb-2">Dernières commandes</h2>
                            <div className="overflow-x-auto rounded-xl">
                                <table className="w-full border-collapse bg-gray-800 text-white text-center">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            {["ID", "Client", "Montant", "Date", "Heure"].map(h => (
                                                <th key={h} className="border border-gray-900 p-2">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-900 p-2">1</td>
                                            <td className="border border-gray-900 p-2">John Doe</td>
                                            <td className="border border-gray-900 p-2">500 DH</td>
                                            <td className="border border-gray-900 p-2">01/01/2024</td>
                                            <td className="border border-gray-900 p-2">10:00 AM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── PROFILE ── */}
                {activeMenu === "profile" && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-200">Mon Profil Admin</h2>
                        <form onSubmit={(e) => { e.preventDefault(); getProfileAdmin(); }}>
                            <div className="flex flex-col gap-4 max-w-lg">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col flex-1">
                                        <label className="font-serif text-gray-500 text-sm mb-1">Prénom</label>
                                        <input
                                            type="text" name="prenom" value={formData.prenom}
                                            onChange={handleInputChange}
                                            className="border rounded-xl border-gray-700 bg-gray-800 p-2 text-white"
                                            placeholder="Prénom..."
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="font-serif text-gray-500 text-sm mb-1">Nom</label>
                                        <input
                                            type="text" name="nom" value={formData.nom}
                                            onChange={handleInputChange}
                                            className="border rounded-xl border-gray-700 bg-gray-800 p-2 text-white"
                                            placeholder="Nom..."
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-serif text-gray-500 text-sm mb-1">Téléphone</label>
                                    <input
                                        type="tel" name="telephone" value={formData.telephone}
                                        onChange={handleInputChange}
                                        className="border rounded-xl border-gray-700 bg-gray-800 p-2 text-white"
                                        placeholder="+212 6XXXXXXXX"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-serif text-gray-500 text-sm mb-1">Email</label>
                                    <p className="border rounded-xl border-gray-700 bg-gray-800 p-2 text-gray-400">
                                        {formData.email || "admin@example.com"}
                                    </p>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-serif text-gray-500 text-sm mb-1">Rôle</label>
                                    <p className="border rounded-xl border-gray-700 bg-gray-800 p-2 text-blue-400 font-bold">
                                        {formData.role || "ADMIN"}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-3 mt-2">
                                    <button type="submit" className="bg-blue-700 px-6 py-2 rounded-xl text-white hover:bg-blue-800">
                                        Enregistrer
                                    </button>
                                    <button type="button" onClick={handleLogout} className="bg-red-700 px-6 py-2 rounded-xl text-white hover:bg-red-800">
                                        Déconnecter
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── CLIENTS ── */}
                {activeMenu === "users" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Gestion des Clients</h2>
                        <div className="w-full bg-gray-800 text-white rounded-xl pb-2 mb-6">
                            <h3 className="bg-gray-700 text-white text-center font-bold p-2 rounded-t-xl">Ajouter un Client</h3>
                            <form onSubmit={handleAddClient} className="p-3">
                                <div className="flex flex-row gap-3 flex-wrap">
                                    {[
                                        { label: "Nom", key: "nom", type: "text" },
                                        { label: "Prénom", key: "prenom", type: "text" },
                                        { label: "Email", key: "email", type: "email" },
                                        { label: "Genre", key: "genre", type: "text" },
                                        { label: "Téléphone", key: "telephone", type: "tel" },
                                    ].map(({ label, key, type }) => (
                                        <div key={key} className="flex flex-col flex-1 min-w-[140px]">
                                            <label className="text-gray-500 text-sm mb-1">{label}</label>
                                            <input
                                                type={type}
                                                value={(newClient as any)[key]}
                                                onChange={(e) => setNewClient({ ...newClient, [key]: e.target.value })}
                                                className="p-1 rounded-md text-white border border-gray-600 bg-gray-900"
                                                placeholder={label.toLowerCase()}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row gap-3 mt-2">
                                    {[
                                        { label: "Adresse", key: "adresse", type: "text" },
                                        { label: "Mot de passe", key: "password", type: "password" },
                                    ].map(({ label, key, type }) => (
                                        <div key={key} className="flex flex-col flex-1">
                                            <label className="text-gray-500 text-sm mb-1">{label}</label>
                                            <input
                                                type={type}
                                                value={(newClient as any)[key]}
                                                onChange={(e) => setNewClient({ ...newClient, [key]: e.target.value })}
                                                className="p-1 rounded-md text-white border border-gray-600 bg-gray-900"
                                                placeholder={label.toLowerCase()}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4 bg-gray-700 hover:bg-blue-800 px-30 py-2 rounded-xl text-white block mx-auto"
                                >
                                    {isSubmitting ? "Ajout..." : "Ajouter"}
                                </button>
                            </form>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-300">Liste des Utilisateurs</h3>
                            <button onClick={getAllClients} className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700">
                                🔄 Actualiser
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-center text-gray-400">Chargement...</p>
                        ) : clients.length === 0 ? (
                            <p className="text-center text-gray-500">Aucun client trouvé</p>
                        ) : (
                            <div className="overflow-x-auto rounded-xl">
                                <table className="w-full bg-gray-800 text-white text-center">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            {["ID", "Nom", "Prénom", "Genre", "Email", "Téléphone", "Actions"].map(h => (
                                                <th key={h} className="p-2">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client: any) => (
                                            <tr key={client.id_client} className="border-t border-gray-700">
                                                <td className="p-2">{client.id_client}</td>
                                                <td className="p-2">{client.nom}</td>
                                                <td className="p-2">{client.prenom}</td>
                                                <td className="p-2">{client.genre || '-'}</td>
                                                <td className="p-2">{client.email}</td>
                                                <td className="p-2">{client.telephone || '-'}</td>
                                                <td className="p-2 flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleDeleteClient(client.id_client)}
                                                        className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded-lg text-sm"
                                                    >
                                                        Supprimer
                                                    </button>
                                                    <button
                                                        onClick={() => window.location.href = `/auth/user/modifier/${client.id_client}`}
                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── PRODUITS ── */}
                {activeMenu === "products" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Gestion des Produits</h2>

                        {/* Catégories */}
                        <div className="flex flex-row w-full gap-4 mb-4">
                            <div className="w-1/5 bg-gray-800 rounded-xl p-3">
                                <form onSubmit={handleAjouteCategorie}>
                                    <h3 className="bg-gray-600 rounded-lg text-center p-1 mb-2">Catégorie</h3>
                                    <ChartBarStacked size={20} className="mx-auto mb-2" />
                                    <div className="flex items-center justify-center overflow-hidden mb-2">
                                        {categorie.imageIcon ? (
                                            <img src={URL.createObjectURL(categorie.imageIcon)} alt="preview" className="w-20 object-cover rounded" />
                                        ) : (
                                            <label className="cursor-pointer text-gray-400 text-xs text-center p-2 border border-dashed border-gray-600 rounded w-full">
                                                <input type="file" accept="image/*" onChange={(e: any) => setCategorie({ ...categorie, imageIcon: e.target.files[0] })} className="hidden" />
                                                + Ajouter image
                                            </label>
                                        )}
                                    </div>
                                    <input
                                        type="text" value={categorie.categorie || selectedCategorie}
                                        onChange={(e) => { setCategorie({ ...categorie, categorie: e.target.value }); setSelectedCategorie(e.target.value); }}
                                        placeholder="Nom catégorie"
                                        className="rounded-lg text-white border border-gray-600 bg-gray-900 w-full p-1 text-sm text-center mb-2"
                                    />
                                    <button type="submit" className="bg-gray-700 hover:bg-gray-800 w-full p-1 rounded-lg text-sm">Ajouter</button>
                                </form>
                            </div>
                            <div className="flex flex-row gap-3 flex-wrap items-start">
                                {Array.isArray(categories) && categories.map((cat: any) => (
                                    <div key={cat.id} className="flex flex-col bg-gray-700 w-32 rounded-xl p-2 items-center gap-1">
                                        <img src={`http://localhost:8080/auth/categorie/${cat.id}/image`} width={36} alt="" className="rounded" />
                                        <span className="text-green-400 text-sm font-bold">0</span>
                                        <span className="text-xs font-bold text-center">{cat.nomCategorie}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ajout produit */}
                        <div className="w-full text-white bg-gray-800 rounded-xl mb-4">
                            <h3 className="bg-gray-600 p-1 rounded-t-xl text-center">Ajouter un Produit</h3>
                            <form onSubmit={handleAjouteProduit} className="p-3">
                                <div className="flex flex-row gap-4">
                                    <div className="w-36 h-36 bg-gray-600 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {produit.imageProduit ? (
                                            <img src={URL.createObjectURL(produit.imageProduit)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <label className="cursor-pointer text-gray-400 text-xs text-center p-2">
                                                <input type="file" accept="image/*" onChange={(e: any) => setProduit({ ...produit, imageProduit: e.target.files[0] })} className="hidden" />
                                                + Image
                                            </label>
                                        )}
                                    </div>
                                    <div className="flex flex-row gap-6 flex-1">
                                        <div className="flex flex-col gap-2">
                                            {[
                                                { label: "Marque", key: "marque" },
                                                { label: "Modèle", key: "model" },
                                                { label: "Prix  ", key: "prix" },
                                            ].map(({ label, key }) => (
                                                <div key={key} className="flex flex-row items-center gap-2">
                                                    <label className="text-gray-500 text-sm w-16">{label}</label>
                                                    <input
                                                        type="text" value={(produit as any)[key]}
                                                        onChange={e => setProduit({ ...produit, [key]: e.target.value })}
                                                        className="w-48 p-1 rounded-lg text-white border border-gray-600 bg-gray-900 text-sm"
                                                        placeholder={label.toLowerCase()}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <label className="text-gray-500 text-sm w-16">Année</label>
                                                <input type="text" value={produit.annee} onChange={e => setProduit({ ...produit, annee: e.target.value })} className="w-48 p-1 rounded-lg text-white border border-gray-600 bg-gray-900 text-sm" placeholder="année" />
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <label className="text-gray-500 text-sm w-16">Couleur</label>
                                                <input type="color" value={produit.couleur} onChange={e => setProduit({ ...produit, couleur: e.target.value })} className="w-48 h-8 rounded-lg bg-gray-900 border border-gray-600" />
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <label className="text-gray-500 text-sm w-16">Catégorie</label>
                                                <select value={selectedCategorie} onChange={e => setSelectedCategorie(e.target.value)} className="w-48 p-1 rounded-lg text-white border border-gray-600 bg-gray-900 text-sm">
                                                    <option value="" disabled>Sélectionner...</option>
                                                    {Array.isArray(categories) && categories.map((cat: any) => (
                                                        <option key={cat.id} value={cat.nomCategorie}>{cat.nomCategorie}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="mt-4 bg-gray-700 hover:bg-gray-800 px-30 py-2 rounded-xl text-white block mx-auto">
                                    Ajouter le produit
                                </button>
                            </form>
                        </div>

                        {/* Liste produits */}
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full bg-gray-800 text-white text-center">
                                <thead className="bg-gray-700">
                                    <tr>
                                        {["ID", "Image", "Modèle", "Catégorie", "Prix", "Année", "Date", "Heure", "Actions"].map(h => (
                                            <th key={h} className="p-2 text-sm">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(produits) && produits.map((p: any) => (
                                        <tr key={p.id} className="border-t border-gray-700">
                                            <td className="p-2">{p.id}</td>
                                            <td className="p-2"><img src={`http://localhost:8080/auth/produit/${p.id}/image`} alt="" width={70} className="mx-auto rounded" /></td>
                                            <td className="p-2">{p.model}</td>
                                            <td className="p-2">{p.categorie?.nomCategorie || '-'}</td>
                                            <td className="p-2">{p.prix || '-'}</td>
                                            <td className="p-2">{p.annee || '-'}</td>
                                            <td className="p-2">{p.dateAjtPrd || '-'}</td>
                                            <td className="p-2">{p.tempsAjtPrd || '-'}</td>
                                            <td className="p-2">
                                                <button onClick={() => handleDeleteClient(p.id)} className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded-lg text-sm">
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── COMMANDES ── */}
                {activeMenu === "commandes" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Gestion des Commandes</h2>
                        <div className="flex flex-row gap-3 mb-6">
                            {[
                                { label: "EN ATTENTE", color: "text-yellow-400", count: 0 },
                                { label: "CONFIRMÉE", color: "text-green-400", count: 0 },
                                { label: "EN COURS", color: "text-orange-400", count: 0 },
                                { label: "ANNULÉE", color: "text-red-400", count: 0 },
                            ].map(({ label, color, count }) => (
                                <div key={label} className="flex flex-col border border-gray-700 bg-gray-800 rounded-xl p-3 flex-1 text-center">
                                    <span className={`font-bold text-2xl ${color}`}>{count}</span>
                                    <span className="text-gray-500 text-xs mt-1">{label}</span>
                                </div>
                            ))}
                        </div>
                        <LineChart width={820} height={260} data={dataGraphe} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis domain={[0, 7000]} stroke="#ccc" />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                        <div className="overflow-x-auto rounded-xl mt-4">
                            <table className="w-full bg-gray-800 text-white text-center">
                                <thead className="bg-gray-700">
                                    <tr>
                                        {["ID", "Client", "Produit", "Quantité", "Montant", "Statut", "Date", "Heure"].map(h => <th key={h} className="p-2">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-700">
                                        <td className="p-2">1</td><td className="p-2">Ilyass Achibani</td>
                                        <td className="p-2">Peugeot 208</td><td className="p-2">1</td>
                                        <td className="p-2">200 000 DH</td>
                                        <td className="p-2"><span className="text-yellow-400 font-bold text-xs">EN_ATTENTE</span></td>
                                        <td className="p-2">24-03-2026</td><td className="p-2">17:52:58</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── PAIEMENTS ── */}
                {activeMenu === "paiements" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Gestion des Paiements</h2>
                        <div className="flex flex-row gap-3 mb-6">
                            {[
                                { label: "EN LIGNE", color: "text-green-400", count: 0 },
                                { label: "À LA LIVRAISON", color: "text-yellow-400", count: 0 },
                                { label: "ÉCHOUÉ", color: "text-red-400", count: 0 },
                                { label: "REVENU", color: "text-emerald-300", count: "0 DH" },
                            ].map(({ label, color, count }) => (
                                <div key={label} className="flex flex-col border border-gray-700 bg-gray-800 rounded-xl p-3 flex-1 text-center">
                                    <span className={`font-bold text-2xl ${color}`}>{count}</span>
                                    <span className="text-gray-500 text-xs mt-1">{label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full bg-gray-800 text-white text-center">
                                <thead className="bg-gray-700">
                                    <tr>
                                        {["ID", "CmdID", "Client", "Reprise", "Méthode", "Montant", "Statut", "Date", "Heure"].map(h => <th key={h} className="p-2">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-700">
                                        <td className="p-2">1</td><td className="p-2">20</td>
                                        <td className="p-2">Ilyass Achibani</td><td className="p-2">Non</td>
                                        <td className="p-2">Virement</td><td className="p-2">200 000 DH</td>
                                        <td className="p-2"><span className="text-yellow-400 font-bold text-xs">EN_ATTENTE</span></td>
                                        <td className="p-2">24-03-2026</td><td className="p-2">21:30:58</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── LIVRAISONS ── */}
                {activeMenu === "livraison" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Gestion des Livraisons</h2>
                        <div className="flex flex-row gap-4 mb-6">
                            {/* Camion */}
                            <div className="bg-gray-800 w-1/2 rounded-xl p-4">
                                <h3 className="font-bold text-center flex items-center justify-center gap-2 mb-3">
                                    Camion <PiTruckFill size={24} />
                                </h3>
                                <form className="flex flex-col gap-2">
                                    {[{ label: "Nom / Marque", name: "NomC" }, { label: "Propriétaire", name: "prop" }, { label: "Matricule", name: "matrc" }].map(({ label, name }) => (
                                        <div key={name} className="flex flex-col">
                                            <label className="text-gray-500 text-sm">{label}</label>
                                            <input type="text" name={name} className="border border-gray-600 bg-gray-900 rounded-lg p-1 text-white text-sm" placeholder={label.toLowerCase()} />
                                        </div>
                                    ))}
                                    <button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-sm mt-2">+ Ajouter</button>
                                </form>
                            </div>
                            {/* Chauffeur */}
                            <div className="bg-gray-800 w-1/2 rounded-xl p-4">
                                <h3 className="font-bold text-center flex items-center justify-center gap-2 mb-3">
                                    Chauffeur <GrUserWorker size={24} />
                                </h3>
                                <form className="flex flex-col gap-2">
                                    {[{ label: "Identifiant", name: "iden", type: "text" }, { label: "Nom Complet", name: "nomC", type: "text" }, { label: "Mot de passe", name: "pass", type: "password" }].map(({ label, name, type }) => (
                                        <div key={name} className="flex flex-col">
                                            <label className="text-gray-500 text-sm">{label}</label>
                                            <input type={type} name={name} className="border border-gray-600 bg-gray-900 rounded-lg p-1 text-white text-sm" placeholder={label.toLowerCase()} />
                                        </div>
                                    ))}
                                    <button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-sm mt-2">+ Ajouter</button>
                                </form>
                            </div>
                        </div>

                        <h3 className="text-gray-400 font-bold mb-2">Table des Livraisons</h3>
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full bg-gray-800 text-white text-center">
                                <thead className="bg-gray-700">
                                    <tr>
                                        {["ID", "Client", "CmdID", "PaiID", "Ville", "Adresse", "Tél", "CP", "Statut", "Date/Heure"].map(h => <th key={h} className="p-2 text-sm">{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-700">
                                        <td className="p-2">1</td><td className="p-2">Ilyass Achibani</td>
                                        <td className="p-2">1</td><td className="p-2">1</td>
                                        <td className="p-2">Tanger</td><td className="p-2">Bni Ouriaghle</td>
                                        <td className="p-2">0600000000</td><td className="p-2">90000</td>
                                        <td className="p-2"><span className="text-orange-400 font-bold text-xs">EN_ATTENTE</span></td>
                                        <td className="p-2">07-05-26 / 12:23</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-row w-full h-52 gap-4 mt-4">
                            <div className="w-1/2 border border-gray-700 rounded-xl flex items-center justify-center text-gray-500">
                                Carte Maps
                            </div>
                            <div className="w-1/2 border border-gray-700 rounded-xl flex items-center justify-center text-gray-500">
                                Graphe
                            </div>
                        </div>
                    </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeMenu === "notif" && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-200">Notifications</h2>
                        <p className="text-gray-400">Aucune notification pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}