import { useState } from "react";
import dataProd from "../../data/dataProdDetail.json";
import { Car, Plus, Minus, ArrowLeft, Check, X } from 'lucide-react';
import "./comparaison.css"


const Filrage = () => {
    const [selectedType, setSelectedType] = useState("");
    const [selectedMarque, setSelectedMarque] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedCarburant, setSelectedCarburant] = useState("");
    const [vehiculeSelectionnees, setVehiculeSelectionnees] = useState<Vehicule[]>([]);
    const [modeComparaison, setModeComparaison] = useState(false);


    type Vehicule = {
        [key: string]: any;
        motors?: { [Key: string]: any }[];
        velos?: { [Key: string]: any }[];
        voitures?: { [Key: string]: any }[];
    };

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

    //ajouter une voiture a la comparaison
    const ajouterAComparaison = (vehicule: Vehicule) => {
        if (vehiculeSelectionnees.length < 2 && !vehiculeSelectionnees.find(v => v.id === vehicule.id)
        ) {
            setVehiculeSelectionnees([...vehiculeSelectionnees, vehicule]);
        }
    };

    //Retirer une voiture de la comparaison 
    const retirerDeComparaison = (id: number) => {
        setVehiculeSelectionnees(vehiculeSelectionnees.filter(v => v.id !== id));
    };


    //vider la selection
    const viderSelection = () => setVehiculeSelectionnees([]);
    // --- Filtrage quand un type est choisi ---
    const results = filteredElements
        .filter((el) => {
            const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
            const modele = getField(el, selectedType, "model") || getField(el, selectedType, "modele");
            const carburant = getField(el, selectedType, "carburant");
            return (
                (selectedMarque ? marque === selectedMarque : true) &&
                (selectedModel ? modele === selectedModel : true) &&
                (selectedCarburant ? carburant === selectedCarburant : true)
            );
        })
        .map((el, index) => renderCard(el, selectedType, index));

    // --- Si aucun filtre choisi → récupérer TOUS les véhicules (voitures, motos, vélos) ---
    const allVehicles: Vehicule[] = dataProd[0].vehicule.flatMap((v) => v.elements || []);


    // --- Fonction d'affichage d'une carte véhicule ---
    function renderCard(el: Vehicule, type: string, index: number) {

        const estSelectionnee = vehiculeSelectionnees.some(v => v.id === el.id);
        const peutAjouter = vehiculeSelectionnees.length < 2;
        const marque = getField(el, type, "Marque") || getField(el, type, "marque");
        const model = getField(el, type, "model") || getField(el, type, "modele");
        const carburant = getField(el, type, "carburant");
        const img_vehicule = getField(el, type, "img_vehicule");
        const img_marque = getField(el, type, "img_marque");
        const portesV = getField(el, type, "portes");
        const placesV = getField(el, type, "places");
        const prix = getField(el, type, "prix");
        const annee = getField(el, type, "annee");
        const prix_jour = getField(el, type, "prix_jour");
        const kilometrage = getField(el, type, "kilometrage_Inclus")
        const Transmission = getField(el, type, "transmission");


        return (
            <div key={index} className="w-100 border p-1 gap-2 rounded-md shadow-xl">
                <div className="relative flex justify-center w-auto h-35 w-30 border border-none bg-gray-200 rounded-xl ">
                    <img src={img_vehicule} alt="img_vehicule" className="hoverImg" width={200} height={200} />
                    <div className="top-0 left-0 absolute m-1 z-10">
                        <img src={img_marque} alt="img_marque" width={40} height={40} />
                    </div>
                </div>
                <div className="flex flex-row justify-between mt-2">
                    <h2 className="text-2xl font-bold">{marque || "marque"} {model || "model"}</h2>
                    <h2 className="text-sm font-bold text-red-700">{prix || "Non défini"}</h2>
                </div>
                <div className="flex gap-2 m-1">

                    {estSelectionnee ? (
                        <button
                            onClick={() => retirerDeComparaison(el.id)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hoverRetiComp transition-colors flex items-center justify-center gap-2"
                        >
                            <Minus className="w-4 h-4" />
                            Retirer
                        </button>
                    ) : (
                        <button
                            onClick={() => ajouterAComparaison(el)}
                            disabled={!peutAjouter}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${peutAjouter
                                ? 'bg-gray-900 text-white hoverAjouComp'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                            Comparer
                        </button>
                    )}
                </div>
            </div>
        );
    }
    // Tableau de comparaison 
    const TableauComparaison = () => {
        if (vehiculeSelectionnees.length === 0) {
            return (
                <div className="text-center py-12">
                    <Car className="mx-auto block h-12 w-12 text-gray-400 mb-4" />
                </div>
            );
        }
        const criteres = [
            { Key: "prix", label: "Prix", type: Number, inverse: true },
            { Key: "puissance", label: "Puissance", type: Number },
            { Key: "annee", label: "Année", type: Number },
            { Key: "portes", label: "Portes", type: Number },
            { Key: "places", label: "Places", type: Number },
        ];


        // Fonction pour déterminer quelle voiture a l'avantage
        const obtenirAvantage = (critere: any, v1: Vehicule, v2: Vehicule) => {
            const val1 = v1[critere.Key];
            const val2 = v2[critere.Key];

            if (val1 == null || val2 == null) return null;

            // Cas numérique
            if (critere.type === Number) {
                const n1 = Number(val1);
                const n2 = Number(val2);

                if (isNaN(n1) || isNaN(n2)) return null;

                // inverse = plus petit est meilleur (ex: prix)
                if (critere.inverse) {
                    return n1 < n2 ? v1.id : n2 < n1 ? v2.id : null;
                }

                // normal = plus grand est meilleur
                return n1 > n2 ? v1.id : n2 > n1 ? v2.id : null;
            }

            // Cas non numérique → pas d’avantage
            return null;
        };

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Caractéristiques</th>
                                {vehiculeSelectionnees.dataProd[0].vehicule.elements.map((vehicule) => (
                                    <th key={vehicule.id} className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center space-y-2">
                                            <img
                                                src={vehicule.image}
                                                alt={`${vehicule.marque} ${vehicule.modele}`}
                                                className="w-16 h-10 object-cover rounded"
                                            />
                                            <div className="text-sm font-medium text-gray-900">
                                                {vehicule.marque} {vehicule.modele}
                                            </div>
                                            <button
                                                onClick={() => retirerDeComparaison(vehicule.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehiculeSelectionnees.map((voiture) => {
                                const avantage = vehiculeSelectionnees.length === 2 ? obtenirAvantage(critere, vehiculeSelectionnees[0], vehiculeSelectionnees[1]) : null;
                                const aAvantage = avantage === voiture.id;
                                return (
                                    <td
                                        key={voiture.id}
                                        className={`px-6 py-4 text-center font-medium ${aAvantage ? "text-green-600" : "text-gray-900"
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {aAvantage && <Check className="w-4 h-4 text-green-500" />}
                                            <span>
                                                {critere.format
                                                    ? critere.format(voiture[critere.Key])
                                                    : voiture[critere.Key] ?? "-"}
                                            </span>
                                        </div>
                                    </td>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

    return (
        <div className="">
            <div className="relative flex flex-col items-center space-x-3  ">
                <div className="absolute h-[200px] space-y-6 flex flex-row border gap-10 p-8 bg-gray-100 rounded-3xl opacity-100 m-1 shadow-xl/30 ">
                    {/* Type */}
                    <div>
                        <label className="block font-semibold mb-1 mt-6">Type de véhicule</label>
                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setSelectedMarque("");
                                setSelectedModel("");
                                setSelectedCarburant("");
                            }}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white aniHover">
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
                        <label className="block font-semibold mb-1 mt-6">Marque</label>
                        <select
                            value={selectedMarque}
                            onChange={(e) => {
                                setSelectedMarque(e.target.value);
                                setSelectedModel("");
                                setSelectedCarburant("");
                            }}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white aniHover"
                        >
                            <option value="">Sélectionner une marque</option>
                            {filteredElements.map((el, index) => {
                                const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
                                return (
                                    <option key={index} value={marque}>
                                        {marque}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    {/* Modèle */}
                    <div>
                        <label className="block font-semibold mb-1 mt-6">Modèle</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white aniHover"
                        >
                            <option value="">Sélectionner le modèle</option>
                            {filteredElements
                                .filter((el) => {
                                    const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
                                    return marque === selectedMarque;
                                })
                                .map((el, index) => (
                                    <option key={index} value={getField(el, selectedType, "model") || getField(el, selectedType, "modele")}>
                                        {getField(el, selectedType, "model") || getField(el, selectedType, "modele") || "Aucun modèle"}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {/* Carburant */}
                    <div>
                        <label className="block font-semibold mb-1 mt-6">Carburant</label>
                        <select
                            value={selectedCarburant}
                            onChange={(e) => setSelectedCarburant(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-900 text-white"
                        >
                            <option value="">Sélectionner le carburant</option>
                            {filteredElements
                                .filter((el) => {
                                    const marque = getField(el, selectedType, "Marque") || getField(el, selectedType, "marque");
                                    const modele = getField(el, selectedType, "model") || getField(el, selectedType, "modele");
                                    return marque === selectedMarque && modele === selectedModel;
                                })
                                .map((el, index) => (
                                    <option key={index} value={getField(el, selectedType, "carburant")}>
                                        {getField(el, selectedType, "carburant") || ""}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className="mt-[15em] mb-10">
                    {(results.length === 0) ? (
                        <div className=" flex flex-col justify-center gap-2">
                            <h1 className="text-center font-extrabold text-xl text-gray-900 mb-4 text-shadow-xl text-shadow-gray-100">Selections les Vehicules</h1>
                            <div className=" flex flex-row justify-center gap-2 w-200 h-50">
                                <div className="hoverImg border border-2 decoration-gray-800 rounded-xl w-1/2 shadow-xl/30 ring-1 ring-gray-500" >
                                    <img src="/images/protection.png" alt="" className="w-50 h-50 object-cover mx-auto block p-2 opacity-70" />
                                </div>
                                <span><img src="/images/verifie.png" alt="" width="50" height="50" className="mx-auto block mt-20 p-2 opacity-50" /></span>
                                <div className="hoverImg border border-2 decoration-gray-800 rounded-xl w-1/2 shadow-xl/30 ring-1 ring-gray-500" >
                                    <img src="/images/protection.png" alt="" className="w-50 h-50 object-cover mx-auto block p-2 opacity-70" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="">
                                <div className="max-w-7xl mx-auto px-4 py-8">
                                    {/* En-tête */}
                                    <div className="flex justify-between items-center mb-8">
                                        <h1 className="text-left text-3xl m-1 font-bold text-2xl text-gray-900 mb-4 text-shadow-xl text-shadow-black-100 underline decoration-gray-900">
                                            {modeComparaison ? 'Comparaison de Voitures' : `Catalogue de ${selectedTypeData?.name}`}
                                        </h1>
                                        <div className="flex items-center space-x-4">
                                            {vehiculeSelectionnees.length > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">
                                                        {vehiculeSelectionnees.length}/2 sélectionnées
                                                    </span>
                                                    <button
                                                        onClick={viderSelection}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Vider
                                                    </button>
                                                </div>
                                            )}

                                            {!modeComparaison && vehiculeSelectionnees.length > 0 && (
                                                <button
                                                    onClick={() => setModeComparaison(true)}
                                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hoverMode transition-colors"
                                                >
                                                    Voir Comparaison
                                                </button>
                                            )}

                                            {modeComparaison && (
                                                <button
                                                    onClick={() => setModeComparaison(false)}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                                >
                                                    <ArrowLeft className="w-4 h-4" />
                                                    Retour au Catalogue
                                                </button>
                                            )}
                                            <div>
                                                <div className="flex flex-col w-70 m-1 p-1 bg-gray-500 rounded-xl botton-0">
                                                    <img src="/images/shopping-assistant.png" alt="" width={30} />
                                                    <h1 className="font-extrabold text-xl text-gray-700">Besoin d’un deuxième avis professionnel ?</h1>
                                                    <p className="text-gray-200 text-xs font-mono m-1">Nos experts en estimation sont disponibles 24h/24 et 7j/7 pour vous proposer une offre ferme et définitive en espèces pour votre véhicule.</p>
                                                    <button type="submit" className="bg-gray-700 text-gray-300 uppercase mt-3 m-1 rounded-xl py-2 font-bold">Parler a un expert</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Contenu principal */}
                                        {modeComparaison ? (
                                            <TableauComparaison />
                                        ) : (
                                            <div className="">
                                                <div className="grid grid-cols-3 gap-3  max-w-screen m-5">{results}</div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div >
    );
};

export default Filrage;
