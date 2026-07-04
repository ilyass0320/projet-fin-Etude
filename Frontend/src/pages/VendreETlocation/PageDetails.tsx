import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PageDetails.css';
import { useParams } from 'react-router-dom';
import dataProd from '../../data/dataProdDetail.json';
import Header from '../Navbar/Header';
import Footer from '../Navbar/Footer';
import { GiCheckMark } from "react-icons/gi";
import { MdOutlineLocalGroceryStore, MdArrowBack } from "react-icons/md";
import { useCart } from "../content/CarteContent";

const AccessoireCard = ({ item, vehicule }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { addToCart, totalItems } = useCart();


    return (
        <div
            className="w-full cursor-pointer"
            style={{ perspective: "1200px" }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className="relative w-full transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    minHeight: "380px",
                }}
            >
                {/* FACE AVANT */}
                <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img src={item.image} alt={item.name} className="w-full h-52 object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white bg-[#1B3246] px-2 py-1 rounded-full w-fit">
                            {item.type}
                        </span>
                        <h1 className="text-xl font-bold text-gray-800 mt-2">{item.name}</h1>
                        <p className="text-2xl font-bold text-red-600 mt-2">{item.prix}</p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFlipped(true);
                            }}
                            type="button"
                            className="mt-auto flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-xl transition"
                        >
                        
                            Découvrir
                        </button>
                    </div>
                </div>

                {/* FACE ARRIERE */}
                <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-gray-100  text-white flex flex-col p-5"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <h2 className="text-xl bg-gray-900 text-center rounded-2xl font-bold mb-2">{item.name}</h2>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#1B3246] bg-white px-2 py-1 rounded-full w-fit mb-3">
                        {item.type}
                    </span>

                    <p className="text-sm text-black flex-1 overflow-y-auto">
                        {item.description || "Aucune description disponible pour cet accessoire."}
                    </p>

                    {/* <Link
                        to={`/details-accessoires/${vehicule.Marque}/${vehicule.model}/${item.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 flex items-center justify-center gap-2 w-full bg-white text-[#1B3246] font-semibold py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <MdOutlineLocalGroceryStore size={22} />Ajout au cart 
                    </Link> */}
                    <button
                        className="mt-4 flex items-center justify-center gap-2 w-full bg-white text-[#1B3246] font-semibold py-2 rounded-2xl hoverFliButton"
                        onClick={() =>
                            addToCart({
                                id: item.id,
                                marque: item.name || "",
                                model: "",
                                prix: item.prix || "",
                                img_vehicule: item.image || "",
                                transaction: "achat",
                                type: item.type || "",
                            })
                        }
                    > <MdOutlineLocalGroceryStore size={22} />Ajout au cart </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                        }}
                        type="button"
                        className="mt-2 items-center justify-center gap-2 w-full bg-transparent border border-white text-white font-semibold py-2 rounded-lg hover:bg-white/10 transition hidden"
                    ></button>
                </div>
            </div>
        </div>
    );
};

