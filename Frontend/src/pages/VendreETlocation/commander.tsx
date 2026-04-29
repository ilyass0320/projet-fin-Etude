import { useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────
const required = (v) => (v && v.toString().trim() !== "" ? null : "Champ requis");
const emailOk = (v) => (/\S+@\S+\.\S+/.test(v) ? null : "Email invalide");
const phoneOk = (v) => (/^\+?\d{9,15}$/.test(v.replace(/\s/g, "")) ? null : "Numéro invalide");

// ─── base components ─────────────────────────────────────────────────────────
function Field({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-widest uppercase text-gray-400">{label}</label>
            {children}
            {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
        </div>
    );
}

function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`bg-white border border-blue-400 rounded-lg px-4 py-2.5 text-gray-900 text-sm
        placeholder-gray-300 focus:outline-none focus:border-gray-700 focus:ring-2
        focus:ring-gray-100 transition ${className}`}
        />
    );
}

function AppSelect({ className = "", children, ...props }) {
    return (
        <select
            {...props}
            className={`bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm
        focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition ${className}`}
        >
            {children}
        </select>
    );
}

function RadioCard({ checked, onChange, title, desc, price, value, name }) {
    return (
        <label
            className={`cursor-pointer flex gap-4 items-start border rounded-xl p-5 transition-all duration-200 ${checked
                ? "border-gray-900 bg-gray-50 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
        >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${checked ? "border-gray-900" : "border-gray-300"
                }`}>
                {checked && <div className="w-2 h-2 rounded-full bg-gray-900" />}
            </div>
            <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="hidden" />
            <div className="flex-1">
                <p className={`font-semibold text-sm ${checked ? "text-gray-900" : "text-gray-600"}`}>{title}</p>
                {desc && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>}
                {price !== undefined && price !== null && (
                    <p className={`text-sm font-bold mt-2 ${price === 0 ? "text-gray-400" : "text-gray-800"}`}>
                        {price === 0 ? "Gratuit" : `${price.toLocaleString()} DH`}
                    </p>
                )}
            </div>
        </label>
    );
}

function Btn({ children, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-700
        disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm
        tracking-wide transition-all duration-200 mt-6
        shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_28px_rgba(0,0,0,0.25)]"
        >
            {children}
        </button>
    );
}

