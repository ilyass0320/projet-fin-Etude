import { useEffect, useState } from "react";
import dataProd from "../../data/dataProdDetail.json";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./filtrage.css";
import { GoDotFill } from "react-icons/go";
import { useCart } from "../content/CarteContent";


type Reservation = {
    debut: string;
    fin: string;
    user: string;
    tel: string;
};

type Vehicule = {
    [key: string]: any;
    motors?: { [Key: string]: any }[];
    velos?: { [Key: string]: any }[];
    voitures?: { [Key: string]: any }[];
};

const Filtrage = () => {
    const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState("");
    const [selectedMarque, setSelectedMarque] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedCarburant, setSelectedCarburant] = useState("");
    const [voituresSelectionnees, setVoituresSelectionnees] = useState([]);
    const [modeComparaison, setModeComparaison] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const { addToCart, totalItems } = useCart();


    const getField = (el: Vehicule, type: string, field: string) => {
        if (type === "voitures") return el?.[field];
        if (type === "motors" && el?.motors) return el.motors[0][field];
        if (type === "velos" && el?.velos) return el.velos[0][field];
        return "";
    };

    const selectedTypeData = dataProd[0].vehicule.find((v) => v.name === selectedType);
    const filteredElements: Vehicule[] = Array.isArray(selectedTypeData?.elements)
        ? (selectedTypeData?.elements as Vehicule[])
        : [];

    // Vérifier conflit avec une réservation
    const getReservationConflit = (vehicule: Vehicule) => {
        if (!dateDebut || !dateFin || !vehicule.reservations) return null;

        const debutChoisi = new Date(dateDebut);
        const finChoisi = new Date(dateFin);

        for (let r of vehicule.reservations) {
            const debutRes = new Date(r.debut);
            const finRes = new Date(r.fin);

            if (!(finChoisi < debutRes || debutChoisi > finRes)) {
                return r;
            }
        }
        return null;
    };

    // Reset filtres dépendants quand la transaction change
    useEffect(() => {
        setSelectedType("");
        setSelectedMarque("");
        setSelectedModel("");
        setSelectedCarburant("");
    }, [selectedTransaction]);

    // Reset marque/modele/carburant quand le type change
    useEffect(() => {
        setSelectedMarque("");
        setSelectedModel("");
        setSelectedCarburant("");
    }, [selectedType]);

    // Reset modele/carburant quand la marque change
    useEffect(() => {
        setSelectedModel("");
        setSelectedCarburant("");
    }, [selectedMarque]);

    // Reset carburant quand le modele change
    useEffect(() => {
        setSelectedCarburant("");
    }, [selectedModel]);


    const renderCard = (el: Vehicule, type: string, index: number) => {
        const id = el.id || index;
        const marque = getField(el, type, "Marque") || getField(el, type, "marque");
        const model = getField(el, type, "model") || getField(el, type, "modele");
        const carburant = getField(el, type, "carburant");
        const img_vehicule = getField(el, type, "img_vehicule");
        const img_marque = getField(el, type, "img_marque");
        const prix = getField(el, type, "prix");
        const annee = getField(el, type, "annee");
        const transaction = getField(el, type, "transaction");
        const Kilometrage = getField(el, type, "kilometrage");
        const transmission = getField(el, type, "transmission");

        const conflit = getReservationConflit(el);

        return (
            <div key={id} className="p-1 mb-4 border rounded-md shadow-xl">
                <div className="relative flex justify-center h-34 mb-3 border border-none bg-gray-200 rounded-xl">
                    <img src={img_vehicule} alt="img_vehicule" className="hoverImg" width={200} height={200} />
                    <div className="top-0 left-0 absolute m-1 z-10">
                        <img src={img_marque} alt="img_marque" width={40} height={40} />
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <span className="border font-bold px-4 text-xl rounded-xl bg-gray-500 text-white py-1">
                        {transaction || "Non défini"}
                    </span>
                    <h2 className="text-md font-extrabold text-red-700">{prix || "Non défini"}</h2>
                </div>
                <div className="flex flex-row justify-between mt-2">
                    <h2 className="text-2xl font-bold">{marque || "marque"} {model || "model"}</h2>
                </div>
                <div className="m-1 flex flex-row justify-between">
                    <div>
                        <h2>{annee || "0000"}</h2>
                    </div>
                    <span><GoDotFill /></span>
                    <div>
                        <h2>{carburant || "type-carburant"}</h2>
                    </div>
                    <span><GoDotFill /></span>
                    <div>
                        <h2>{Kilometrage || "no-kilometrage"}</h2>
                    </div>
                </div>

                {/* Affichage conflit de réservation */}
                {conflit && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm">
                        ⚠️ Déjà réservé du <strong>{conflit.debut}</strong> au <strong>{conflit.fin}</strong>
                    </div>
                )}

                <div className="flex flex-row justify-between w-full gap-2 mt-3">
                    <button className="border border-white shadow-lg bg-gray-900 font-bold text-white p-2 rounded-xl w-1/2 hover:bg-gray-100">
                        <Link to={`/details/${type}/${marque}/${model}/${id}`}>Découvrir</Link>
                    </button>
                    <button
                        className="border border-gray-900 bg-gray-200 shadow-lg font-bold text-gray-900 p-2 rounded-xl w-1/2 cursor-pointer hoverFliButton"
                        onClick={() =>
                            addToCart({
                                id,
                                marque: marque || "",
                                model: model || "",
                                prix: prix || "",
                                img_vehicule: img_vehicule || "",
                                transaction: transaction || "",
                            })
                        }
                    >
                        🛒
                    </button>
                </div>
            </div>
        );
    };

    const results = filteredElements
        .filter((el) => {
            const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
            const modele = getField(el, selectedType, "model") || getField(el, selectedType, "modele");
            const carburant = getField(el, selectedType, "carburant");
            const transaction = getField(el, selectedType, "transaction"); // ✅ Corrigé
            return (
                (selectedTransaction ? transaction === selectedTransaction : true) &&
                (selectedMarque ? marque === selectedMarque : true) &&
                (selectedModel ? modele === selectedModel : true) &&
                (selectedCarburant ? carburant === selectedCarburant : true)
            );
        })
        .map((el, index) => renderCard(el, selectedType, index));

    const allVehicles: Vehicule[] = dataProd[0].vehicule.flatMap((v: Vehicule) => v.elements || []);

    // Grouper tous les véhicules par transaction
    const allTransactions: string[] = [
        ...new Set(
            dataProd[0].vehicule.flatMap((v) =>
                (v.elements || []).map((el: Vehicule) => el.transaction)
            )
        ),
    ].filter(Boolean);

    // Pour chaque véhicule, retrouver son type (voitures / motors / velos)
    const getTypeForElement = (el: Vehicule): string => {
        for (const v of dataProd[0].vehicule) {
            if ((v.elements || []).some((e: Vehicule) => e === el)) {
                return v.name;
            }
        }
        return "voitures";
    };

    return (
        <div className="m-8 mt-[100px] flex flex-col items-center space-x-4">
            <h1 className="font-extrabold text-4xl text-gray-900">Trouvez votre Véhicule</h1>

            {/* Filtres */}
            <div className="space-y-4 grid grid-cols-5 border gap-10 p-9 rounded-xl bg-gray-100 opacity-90" style={{ boxShadow: "#A52A2A" }}>

                {/* Transaction */}
                <div>
                    <label className="block font-semibold mb-1">Transaction</label>
                    <select
                        value={selectedTransaction}
                        onChange={(e) => setSelectedTransaction(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                    >
                        <option value="">Type de Transaction</option>
                        {[...new Set(
                            dataProd?.[0]?.vehicule.flatMap(v =>
                                v.elements.map(el => el.transaction)
                            )
                        )].map((tran, index) => (
                            <option key={index} value={tran}>
                                {tran}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type de véhicule */}
                <div>
                    <label className="block font-semibold mb-1">Véhicule</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                        disabled={!selectedTransaction}
                    >
                        <option value="">Sélectionner un type</option>
                        {dataProd[0].vehicule.map((v) => (
                            <option key={v.id} value={v.name}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Marque */}
                <div>
                    <label className="block font-semibold mb-1">Marque</label>
                    <select
                        value={selectedMarque}
                        onChange={(e) => setSelectedMarque(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                        disabled={!selectedType}
                    >
                        <option value="">Sélectionner une marque</option>
                        {[...new Set(
                            filteredElements
                                .filter((el) => {
                                    // ✅ Filtrer par transaction dès la marque
                                    const transaction = getField(el, selectedType, "transaction");
                                    return selectedTransaction ? transaction === selectedTransaction : true;
                                })
                                .map((el) => getField(el, selectedType, "Marque") || getField(el, selectedType, "marque"))
                                .filter(Boolean)
                        )].map((marque, index) => (
                            <option key={index} value={marque}>{marque}</option>
                        ))}
                    </select>
                </div>

                {/* Modèle */}
                <div>
                    <label className="block font-semibold mb-1">Modèle</label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                        disabled={!selectedMarque}
                    >
                        <option value="">Sélectionner le modèle</option>
                        {filteredElements
                            .filter((el) => {
                                const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
                                const transaction = getField(el, selectedType, "transaction"); // ✅ Corrigé
                                return marque === selectedMarque && transaction === selectedTransaction;
                            })
                            .map((el, index) => {
                                const modele = getField(el, selectedType, "model") || getField(el, selectedType, "modele");
                                return (
                                    <option key={index} value={modele}>
                                        {modele || "Aucun modèle"}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Carburant */}
                <div>
                    <label className="block font-semibold mb-1">Carburant</label>
                    <select
                        value={selectedCarburant}
                        onChange={(e) => setSelectedCarburant(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                        disabled={!selectedModel}
                    >
                        <option value="">Sélectionner le carburant</option>
                        {filteredElements
                            .filter((el) => {
                                const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
                                const modele = getField(el, selectedType, "model") || getField(el, selectedType, "modele");
                                return marque === selectedMarque && modele === selectedModel;
                            })
                            .map((el, index) => {
                                const carburant = getField(el, selectedType, "carburant");
                                return (
                                    <option key={index} value={carburant}>
                                        {carburant || "Non défini"}
                                    </option>
                                );
                            })}
                    </select>
                </div>

                {/* Dates location */}
                {selectedTransaction === "location" && (
                    <div className="col-span-5 flex flex-row gap-10 mt-2">
                        <div>
                            <label className="block font-semibold mb-1">Date début</label>
                            <input
                                type="date"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Date fin</label>
                            <input
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Résultats */}
            <div className="w-full mt-4">
                {selectedType.length > 0 ? (
                    <>
                        {(() => {
                            const transactionExistePourType = filteredElements.some(
                                (el) => getField(el, selectedType, "transaction") === selectedTransaction
                            );

                            if (selectedTransaction && !transactionExistePourType) {
                                return (
                                    <div className="flex flex-col items-center justify-center mt-10 gap-3">
                                        <p className="text-center text-red-500 font-bold text-lg">
                                            Le type de transaction <span className="capitalize">« {selectedTransaction} »</span> n'existe pas pour les <span className="capitalize">{selectedType}</span>.
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Veuillez choisir une autre transaction ou un autre type de véhicule.
                                        </p>
                                    </div>
                                );
                            }

                            if (results.length > 0) {
                                return (
                                    <div className="grid grid-cols-3 gap-6 mt-2 w-full">
                                        {results}
                                    </div>
                                );
                            }

                            return (
                                <p className="text-center text-gray-500 mt-6">
                                    Aucun véhicule trouvé pour les critères sélectionnés.
                                </p>
                            );
                        })()}
                    </>
                ) : selectedTransaction ? (
                    (() => {
                        const vehiculesDeTran: { el: Vehicule; type: string }[] = dataProd[0].vehicule.flatMap((v) =>
                            (v.elements || [])
                                .filter((el: Vehicule) => el.transaction === selectedTransaction)
                                .map((el: Vehicule) => ({ el, type: v.name }))
                        );

                        if (vehiculesDeTran.length === 0) {
                            return (
                                <div className="flex flex-col items-center justify-center mt-10 gap-3">
                                    <span className="text-5xl">🚫</span>
                                    <p className="text-center text-red-500 font-bold text-lg">
                                        Le type de transaction <span className="capitalize">« {selectedTransaction} »</span> n'existe pas dans la base de données.
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Veuillez choisir une autre transaction.
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="border border-b border-gray-300 p-3 rounded-xl text-white bg-gray-900 font-bold capitalize">
                                        {selectedTransaction}
                                    </span>
                                    {/* <span className="text-gray-400 text-sm">
                                        ({vehiculesDeTran.length} véhicule{vehiculesDeTran.length > 1 ? "s" : ""})
                                    </span> */}
                                </div>
                                <div className="grid grid-cols-3 gap-6 mt-3 w-full">
                                    {vehiculesDeTran.map(({ el, type }, index) =>
                                        renderCard(el, type, index)
                                    )}
                                </div>
                            </div>
                        );
                    })()
                ) : (
                    <div>
                        <h1 className="text-center mb-4 px-2 text-gray-700 text-md">
                            Profitez des meilleures offres sur les voitures, motos et vélos. Comparez facilement et trouvez le véhicule idéal au meilleur prix !
                        </h1>
                        {(() => {
                            const voituresData = dataProd[0].vehicule.find((v) => v.name === "voitures");
                            const voituresAchat: Vehicule[] = (voituresData?.elements || []).filter(
                                (el: Vehicule) => el.transaction === "achat"
                            );

                            if (voituresAchat.length === 0) return (
                                <p className="text-center text-gray-500 mt-6">Aucune voiture disponible à l'achat.</p>
                            );

                            return (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="border border-b border-gray-300 p-3 rounded-xl text-white bg-gray-900 font-bold capitalize">
                                            Achat
                                        </span>
                                        {/* <span className="text-gray-400 text-sm">
                                            ({voituresAchat.length} voiture{voituresAchat.length > 1 ? "s" : ""})
                                        </span> */}
                                    </div>
                                    <div className="grid grid-cols-3 gap-6 mt-3 w-full">
                                        {voituresAchat.map((el, index) =>
                                            renderCard(el, "voitures", index)
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filtrage;