const PageDetails = () => {
    const { id, type } = useParams();

    const categories = dataProd[0].vehicule;

    const categorie = categories.find((cat) => cat.name === type);

    if (!categorie)
        return <div className='bg-red-500 text-bold p-2 text-center'>Type de véhicule non trouvé</div>;

    const vehicule = categorie.elements.find(v => v.id === Number(id));

    if (!vehicule)
        return <div className='bg-red-500 text-bold p-2 text-center'>Véhicule non trouvé</div>;

    // Image affichée
    const [currentImage, setCurrentImage] = useState(vehicule.img_vehicule);
    const [selectedColor, setSelectedColor] = useState(null);

    const [selectedOption, setSelectedOption] = useState('commande_En_Ligne');
    const [selectColorVehi, setSelectColorVehi] = useState(vehicule.colors[4].image);
    return (
        <div className="overflow-x-hidden">
            <Header />
            {/* nav block */}
            <div className='h-15 bg-black mb-2 w-full'></div>
            {/* <h1 className='text-center text-sm'>Détails du véhicule</h1> */}
            <div className="flex m-1 overflow-x-hidden">
                <div className='w-full'>
                    <div className='w-full flex flex-row lg:flex-row'>
                        {/* IMAGES */}
                        <div className='flex flex-col w-full lg:w-1/2 p-2'>
                            <div className='flex flex-row w-full h-95'>
                                <img
                                    src={currentImage}
                                    alt={vehicule.model}
                                    height={300}
                                    width={600}
                                    className=" object-cover [box-shadow:rgba(136,165,191,0.48)_6px_2px_16px_0px,rgba(255,255,255,0.8)_-6px_-2px_16px_0px]"
                                />
                            </div>
                            <div className=''>
                                {categorie.name === "voitures" &&
                                    <div className='flex flex-row gap-2 mt-2 flex-wrap'>
                                        {vehicule.images && vehicule.images.map((image, i) => (
                                            <div key={i} className='border cursor-pointer hoverImg'>
                                                <img
                                                    src={image}
                                                    width={60}
                                                    onClick={() => setCurrentImage(image)}
                                                    className='object-cover'
                                                    alt={`Preview ${i}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                }
                                {categorie.name === "moto" && <div></div>}
                                {categorie.name === "velos" && <div></div>}
                            </div>
                        </div>
                        {/* section resumer */}
                        <div className='flex flex-col w-full lg:w-1/2 p-2'>
                            <div className='border p-3 w-full rounded-lg [box-shadow:rgba(136,165,191,0.48)_6px_2px_16px_0px,rgba(255,255,255,0.8)_-6px_-2px_16px_0px] bg-gray-200 text-gray-800 h-50'>
                                <h1 className="text-4xl font-bold ">
                                    {vehicule.Marque} {vehicule.model}
                                </h1>
                                <p className=''>
                                    {categorie.name === "voitures" &&
                                        <ul className='flex flex-row list-none text-sm text-gray-700 pt-3 gap-1'>
                                            <li> {vehicule.carburant},</li>
                                            <li> {vehicule.Motorisation},</li>
                                            <li> {vehicule.Puissance_max}</li>
                                        </ul>
                                    }
                                    {categorie.name === "moto" && <div></div>}
                                    {categorie.name === "velos" && <div></div>}
                                </p>
                                <h2 className="pt-6 font-extrabold text-2xl text-red-900">
                                    {categorie.name === "voiture" && vehicule.prix}
                                    {categorie.name === "moto" && vehicule.prix}
                                    {categorie.name === "velos" && vehicule.prix}
                                </h2>
                                <h2 className='text-md text-red-500 font-thin'>
                                    {categorie.name === "voitures" && vehicule.prix_mois}
                                    {categorie.name === "moto" && vehicule.prix_mois}
                                    {categorie.name === "velos" && vehicule.prix_mois}
                                </h2>
                                <p className='border-b decoration-1 pt-3 border-gray-600'></p>
                                <div></div>
                            </div>
                            <div>
                                {categorie.name === "voitures" &&
                                    <div className='flex flex-col mt-2' >
                                        <div className='grid grid-cols-2 sm:flex-row w-full gap-2'>
                                            <div className='border border-black rounded-lg p-2 w-full h-22 sm:w-1/2'>
                                                <input
                                                    type="radio"
                                                    value="commande_En_Ligne"
                                                    checked={selectedOption === 'commande_En_Ligne'}
                                                    name="choix_commande"
                                                    id="commande_En_Ligne"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor="commande_En_Ligne">
                                                    <h2 className='text-gray-900 text-lg inline'>Commandez en ligne</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Livraison a domicile </p>
                                                </label>
                                            </div>
                                            <div className='border border-black rounded-lg p-2 w-full sm:w-1/2 '>
                                                <input
                                                    type="radio"
                                                    value="commande_Agence"
                                                    checked={selectedOption === "commande_Agence"}
                                                    name="choix_commande"
                                                    id="Commande_Agence"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2 "
                                                />
                                                <label htmlFor="Commande_Agence">
                                                    <h2 className='text-gray-900 text-lg inline'>Contactez-Agence</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Applez-nous ou venir a l'adresse d'agence</p>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            {selectedOption === 'commande_En_Ligne' ? (
                                                <Link to={`/commander/${type}/${vehicule.Marque}/${vehicule.model}/${id}`} state={{ image: currentImage }}>
                                                    <button className='mt-2 bg-gray-900 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-blue-800 transition-all duration-200'>Commandez en ligne</button>
                                                </Link>
                                            ) : (
                                                <Link to={`/contacter-Agence/${type}/${vehicule.Marque}/${vehicule.model}/${id}`} state={{ image: currentImage }}>
                                                    <button className='mt-2 bg-gray-400 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-green-800 transition-all duration-200'>Contactez l'agence</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                }
                                {categorie.name === "moto" &&
                                    <div className='flex flex-col mt-2' >
                                        <div className='flex flex-col sm:flex-row w-full gap-2'>
                                            <div className='border border-black rounded-lg p-2 w-full h-22 sm:w-1/2'>
                                                <input
                                                    type="radio"
                                                    value="commande_En_Ligne"
                                                    checked={selectedOption === 'commande_En_Ligne'}
                                                    name="choix_commande"
                                                    id="commande_En_Ligne"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor="commande_En_Ligne">
                                                    <h2 className='text-gray-900 text-lg inline'>Commandez en ligne</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Livraison a domicile </p>
                                                </label>
                                            </div>
                                            <div className='border border-black rounded-lg p-2 w-full sm:w-1/2 '>
                                                <input
                                                    type="radio"
                                                    value="commande_Agence"
                                                    checked={selectedOption === "commande_Agence"}
                                                    name="choix_commande"
                                                    id="Commande_Agence"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2 "
                                                />
                                                <label htmlFor="Commande_Agence">
                                                    <h2 className='text-gray-900 text-lg inline'>Contactez-Agence</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Applez-nous ou venir a l'adresse d'agence</p>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            {selectedOption === 'commande_En_Ligne' ? (
                                                <Link to="/commander">
                                                    <button className='mt-2 bg-blue-600 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-blue-800 transition-all duration-200'>Commandez en ligne</button>
                                                </Link>
                                            ) : (
                                                <Link to="/contacter-Agence">
                                                    <button className='mt-2 bg-green-600 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-green-800 transition-all duration-200'>Contactez l'agence</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                }
                                {categorie.name === "velos" &&
                                    <div className='flex flex-col mt-2' >
                                        <div className='flex flex-col sm:flex-row w-full gap-2'>
                                            <div className='border border-black rounded-lg p-2 w-full h-22 sm:w-1/2'>
                                                <input
                                                    type="radio"
                                                    value="commande_En_Ligne"
                                                    checked={selectedOption === 'commande_En_Ligne'}
                                                    name="choix_commande"
                                                    id="commande_En_Ligne"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor="commande_En_Ligne">
                                                    <h2 className='text-gray-900 text-lg inline'>Commandez en ligne</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Livraison a domicile </p>
                                                </label>
                                            </div>
                                            <div className='border border-black rounded-lg p-2 w-full sm:w-1/2 '>
                                                <input
                                                    type="radio"
                                                    value="commande_Agence"
                                                    checked={selectedOption === "commande_Agence"}
                                                    name="choix_commande"
                                                    id="Commande_Agence"
                                                    onChange={e => setSelectedOption(e.target.value)}
                                                    className="mr-2 "
                                                />
                                                <label htmlFor="Commande_Agence">
                                                    <h2 className='text-gray-900 text-lg inline'>Contactez-Agence</h2>
                                                    <p className='text-sm text-gray-500 pt-6'>Applez-nous ou venir a l'adresse d'agence</p>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            {selectedOption === 'commande_En_Ligne' ? (
                                                <Link to="/commander">
                                                    <button className='mt-2 bg-blue-600 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-blue-800 transition-all duration-200'>Commandez en ligne</button>
                                                </Link>
                                            ) : (
                                                <Link to="/contacter-Agence">
                                                    <button className='mt-2 bg-green-600 cursor-pointer  text-white p-2 rounded-lg w-full hover:bg-green-800 transition-all duration-200'>Contactez l'agence</button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/* details principale du vehicule */}
                    <div className='mt-10 px-2'>
                        <h1 className='text-center text-2xl font-bold mb-4 underline'>Détails</h1>
                        <div className='grid grid-cols-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/mileage.png" alt="Kilométrage" className='rounded-full hoverImg' width={40} />
                                <h1 className="text-sm text-gray-700 text-center">Kilométrage</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.kilometrage_Inclus}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.kilometrage_Inclus}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.kilometrage_Inclus}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/gearBox.png" alt="Boîte de vitesse" className='hoverImg' width={40} />
                                <h1 className="text-sm text-gray-700 text-center">Boîte Vitesse</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.transmission}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.transmission}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.transmission}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/doorCar.png" alt="Portes" className='hoverImg' width={40} />
                                <h1 className="text-sm text-gray-700 text-center">Portes</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.portes}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.portes}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.portes}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/seats.png" alt="Places" className='hoverImg' width={40} />
                                <h1 className="text-sm text-gray-700 text-center">Places</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.places}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.places}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.places}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/color.png" alt="Couleur" width={40} className='hoverImg' />
                                <h1 className="text-sm text-gray-700 text-center">Couleur</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.colors[4].name}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.colors[4].name}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.colors[4].name}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/fiscalPower.png" alt="Puissance fiscale" width={40} className='hoverImg' />
                                <h1 className="text-sm text-gray-700 text-center">Puissance Fiscale</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.Puissance_Fiscale}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.Puissance_Fiscale}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.Puissance_Fiscale}</span>}
                                </h2>
                            </div>
                            <div className='border flex flex-col items-center justify-center rounded-lg p-3 bg-gray-100'>
                                <img src="/images/yearsCar.png" alt="Année" width={40} className='hoverImg' />
                                <h1 className="text-sm text-gray-700 text-center">Année</h1>
                                <h2 className="font-bold text-center">
                                    {categorie.name === "voitures" && <span>{vehicule.annee}</span>}
                                    {categorie.name === "motors" && <span>{vehicule.annee}</span>}
                                    {categorie.name === "velos" && <span>{vehicule.annee}</span>}
                                </h2>
                            </div>
                        </div>
                        {/* Equipement */}
                        <div className='mt-8 mb-4 p-4 bg-gray-100 rounded-lg'>
                            <h1 className='text-center text-2xl font-bold mb-4 underline'>Equipement</h1>
                            <details className='group border border-gray-400 p-1 rounded-xl m-1 border-b-black'>
                                <summary className="list-none cursor-pointer flex items-center">
                                    <span className="mr-2 text-xl text-gray-900 font-bold fla group-open:hidden"><GiCheckMark /></span>
                                    <span className="mr-2 text-xl text-gray-500 font-bold hidden group-open:inline">-</span>
                                    option
                                </summary>
                                {categorie.name === "voitures" && vehicule.options && vehicule.options.length > 0 && (
                                <ul className="list-disc list-inside">
                                    {vehicule.options.map((item, index) => (
                                        <li key={index}>{item}</li>
                                        ))}
                                </ul>
                                )}
                                {categorie.name === "moto" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                                {categorie.name === "velos" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                            </details>
                            {/* <details className='group border border-gray-400 p-1 rounded-xl m-1 border-b-black'>
                                <summary className="list-none cursor-pointer flex items-center">
                                    <span className="mr-2 text-xl text-gray-900 font-bold  group-open:hidden"><GiCheckMark /></span>
                                    <span className="mr-2 text-xl text-gray-700 font-bold hidden group-open:inline">-</span>
                                    Option
                                </summary>
                                {categorie.name === "voitures" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                                {categorie.name === "moto" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                                {categorie.name === "velos" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                            </details>
                            <details className='group border border-gray-400 p-1 rounded-xl m-1 border-b-black'>
                                <summary className="list-none cursor-pointer flex items-center">
                                    <span className="mr-2 text-xl text-gray-900 font-bold group-open:hidden"><GiCheckMark /></span>
                                    <span className="mr-2 text-xl text-gray-500 font-bold hidden group-open:inline">-</span>
                                    List
                                </summary>
                                {categorie.name === "voitures" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                                {categorie.name === "moto" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                                {categorie.name === "velos" &&
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                }
                            </details> */}
                        </div>
                        {/* afficher le vehicule aves des deffirents couleurs */}
                        <div className='flex iten-center justify-center mb-4'>
                            {categorie.name === "voitures" &&
                                <div className='flex flex-col  '>
                                    <img src={selectColorVehi} width={800} alt="" className='' />
                                    <div className='text-center p-1'>
                                        {vehicule.colors && vehicule.colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className={`border-2 w-10 h-10 rounded-full hoverImgColor transition-all duration-200 ${selectedColor === color.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                                                style={{ backgroundColor: color.color }}
                                                onClick={() => {
                                                    if (color && color.image) {
                                                        setSelectColorVehi(color.image);
                                                        setSelectedColor(color.id);
                                                    }
                                                }}
                                                title={color.name}
                                            >
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            }
                            {categorie.name === "motos" ? (
                                <div className='flex flex-col  '>
                                    <img src={selectColorVehi} width={800} alt="" className='' />
                                    <div className='text-center p-1'>
                                        {vehicule.colors && vehicule.colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className={`border-2 w-10 h-10 rounded-full hoverImgColor transition-all duration-200 ${selectedColor === color.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                                                style={{ backgroundColor: color.color }}
                                                onClick={() => {
                                                    if (color && color.image) {
                                                        setSelectColorVehi(color.image);
                                                        setSelectedColor(color.id);
                                                    }
                                                }}
                                                title={color.name}
                                            >
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            {categorie.name === "velos" ? (
                                <div className='flex flex-col  '>
                                    <img src={selectColorVehi} width={800} alt="" className='' />
                                    <div className='text-center p-1'>
                                        {vehicule.colors && vehicule.colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className={`border-2 w-10 h-10 rounded-full hoverImgColor transition-all duration-200 ${selectedColor === color.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                                                style={{ backgroundColor: color.color }}
                                                onClick={() => {
                                                    if (color && color.image) {
                                                        setSelectColorVehi(color.image);
                                                        setSelectedColor(color.id);
                                                    }
                                                }}
                                                title={color.name}
                                            >
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {/* Composants / Accessoires — cartes avec flip individuel */}
                        <div className='mt-4 mb-4 p-4 bg-gray-100 rounded-xl'>
                            <h1 className='text-left text-2xl font-extrabold mb-4'>Accessoires</h1>
                            {categorie.composant && categorie.composant.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {categorie.composant.map((item, index) => (
                                        <AccessoireCard key={index} item={item} vehicule={vehicule} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">Aucun accessoire disponible pour cette catégorie.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </div >
    );
}

export default PageDetails;