// ─── STEP 0 ───────────────────────────────────────────────────────────────────
function StepInfos({ data, setData, onNext }) {
    const [errors, setErrors] = useState({});
    const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

    const validate = () => {
        const e = {};
        if (required(data.nom)) e.nom = required(data.nom);
        if (required(data.prenom)) e.prenom = required(data.prenom);
        if (required(data.dateNaissance)) e.dateNaissance = required(data.dateNaissance);
        const telErr = required(data.telephone) || phoneOk(data.telephone);
        if (telErr) e.telephone = telErr;
        const emlErr = required(data.email) || emailOk(data.email);
        if (emlErr) e.email = emlErr;
        if (required(data.codePostal)) e.codePostal = required(data.codePostal);
        if (required(data.ville)) e.ville = required(data.ville);
        if (required(data.adresse)) e.adresse = required(data.adresse);
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return (
        <div className="flex flex-col gap-5">
            <Field label="Civilité">
                <AppSelect value={data.civilite} onChange={set("civilite")}>
                    <option value="Monsieur">Monsieur</option>
                    <option value="Madame">Madame</option>
                </AppSelect>
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Nom" error={errors.nom}>
                    <Input value={data.nom} onChange={set("nom")} placeholder="Dupont" />
                </Field>
                <Field label="Prénom" error={errors.prenom}>
                    <Input value={data.prenom} onChange={set("prenom")} placeholder="Jean" />
                </Field>
                <Field label="Date de naissance" error={errors.dateNaissance}>
                    <Input type="date" value={data.dateNaissance} onChange={set("dateNaissance")} />
                </Field>
                <Field label="Téléphone" error={errors.telephone}>
                    <Input value={data.telephone} onChange={set("telephone")} placeholder="+2126XXXXXXXX" />
                </Field>
                <Field label="Email" error={errors.email}>
                    <Input type="email" value={data.email} onChange={set("email")} placeholder="you@example.com" />
                </Field>
                <Field label="Code postal" error={errors.codePostal}>
                    <Input value={data.codePostal} onChange={set("codePostal")} placeholder="20000" />
                </Field>
                <Field label="Ville" error={errors.ville}>
                    <Input value={data.ville} onChange={set("ville")} placeholder="Casablanca" />
                </Field>
                <Field label="Pays">
                    <AppSelect value={data.pays} onChange={set("pays")}>
                        {["Maroc", "France", "Espagne", "Italie", "Allemagne", "Autre"].map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </AppSelect>
                </Field>
            </div>
            <Field label="Adresse" error={errors.adresse}>
                <Input value={data.adresse} onChange={set("adresse")} placeholder="123 rue de la Paix" />
            </Field>
            <Btn onClick={() => validate() && onNext()}>Continuer →</Btn>
        </div>
    );
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function StepReprise({ data, setData, onNext }) {
    const valid = data.reprise === "oui" || data.reprise === "non";
    return (
        <div className="flex flex-col gap-4">
            <RadioCard name="reprise" value="oui" checked={data.reprise === "oui"}
                onChange={() => setData(d => ({ ...d, reprise: "oui" }))}
                title="Commencer une reprise"
                desc="Notre équipe évalue votre ancien véhicule et déduit sa valeur du prix de votre commande."
                price={null} />
            <RadioCard name="reprise" value="non" checked={data.reprise === "non"}
                onChange={() => setData(d => ({ ...d, reprise: "non" }))}
                title="Continuer sans reprise"
                desc="Vous ne souhaitez pas faire reprendre votre ancien véhicule."
                price={0} />
            <Btn onClick={() => valid && onNext()} disabled={!valid}>Continuer →</Btn>
        </div>
    );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function StepLivraison({ data, setData, onNext }) {
    const valid = data.livraison === "domicile" || data.livraison === "agence";
    return (
        <div className="flex flex-col gap-4">
            <RadioCard name="livraison" value="domicile" checked={data.livraison === "domicile"}
                onChange={() => setData(d => ({ ...d, livraison: "domicile", fraisLivraison: 0 }))}
                title="Livraison à domicile"
                desc="Nous livrons votre véhicule à l'adresse indiquée. Gratuit jusqu'à 800 km, puis 20 DH/km au-delà."
                price={0} />
            <RadioCard name="livraison" value="agence" checked={data.livraison === "agence"}
                onChange={() => setData(d => ({ ...d, livraison: "agence", fraisLivraison: 0 }))}
                title="Retrait en agence"
                desc="Récupérez votre véhicule dans l'une de nos agences. L'adresse vous sera envoyée par email."
                price={0} />
            <Btn onClick={() => valid && onNext()} disabled={!valid}>Continuer →</Btn>
        </div>
    );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function StepImmat({ data, setData, onNext }) {
    const valid = data.immat === "simple" || data.immat === "complete";
    return (
        <div className="flex flex-col gap-4">
            <RadioCard name="immat" value="simple" checked={data.immat === "simple"}
                onChange={() => setData(d => ({ ...d, immat: "simple", fraisImmat: 0 }))}
                title="Préparation simple"
                desc="Nettoyage et entretien du véhicule uniquement, sans immatriculation."
                price={0} />
            <RadioCard name="immat" value="complete" checked={data.immat === "complete"}
                onChange={() => setData(d => ({ ...d, immat: "complete", fraisImmat: 500 }))}
                title="Préparation complète + Immatriculation"
                desc="Notre équipe vous accompagne dans la préparation des documents et l'immatriculation après livraison."
                price={500} />
            <Btn onClick={() => valid && onNext()} disabled={!valid}>Continuer →</Btn>
        </div>
    );
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function StepGarantie({ data, setData, onNext }) {
    const valid = data.garantie === "oui" || data.garantie === "non";
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Garantie Premium inclut :</p>
                <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    <li>Protection risques mécaniques &amp; électroniques</li>
                    <li>Visite technique tous les 2 mois</li>
                    <li>Lavage intérieur / extérieur</li>
                    <li>Préparation moteur</li>
                </ul>
            </div>
            <RadioCard name="garantie" value="oui" checked={data.garantie === "oui"}
                onChange={() => setData(d => ({ ...d, garantie: "oui", fraisGarantie: 500 }))}
                title="Garantie Premium — 12 mois"
                desc="Couverture complète de votre véhicule pendant 12 mois."
                price={500} />
            <RadioCard name="garantie" value="non" checked={data.garantie === "non"}
                onChange={() => setData(d => ({ ...d, garantie: "non", fraisGarantie: 0 }))}
                title="Sans garantie Premium"
                desc="Je préfère ne pas ajouter la garantie Premium."
                price={0} />
            <Btn onClick={() => valid && onNext()} disabled={!valid}>Continuer →</Btn>
        </div>
    );
}

// ─── STEP 5 ───────────────────────────────────────────────────────────────────
function StepPaiement({ data, setData, onNext }) {
    const valid = data.paiement === "cheque" || data.paiement === "virement";
    return (
        <div className="flex flex-col gap-4">
            <RadioCard name="paiement" value="cheque" checked={data.paiement === "cheque"}
                onChange={() => setData(d => ({ ...d, paiement: "cheque" }))}
                title="Chèque certifié à la livraison"
                desc="Remettez le paiement le jour de la livraison. Le chèque doit être certifié par votre banque." />
            <RadioCard name="paiement" value="virement" checked={data.paiement === "virement"}
                onChange={() => setData(d => ({ ...d, paiement: "virement" }))}
                title="Virement bancaire anticipé"
                desc="Réglez le montant total avant la livraison. Votre commande sera confirmée dès réception des fonds." />
            <Btn onClick={() => valid && onNext()} disabled={!valid}>Confirmer la commande →</Btn>
        </div>
    );
}

// ─── STEP 6 ───────────────────────────────────────────────────────────────────
function StepConfirmation({ orderData }) {
    const prixVehicule = 85000;
    const total = prixVehicule + (orderData.fraisImmat || 0) + (orderData.fraisGarantie || 0) + (orderData.fraisLivraison || 0);
    const [loading, setLoading] = useState(false);

    const exportPDF = async () => {
        setLoading(true);
        // Dynamically load jsPDF from CDN
        if (!window.jspdf) {
            await new Promise((resolve, reject) => {
                const s = document.createElement("script");
                s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const W = 210;
        const margin = 20;
        let y = 0;

        // ── header band ──────────────────────────────────────────────────────────
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, W, 38, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("MOTO SERVICE", margin, 17);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text("Bon de Commande", margin, 25);
        const dateStr = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
        doc.text(`Date : ${dateStr}`, W - margin, 25, { align: "right" });
        y = 50;

        // ── section helper ───────────────────────────────────────────────────────
        const sectionTitle = (label) => {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, y - 4, W - margin * 2, 8, "F");
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text(label.toUpperCase(), margin + 2, y + 1);
            y += 10;
        };

        const row = (label, value, highlight = false) => {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(120, 120, 120);
            doc.text(label, margin + 4, y);
            doc.setTextColor(highlight ? 20 : 50, highlight ? 20 : 50, highlight ? 20 : 50);
            doc.setFont("helvetica", highlight ? "bold" : "normal");
            doc.text(String(value), W - margin - 4, y, { align: "right" });
            y += 7;
        };

        const divider = () => {
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, y, W - margin, y);
            y += 5;
        };

        // ── Client ───────────────────────────────────────────────────────────────
        sectionTitle("Informations client");
        row("Civilité", orderData.civilite || "—");
        row("Nom & Prénom", `${orderData.nom || ""} ${orderData.prenom || ""}`.trim() || "—");
        row("Date de naissance", orderData.dateNaissance || "—");
        row("Téléphone", orderData.telephone || "—");
        row("Email", orderData.email || "—");
        row("Adresse", `${orderData.adresse || ""}, ${orderData.codePostal || ""} ${orderData.ville || ""}, ${orderData.pays || ""}`.trim());
        y += 3;
        divider();

        // ── Véhicule ─────────────────────────────────────────────────────────────
        sectionTitle("Véhicule commandé");
        row("Modèle", "Marque · Modèle");
        row("Année / Carburant / Km", "2023 · Essence · 12 000 km");
        row("Prix véhicule", `${prixVehicule.toLocaleString("fr-FR")} DH`);
        y += 3;
        divider();

        // ── Options ──────────────────────────────────────────────────────────────
        sectionTitle("Options & Services");
        const repriseLabel = orderData.reprise === "oui" ? "Avec reprise" : "Sans reprise";
        row("Reprise", repriseLabel);
        const livraisonLabel = orderData.livraison === "domicile" ? "Livraison à domicile" : "Retrait en agence";
        row("Livraison", livraisonLabel);
        row("Frais livraison", orderData.fraisLivraison === 0 ? "Gratuit" : `${(orderData.fraisLivraison || 0).toLocaleString("fr-FR")} DH`);
        const immatLabel = orderData.immat === "complete" ? "Préparation complète + Immatriculation" : "Préparation simple";
        row("Préparation", immatLabel);
        row("Frais préparation", orderData.fraisImmat === 0 ? "Gratuit" : `${(orderData.fraisImmat || 0).toLocaleString("fr-FR")} DH`);
        const garantieLabel = orderData.garantie === "oui" ? "Garantie Premium 12 mois" : "Sans garantie Premium";
        row("Garantie", garantieLabel);
        row("Frais garantie", orderData.fraisGarantie === 0 ? "Gratuit" : `${(orderData.fraisGarantie || 0).toLocaleString("fr-FR")} DH`);
        y += 3;
        divider();

        // ── Paiement ─────────────────────────────────────────────────────────────
        sectionTitle("Paiement");
        const paiementLabel = orderData.paiement === "cheque" ? "Chèque certifié à la livraison" : "Virement bancaire anticipé";
        row("Mode de paiement", paiementLabel);
        y += 3;
        divider();

        // ── Total ────────────────────────────────────────────────────────────────
        doc.setFillColor(20, 20, 20);
        doc.rect(margin, y - 2, W - margin * 2, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL", margin + 4, y + 5.5);
        doc.text(`${total.toLocaleString("fr-FR")} DH`, W - margin - 4, y + 5.5, { align: "right" });
        y += 20;

        // ── footer ───────────────────────────────────────────────────────────────
        doc.setTextColor(180, 180, 180);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text("Ce document est un récapitulatif de votre commande. Moto Service — contact@motoservice.ma", W / 2, 285, { align: "center" });

        doc.save(`commande_${orderData.nom || "client"}_${orderData.prenom || ""}.pdf`);
        setLoading(false);
    };

    const rows = [
        ["Prix véhicule", prixVehicule],
        ["Immatriculation", orderData.fraisImmat || 0],
        ["Garantie", orderData.fraisGarantie || 0],
        ["Livraison", orderData.fraisLivraison || 0],
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-200 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h2 className="text-gray-900 font-bold text-xl">Commande confirmée !</h2>
                <p className="text-gray-400 text-sm mt-1">
                    Récapitulatif envoyé à{" "}
                    <span className="text-gray-700 font-medium">{orderData.email}</span>
                </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
                {rows.map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-400">{label}</span>
                        <span className={val === 0 ? "text-gray-300" : "text-gray-700 font-medium"}>
                            {val === 0 ? "Gratuit" : `${val.toLocaleString()} DH`}
                        </span>
                    </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-sm">
                    <span className="text-gray-700">Total</span>
                    <span className="text-gray-900">{total.toLocaleString()} DH</span>
                </div>
            </div>
            <button onClick={exportPDF} disabled={loading}
                className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700
          font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50
          shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
                {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                )}
                {loading ? "Génération en cours…" : "Télécharger le bon de commande (PDF)"}
            </button>
        </div>
    );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Summary({ data, step }) {
    const prixVehicule = 85000;
    const total = prixVehicule + (data.fraisImmat || 0) + (data.fraisGarantie || 0) + (data.fraisLivraison || 0);
    const items = [
        { label: "Véhicule", val: prixVehicule, always: true },
        { label: "Livraison", val: data.fraisLivraison, show: step >= 3 },
        { label: "Immatriculation", val: data.fraisImmat, show: step >= 4 },
        { label: "Garantie", val: data.fraisGarantie, show: step >= 5 },
    ];

    return (
        <div className="flex flex-col gap-4 w-72 flex-shrink-0">
            <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-200 shadow-sm">
                <div className="bg-gray-500 text-white text-center border-b border-gray-500 px-4 py-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Votre véhicule
                </div>
                <div className="p-4">
                    <div className="bg-gray-white text-white rounded-lg h-28 flex items-center justify-center text-3xl mb-3 border border-gray-100">
                        image
                    </div>
                    <p className="font-bold text-gray-200 text-sm">Marque · Modèle</p>
                    <p className="text-gray-400 text-xs mt-1">2023 · Essence · 12 000 km</p>
                </div>
            </div>
            <div className="rounded-xl bg-gray-700 border border-gray-200 p-4 space-y-2 shadow-sm">
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Récapitulatif</p>
                {items.filter(i => i.always || i.show).map(({ label, val }) => (
                    <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-400">{label}</span>
                        <span className={!val ? "text-gray-300" : "text-gray-700 font-medium"}>
                            {!val ? "Gratuit" : `+${val.toLocaleString()} DH`}
                        </span>
                    </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-gray-500">Total estimé</span>
                    <span className="text-gray-900">{total.toLocaleString()} DH</span>
                </div>
            </div>
        </div>
    );
}

// ─── STEP BAR ─────────────────────────────────────────────────────────────────
const STEPS = ["Informations", "Reprise", "Livraison", "Préparation", "Garantie", "Paiement", "Confirmation"];

function StepBar({ current }) {
    return (
        <div className="flex items-center mb-8 overflow-x-auto pb-1 gap-0">
            {STEPS.map((label, i) => (
                <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${i < current ? "bg-gray-900 text-white" :
                            i === current ? "bg-gray-900 border-2 border-gray-400 text-gray-100" :
                                "bg-gray-100 text-gray-400 border border-gray-200"
                            }`}>
                            {i < current ? "✓" : i + 1}
                        </div>
                        <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${i === current ? "text-gray-500" : i < current ? "text-gray-500" : "text-gray-300"
                            }`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`h-[1px] w-5 mx-1 mb-4 flex-shrink-0 transition-all ${i < current ? "bg-gray-600" : "bg-gray-200"
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── TITLES & MAIN ────────────────────────────────────────────────────────────
const TITLES = [
    "Vos informations", "Reprise de véhicule", "Mode de livraison",
    "Préparation & Immatriculation", "Garantie", "Paiement", "Commande confirmée",
];

export default function Commander() {
    const [step, setStep] = useState(0);
    const [infos, setInfos] = useState({ civilite: "Monsieur", pays: "Maroc", nom: "", prenom: "", dateNaissance: "", telephone: "", email: "", codePostal: "", ville: "", adresse: "" });
    const [reprise, setReprise] = useState({});
    const [livraison, setLivraison] = useState({});
    const [immat, setImmat] = useState({});
    const [garantie, setGarantie] = useState({});
    const [paiement, setPaiement] = useState({});

    const orderData = { ...infos, ...reprise, ...livraison, ...immat, ...garantie, ...paiement };
    const next = () => setStep(s => s + 1);

    return (
        <div className="min-h-screen bg-gray-900 flex items-start justify-center p-6 pt-10"
            style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

            {/* subtle depth blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gray-600 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-600 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-5xl relative z-10">
                {/* badge */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-400 border border-gray-600 rounded-full
            px-4 py-1.5 text-gray-400 text-xs font-semibold tracking-widest uppercase shadow-sm">
                        Moto Service — Commande
                    </div>
                </div>

                <div className="flex flex-row gap-6 items-start">
                    {/* main card */}
                    <div className="flex-1 min-w-0 bg-gray-800 border border-gray-600 rounded-2xl p-8
            shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
                        <StepBar current={step} />
                        <h1 className="text-2xl font-bold text-gray-500 mb-6">{TITLES[step]}</h1>

                        {step === 0 && <StepInfos data={infos} setData={setInfos} onNext={next} />}
                        {step === 1 && <StepReprise data={reprise} setData={setReprise} onNext={next} />}
                        {step === 2 && <StepLivraison data={livraison} setData={setLivraison} onNext={next} />}
                        {step === 3 && <StepImmat data={immat} setData={setImmat} onNext={next} />}
                        {step === 4 && <StepGarantie data={garantie} setData={setGarantie} onNext={next} />}
                        {step === 5 && <StepPaiement data={paiement} setData={setPaiement} onNext={next} />}
                        {step === 6 && <StepConfirmation orderData={orderData} />}
                    </div>

                    {/* sidebar */}
                    <Summary data={orderData} step={step} />
                </div>
            </div>
        </div>
    );
}