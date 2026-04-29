import { useEffect, useState, useRef, useMemo } from "react"
import Header from "../Navbar/Header"
import { GoStar } from "react-icons/go";
import Footer from "../Navbar/Footer";
import { GiCarWheel } from "react-icons/gi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Reprise = () => {
    const steps = ["Vehicle Details", "Visite Technique", "Validation", "Valorisation"];

    const [currentStep, setCurrentStep] = useState(0);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const [validExpert, setValidExpert] = useState(false);

    const [reprise, setReprise] = useState({
        marque: '',
        model: '',
        categorie: '',
        matricule: '',
        annee: '',
        kilometrage: '',
        sieges: '',
        climatisation: '',
        peinture: '',
        carrosserie: '',
        eclairage: '',
        tableauBord: '',
        pneus: '',
        vitres: '',
        imageVehicule: null as File | null,
        imageBase64: '' as string,
        freins: '',
        moteur: '',
        batterie: '',
        boite_vitesse: '',
        propreteGenerale: '',
        equipElectroniques: '',
        date: '',
        time: ''
    });

    const [client, setClient] = useState({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        adresse: '',
        ville: ''
    });

    const imageUrl = useMemo(() =>
        reprise.imageVehicule ? URL.createObjectURL(reprise.imageVehicule) : null,
        [reprise.imageVehicule]
    );

    useEffect(() => {
        return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, [imageUrl]);

    const today = new Date().toISOString().split("T")[0];

    const isWeekend = (date: string) => {
        const d = new Date(date);
        const day = d.getDay();
        return day === 0 || day === 6;
    };

    const generateTimeSlots = (start: number, end: number, step = 30) => {
        const slots: string[] = [];
        for (let h = start; h < end; h++) {
            for (let m = 0; m < 60; m += step) {
                const hour = String(h).padStart(2, "0");
                const minute = String(m).padStart(2, "0");
                slots.push(`${hour}:${minute}`);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots(13, 18);

    const vehicleRequiredFields = [
        "marque", "model", "categorie", "matricule", "annee", "kilometrage",
        "sieges", "tableauBord", "equipElectroniques", "propreteGenerale",
        "climatisation", "peinture", "carrosserie", "eclairage", "pneus",
        "vitres", "moteur", "batterie", "boite_vitesse", "freins", "imageVehicule"
    ];

    const clientRequiredFields = ["nom", "prenom", "email", "phone", "adresse"];

    const handleNext = () => {
        if (currentStep === 0) {
            const newErrors: Record<string, string> = {};
            vehicleRequiredFields.forEach((field) => {
                const value = reprise[field as keyof typeof reprise];
                if (
                    (field === "imageVehicule" && value === null) ||
                    (field !== "imageVehicule" && String(value).trim() === "")
                ) {
                    newErrors[field] = "remplissez ce champ";
                }
            });
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                document.querySelector(".error")?.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }

        if (currentStep === 1) {
            const newErrors: Record<string, string> = {};
            clientRequiredFields.forEach((field) => {
                const value = client[field as keyof typeof client];
                if (!value.trim()) {
                    newErrors[field] = "remplissez ce champ";
                }
            });
            if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
                newErrors.email = "Email invalide";
            }
            if (client.phone && !/^[0-9]{10}$/.test(client.phone)) {
                newErrors.phone = "10 chiffres requis";
            }
            if (!reprise.date) newErrors.date = "choisissez une date";
            if (!reprise.time) newErrors.time = "choisissez un créneau";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                document.querySelector(".error")?.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }

        setCurrentStep((s) => Math.min(s + 1, 3));
    };

    const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const setField = (field: string, value: any, type = "reprise") => {
        if (type === "reprise") {
            setReprise((prev) => ({ ...prev, [field]: value }));
        } else {
            setClient((prev) => ({ ...prev, [field]: value }));
        }
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleImageChange = (file: File) => {
        setField("imageVehicule", file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setField("imageBase64", e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const Err = ({ field }: { field: string }) =>
        errors[field] ? (
            <span className="error bg-red-500 text-white text-xs w-60 p-1">{errors[field]}</span>
        ) : null;

    const calculatePrice = () => {
        let base = 100000;
        const year = Number(reprise.annee);
        const km = Number(reprise.kilometrage);

        base -= Math.max(0, (2025 - year)) * 3000;

        if (km > 200000) base -= 20000;
        else if (km > 150000) base -= 15000;
        else if (km > 100000) base -= 8000;

        if (reprise.peinture === "Rayures-profondes") base -= 10000;
        else if (reprise.peinture === "Repeinte") base -= 5000;

        if (reprise.moteur === "Fuite") base -= 25000;
        else if (reprise.moteur === "Bruit-suspect") base -= 15000;

        if (reprise.carrosserie === "Gros-accident") base -= 20000;
        else if (reprise.carrosserie === "Petits-chocs") base -= 5000;

        return Math.max(base, 10000);
    };

    const printpdf = useRef<HTMLDivElement | null>(null);

    // ─── PDF GENERATION (FIXED) ───────────────────────────────────────────────
    const generatePDF = async () => {
        try {
            const element = printpdf.current;
            if (!element) return;

            // Attendre que le DOM soit stable
            await new Promise((resolve) => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                // FIX PRINCIPAL : remplacer les blob: URL par base64 dans le clone
                onclone: (_clonedDoc, clonedElement) => {
                    const imgs = clonedElement.querySelectorAll("img");
                    imgs.forEach((img) => {
                        if (img.src.startsWith("blob:") && reprise.imageBase64) {
                            img.src = reprise.imageBase64;
                        }
                    });
                    // Forcer les styles inline pour que Tailwind soit rendu
                    clonedElement.style.backgroundColor = "#ffffff";
                    clonedElement.style.color = "#111827";
                    clonedElement.style.fontFamily = "sans-serif";
                    clonedElement.style.padding = "24px";
                    clonedElement.style.width = "794px"; // A4 width en px à 96dpi
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`rendez-vous-${client.nom || "client"}-${Date.now()}.pdf`);
        } catch (error) {
            console.error("Erreur génération PDF :", error);
            alert("Erreur lors de la génération du PDF. Réessayez.");
        }
    };

    return (
        <div>
            <div className="h-16 bg-black">
                <Header />
            </div>
            <div className="flex flex-row justify-between">
                <div>
                    <h1 className="w-180 text-shadow-xl m-1 mb-2 mt-8 bg-linear-to-r from-gray-500 to-gray-900 bg-clip-text text-5xl font-extrabold text-transparent text-shadow-xl text-shadow-black">
                        Reprise du votre vehicule Chez <span>MOTO</span>
                    </h1>
                    <p className="text-start text-md font-mono text-gray-900 w-180 p-3">
                        Profitez de notre service de reprise rapide, transparent et sans engagement : obtenez une estimation juste basée sur l'état réel de votre voiture, sans stress ni perte de temps.
                    </p>
                </div>
                <div className="flex flex-col w-70 m-1 p-1 bg-gray-500 rounded-xl animate-bouncing fixed right-0 top-18">
                    <img src="/images/shopping-assistant.png" alt="" width={30} />
                    <h1 className="font-extrabold text-xl text-gray-700">Besoin d'un deuxième avis professionnel ?</h1>
                    <p className="text-gray-200 text-xs font-mono m-1">
                        Nos experts en estimation sont disponibles 24h/24 et 7j/7 pour vous proposer une offre ferme et définitive en espèces pour votre véhicule.
                    </p>
                    <button type="button" className="bg-gray-700 text-gray-300 uppercase mt-3 m-1 rounded-xl py-2 font-bold">
                        Parler a un expert
                    </button>
                </div>
            </div>

            {/* Stepper */}
            <div className="m-1">
                <div className="flex items-center mb-10 mt-6">
                    {steps.map((label, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-300 
                                ${i === currentStep ? "bg-gray-900 text-white" : i < currentStep ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"}`}>
                                {i < currentStep ? "✓" : i + 1}
                            </div>
                            <span className={`ml-2 text-xs font-semibold uppercase tracking-widest whitespace-nowrap
                                ${i === currentStep ? "text-gray-900 font-bold" : i < currentStep ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}`}>
                                {label}
                            </span>
                            {i < steps.length && (
                                <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${i < currentStep ? "bg-gray-800" : "bg-gray-200"}`} />
                            )}
                            <div>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${i < currentStep ? "bg-gray-800" : "bg-gray-200"}`} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {/* ─── ÉTAPE 0 : Détails véhicule ─── */}
                {currentStep === 0 && (
                    <div>
                        <div className="flex flex-col">
                            <h1 className="font-extrabold text-gray-900 m-1">Details Generale :</h1>
                            <div className="cursor-pointer w-200 h-20 flex flex-col justify-center items-center gap-2">
                                <div>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            className="w-70 h-32 object-cover rounded-md m-1 mb-8"
                                            onClick={() => {
                                                setField("imageVehicule", null);
                                                setField("imageBase64", "");
                                            }}
                                            alt="Véhicule"
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleImageChange(e.target.files[0]);
                                            }}
                                        />
                                    )}
                                </div>
                                <Err field="imageVehicule" />
                            </div>

                            <div className="m-1 ml-30">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="immatriculation">Immatriculation</label>
                                        <input type="text" id="immatriculation" value={reprise.matricule} onChange={(e) => setField("matricule", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="1234-AB-56" />
                                        <Err field="matricule" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="categ">Type du Vehicule</label>
                                        <select id="categ" className="w-60 bg-gray-200 p-1 rounded-sm" value={reprise.categorie} onChange={(e) => setField("categorie", e.target.value)}>
                                            <option value="" disabled>Type du Vehicule</option>
                                            <option value="voiture">Voitures</option>
                                            <option value="moto">Motors</option>
                                            <option value="velo">Velos</option>
                                        </select>
                                        <Err field="categorie" />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="marqueR">Marque</label>
                                        <input type="text" id="marqueR" value={reprise.marque} onChange={(e) => setField("marque", e.target.value)} placeholder="Peugeot, BMW, ..." className="w-60 bg-gray-200 p-1 rounded-sm" />
                                        <Err field="marque" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="modelR">Model</label>
                                        <input type="text" id="modelR" value={reprise.model} onChange={(e) => setField("model", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="208, C1, ..." />
                                        <Err field="model" />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="kilomR">Kilometrage</label>
                                        <input type="number" id="kilomR" value={reprise.kilometrage} onChange={(e) => setField("kilometrage", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="123409" min="0" />
                                        <Err field="kilometrage" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="anneR">Annee</label>
                                        <select id="anneR" value={reprise.annee} onChange={(e) => setField("annee", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Annee</option>
                                            {Array.from({ length: 2026 - 2000 + 1 }, (_, i) => {
                                                const annee = 2026 - i;
                                                return <option key={annee} value={annee}>{annee}</option>;
                                            })}
                                        </select>
                                        <Err field="annee" />
                                    </div>
                                </div>
                            </div>

                            <h1 className="font-extrabold text-gray-900 m-1">Etat interieur :</h1>
                            <div className="m-1 ml-30">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="sieges">Sieges</label>
                                        <select id="sieges" value={reprise.sieges} onChange={(e) => setField("sieges", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Sieges</option>
                                            <option value="propre">Propre</option>
                                            <option value="Use">Usé</option>
                                            <option value="dechire">Déchiré</option>
                                        </select>
                                        <Err field="sieges" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="tableauBord">Tableau de bord</label>
                                        <select id="tableauBord" value={reprise.tableauBord} onChange={(e) => setField("tableauBord", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Tableau de bord</option>
                                            <option value="fonctionne">Fonctionne</option>
                                            <option value="raye">Rayé</option>
                                            <option value="no-fonctionne">Ne fonctionne pas</option>
                                        </select>
                                        <Err field="tableauBord" />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="equipElectroniques">Équipements électroniques</label>
                                        <select id="equipElectroniques" value={reprise.equipElectroniques} onChange={(e) => setField("equipElectroniques", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Équipements électroniques</option>
                                            <option value="radio-ok">Radio OK</option>
                                            <option value="ecran-tactile-ok">Écran tactile OK</option>
                                            <option value="no">Aucun</option>
                                        </select>
                                        <Err field="equipElectroniques" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="propreteGenerale">Propreté générale</label>
                                        <select id="propreteGenerale" value={reprise.propreteGenerale} onChange={(e) => setField("propreteGenerale", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Propreté générale</option>
                                            <option value="tres-propre">Très propre</option>
                                            <option value="propre">Propre</option>
                                            <option value="sale">Sale</option>
                                        </select>
                                        <Err field="propreteGenerale" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="climatisation">Climatisation</label>
                                    <select id="climatisation" value={reprise.climatisation} onChange={(e) => setField("climatisation", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                        <option value="" disabled>Climatisation</option>
                                        <option value="fonctionne">Fonctionne</option>
                                        <option value="faible">Faible</option>
                                        <option value="no-fonctionne">Ne fonctionne pas</option>
                                    </select>
                                    <Err field="climatisation" />
                                </div>
                            </div>

                            <h1 className="font-extrabold text-gray-900 m-1">Etat exterieur :</h1>
                            <div className="m-1 ml-30">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="peinture">Peinture</label>
                                        <select id="peinture" value={reprise.peinture} onChange={(e) => setField("peinture", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Peinture</option>
                                            <option value="Neuve">Neuve</option>
                                            <option value="Rayures-légères">Rayures légères</option>
                                            <option value="Rayures-profondes">Rayures profondes</option>
                                            <option value="Repeinte">Repeinte</option>
                                        </select>
                                        <Err field="peinture" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="carrosserie">Carrosserie</label>
                                        <select id="carrosserie" className="w-60 bg-gray-200 p-1 rounded-sm" value={reprise.carrosserie} onChange={(e) => setField("carrosserie", e.target.value)}>
                                            <option value="" disabled>Carrosserie</option>
                                            <option value="Aucun-choc">Aucun choc</option>
                                            <option value="Petits-chocs">Petits chocs</option>
                                            <option value="Gros-accident">Gros accident</option>
                                        </select>
                                        <Err field="carrosserie" />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="eclairage">Éclairage</label>
                                        <select id="eclairage" value={reprise.eclairage} onChange={(e) => setField("eclairage", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Éclairage</option>
                                            <option value="Tous-fonctionnent">Tous fonctionnent</option>
                                            <option value="Quelques-défaillances">Quelques défaillances</option>
                                        </select>
                                        <Err field="eclairage" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="pneus">Pneus</label>
                                        <select id="pneus" value={reprise.pneus} onChange={(e) => setField("pneus", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Pneus</option>
                                            <option value="Neufs">Neufs</option>
                                            <option value="Moyens">Moyens</option>
                                            <option value="Usés">Usés</option>
                                        </select>
                                        <Err field="pneus" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="vitres">Vitres</label>
                                    <select id="vitres" value={reprise.vitres} onChange={(e) => setField("vitres", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                        <option value="" disabled>Vitres</option>
                                        <option value="Intactes">Intactes</option>
                                        <option value="Fissures">Fissures</option>
                                        <option value="Cassées">Cassées</option>
                                    </select>
                                    <Err field="vitres" />
                                </div>
                            </div>

                            <h1 className="font-extrabold text-gray-900 m-1">État mécanique :</h1>
                            <div className="m-1 ml-30">
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="moteur">Moteur</label>
                                        <select id="moteur" value={reprise.moteur} onChange={(e) => setField("moteur", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Moteur</option>
                                            <option value="Bon-état">Bon état</option>
                                            <option value="Bruit-suspect">Bruit suspect</option>
                                            <option value="Fuite">Fuite</option>
                                        </select>
                                        <Err field="moteur" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="batterie">Batterie</label>
                                        <select id="batterie" value={reprise.batterie} onChange={(e) => setField("batterie", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Batterie</option>
                                            <option value="Neuve">Neuve</option>
                                            <option value="faible">Faible</option>
                                        </select>
                                        <Err field="batterie" />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="boite_vitesse">Boîte de vitesse</label>
                                        <select id="boite_vitesse" value={reprise.boite_vitesse} onChange={(e) => setField("boite_vitesse", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Boîte de vitesse</option>
                                            <option value="Normale">Normale</option>
                                            <option value="Automatique">Automatique</option>
                                            <option value="no-fonctionne">Ne fonctionne pas</option>
                                        </select>
                                        <Err field="boite_vitesse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="freins">Freins</label>
                                        <select id="freins" value={reprise.freins} onChange={(e) => setField("freins", e.target.value)} className="w-60 bg-gray-200 p-1 rounded-sm">
                                            <option value="" disabled>Freins</option>
                                            <option value="Bons">Bons</option>
                                            <option value="Usés">Usés</option>
                                        </select>
                                        <Err field="freins" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ÉTAPE 1 : Informations client + RDV ─── */}
                {currentStep === 1 && (
                    <div className="w-full max-w-2xl">
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Informations personnelles</h1>
                        <div className="flex flex-row justify-center items-center gap-4">
                            <div className="flex flex-col mb-4">
                                <label htmlFor="nom" className="text-gray-900">Nom</label>
                                <input type="text" id="nom" className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="Nom..." value={client.nom} onChange={e => setField("nom", e.target.value, "client")} />
                                <Err field="nom" />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="prenom" className="text-gray-900">Prenom</label>
                                <input type="text" id="prenom" className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="Prenom..." value={client.prenom} onChange={e => setField("prenom", e.target.value, "client")} />
                                <Err field="prenom" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-4">
                            <div className="flex flex-col mb-4">
                                <label htmlFor="email" className="text-gray-900">Email</label>
                                <input type="email" id="email" className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="Email..." value={client.email} onChange={e => setField("email", e.target.value, "client")} />
                                <Err field="email" />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="adresse" className="text-gray-900">Adresse</label>
                                <input type="text" id="adresse" className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="Adresse..." value={client.adresse} onChange={e => setField("adresse", e.target.value, "client")} />
                                <Err field="adresse" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="phone" className="text-gray-900">Telephone</label>
                                <input type="tel" id="phone" className="w-60 bg-gray-200 p-1 rounded-sm" placeholder="0612345678" value={client.phone} onChange={e => setField("phone", e.target.value, "client")} />
                                <Err field="phone" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="ville">Ville</label>
                                <select id="ville" className="w-60 bg-gray-200 p-1 rounded-sm" value={client.ville} onChange={e => setField("ville", e.target.value, "client")}>
                                    <option value="" disabled>Sélectionnez une ville</option>
                                    <option value="Tanger">Tanger</option>
                                    <option value="Tetouan">Tetouan</option>
                                    <option value="Larach">Larach</option>
                                </select>
                                <Err field="ville" />
                            </div>
                        </div>

                        <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4">Date et l'heure</h1>
                        <div className="border border-gray-700 bg-gray-600 rounded-xl mb-4 ml-22 pt-1 w-120">
                            <span className="top-0 right-0 text-white font-bold mb-4 mt-1 bg-gray-900 rounded-xl p-1">Expert</span>
                            <div className="mb-2 mt-2 flex flex-row items-center gap-2">
                                <span className="bg-gray-200 p-2 m-2 text-lg font-bold rounded-full">AI</span>
                                <div className="m-2 flex flex-col gap-1">
                                    <h1 className="font-bold text-gray-400">ACHIBANI Ilyass</h1>
                                    <span className="text-sm font-thin">Expert Automobile</span>
                                    <span>Mecanique . carroserie . Electronique</span>
                                    <div className="flex flex-row gap-4">
                                        <span className="bg-green-500 w-17 text-white text-xs font-bold p-1 rounded-full">Disponible</span>
                                        <span className="flex flex-row"><GoStar className="text-yellow-600 pt-2" /> <span className="font-bold">4.9</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row justify-center items-center gap-4 mb-4">
                            <div className="flex flex-col">
                                <label htmlFor="datetime" className="text-gray-900">Date</label>
                                <input
                                    type="date"
                                    value={reprise.date}
                                    min={today}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!isWeekend(value)) {
                                            alert("Veuillez choisir samedi ou dimanche uniquement !");
                                            return;
                                        }
                                        setField("date", value);
                                    }}
                                    className="bg-gray-200 p-2 w-full"
                                />
                                <Err field="date" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="time" className="text-gray-900">Creneau Horaire</label>
                                <select
                                    value={reprise.time}
                                    onChange={(e) => setField("time", e.target.value)}
                                    className="bg-gray-200 p-2 w-full"
                                >
                                    <option value="">Choisir une heure</option>
                                    {timeSlots.map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                <Err field="time" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ÉTAPE 2 : Récapitulatif ─── */}
                {currentStep === 2 && (
                    <div>
                        {/* Zone capturée par html2canvas — styles inline pour garantir le rendu PDF */}
                        <div
                            ref={printpdf}
                            className="mb-4"
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#111827",
                                fontFamily: "sans-serif",
                                padding: "24px",
                                maxWidth: "794px"
                            }}
                        >
                            <div style={{
                                textAlign: "center",
                                background: "linear-gradient(to right, #4ade80, #166534)",
                                padding: "24px 32px",
                                borderRadius: "9999px",
                                marginBottom: "16px"
                            }}>
                                <h3 style={{ color: "#ffffff", fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                                    Récapitulatif du rendez-vous
                                </h3>
                            </div>
                            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                                Vérifiez vos informations avant de confirmer
                            </p>

                            <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                                {/* Image + icône véhicule */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    backgroundColor: "#f9fafb",
                                    border: "2px solid #f3f4f6",
                                    borderRadius: "16px",
                                    padding: "16px"
                                }}>
                                    <div style={{
                                        width: "56px",
                                        height: "56px",
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #4ade80, #166534)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0
                                    }}>
                                        <GiCarWheel color="white" size={24} />
                                    </div>
                                    {/* FIX : toujours utiliser imageBase64 dans la zone PDF */}
                                    {reprise.imageBase64 && (
                                        <img
                                            src={reprise.imageBase64}
                                            style={{ width: "96px", height: "64px", objectFit: "cover", borderRadius: "8px" }}
                                            alt="Véhicule"
                                        />
                                    )}
                                </div>

                                {/* Infos client */}
                                <div style={{ textAlign: "start" }}>
                                    <h1 style={{ color: "#111827", fontWeight: "bold", marginBottom: "6px" }}>Informations Client :</h1>
                                    {[
                                        ["Nom", client?.nom],
                                        ["Prénom", client?.prenom],
                                        ["Email", client?.email],
                                        ["Téléphone", client?.phone],
                                        ["Adresse", client?.adresse],
                                        ["Ville", client?.ville],
                                    ].map(([label, val]) => (
                                        <p key={label} style={{ color: "#6b7280", fontSize: "14px", margin: "2px 0" }}>
                                            {label} : {val}
                                        </p>
                                    ))}
                                </div>

                                {/* Date & heure */}
                                <div style={{ textAlign: "start", borderTop: "1px solid #d1d5db", paddingTop: "12px" }}>
                                    <h1 style={{ color: "#111827", fontWeight: "bold", marginBottom: "6px" }}>Rendez-vous :</h1>
                                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "2px 0" }}>Date : {reprise?.date}</p>
                                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "2px 0" }}>Heure : {reprise?.time}</p>
                                </div>

                                {/* Infos véhicule */}
                                <div style={{ textAlign: "start", borderTop: "1px solid #d1d5db", paddingTop: "12px" }}>
                                    <h1 style={{ color: "#111827", fontWeight: "bold", marginBottom: "6px" }}>Informations sur le véhicule :</h1>
                                    {[
                                        ["Marque", reprise?.marque],
                                        ["Modèle", reprise?.model],
                                        ["Année", reprise?.annee],
                                        ["Catégorie", reprise?.categorie],
                                        ["Matricule", reprise?.matricule],
                                        ["Kilométrage", reprise?.kilometrage],
                                        ["Tableau de bord", reprise?.tableauBord],
                                        ["Propreté générale", reprise?.propreteGenerale],
                                        ["Peinture", reprise?.peinture],
                                        ["Pneus", reprise?.pneus],
                                        ["Vitres", reprise?.vitres],
                                        ["Moteur", reprise?.moteur],
                                        ["Batterie", reprise?.batterie],
                                        ["Boîte de vitesse", reprise?.boite_vitesse],
                                        ["Équipement électronique", reprise?.equipElectroniques],
                                        ["Carrosserie", reprise?.carrosserie],
                                        ["Climatisation", reprise?.climatisation],
                                        ["Éclairage", reprise?.eclairage],
                                        ["Freins", reprise?.freins],
                                    ].map(([label, val]) => (
                                        <p key={label} style={{ color: "#6b7280", fontSize: "14px", margin: "2px 0" }}>
                                            {label} : {val}
                                        </p>
                                    ))}
                                </div>

                                {/* Notice */}
                                <div style={{
                                    backgroundColor: "#eff6ff",
                                    border: "1px solid #dbeafe",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "flex-start"
                                }}>
                                    <span style={{ fontSize: "20px", flexShrink: 0 }}>ℹ️</span>
                                    <p style={{ color: "#1d4ed8", fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
                                        Présentez-vous <strong>10 min avant</strong> avec votre <strong>carte grise originale</strong>,
                                        votre <strong>CIN</strong> et les <strong>clés du véhicule</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-3 mt-2">
                            <p className="text-sm text-gray-600">
                                Téléchargez votre rendez-vous en PDF pour le présenter à l'expert le jour J.
                            </p>
                            <button
                                type="button"
                                onClick={generatePDF}
                                className="m-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded transition-all"
                            >
                                Obtenir PDF
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── ÉTAPE 3 : Valorisation ─── */}
                {currentStep === 3 && validExpert && (
                    <div className="p-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-900 text-white p-6 rounded-xl text-center">
                            <h1 className="text-2xl font-bold mb-2">💰 Valorisation de votre véhicule</h1>
                            <p className="text-sm">Estimation après validation de l'expert</p>
                        </div>
                        <div className="mt-6 bg-gray-100 p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Résultat :</h2>
                            <p className="text-lg text-gray-700">
                                Valeur estimée :
                                <span className="font-bold text-green-600 ml-2">
                                    {calculatePrice().toLocaleString("fr-MA")} DH
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Boutons de navigation */}
            <div className="flex gap-3 m-2 mb-3">
                {currentStep > 0 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                    >
                        ← Retour
                    </button>
                )}

                {currentStep < 2 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="px-7 py-3 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-blue-700 transition-all"
                    >
                        {currentStep === 0 ? "Enregistrer & Continuer →" : "Continuer →"}
                    </button>
                )}

                {currentStep === 2 && (
                    <button
                        type="button"
                        onClick={() => {
                            setTimeout(() => {
                                setValidExpert(true);
                                setCurrentStep(3);
                            }, 1000);
                        }}
                        className="px-7 py-3 rounded-lg bg-green-500 text-white font-bold text-sm hover:bg-green-700 transition-all"
                    >
                        Valider par expert →
                    </button>
                )}

                {currentStep === 3 && validExpert && (
                    <button
                        type="button"
                        onClick={() => alert("Reprise terminée avec succès ✅")}
                        className="px-7 py-3 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-800 transition-all"
                    >
                        Terminer
                    </button>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Reprise;
