import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dataProd from '../../data/dataProdDetail.json';
import Header from '../Navbar/Header';
import Footer from '../Navbar/Footer';
import { MdOutlineLocalGroceryStore, MdArrowBackIosNew } from "react-icons/md";

const AccessoireDetails = () => {
    const { marque, model, name, id } = useParams();

    // Décoder le nom (espaces encodés en %20, accents, etc.)
    const decodedName = decodeURIComponent(name);

    const categories = dataProd[0].vehicule;

    let accessoire = null;
    let categorieTrouvee = null;

    for (const cat of categories) {
        if (cat.composant) {
            const found = cat.composant.find((c) => c.name === decodedName);
            if (found) {
                accessoire = found;
                categorieTrouvee = cat;
                break;
            }
        }
    }

    const [quantite, setQuantite] = useState(1);

    if (!accessoire) {
        return (
            <div className="overflow-x-hidden">
                <Header />
                <div className='h-15 bg-black mb-2 w-full'></div>
                <div className='flex flex-col items-center justify-center py-20'>
                    <h1 className='text-2xl font-bold text-gray-800'>Accessoire non trouvé</h1>
                    <p className='text-gray-500 mt-2'>Cet accessoire n'existe pas ou plus.</p>
                    <Link to="/" className='mt-4 text-white bg-[#1B3246] px-4 py-2 rounded-lg hover:bg-[#274a66] transition'>
                        Retour à l'accueil
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const autresAccessoires = categorieTrouvee.composant.filter((c) => c.name !== decodedName);

    return (
        <div className="overflow-x-hidden">
            <Header />
            <div className='h-15 bg-black mb-2 w-full'></div>

            <div className='max-w-5xl mx-auto px-4 py-6'>
                <Link to={-1} className='inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition'>
                    <MdArrowBackIosNew size={14} />
                    Retour au véhicule
                </Link>

                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Image */}
                    <div className='w-full md:w-1/2'>
                        <div className='rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 [box-shadow:rgba(136,165,191,0.48)_6px_2px_16px_0px,rgba(255,255,255,0.8)_-6px_-2px_16px_0px]'>
                            <img
                                src={accessoire.image}
                                alt={accessoire.name}
                                className='w-full h-96 object-cover'
                            />
                        </div>
                    </div>

                    {/* Infos */}
                    <div className='w-full md:w-1/2 flex flex-col'>
                        <span className='inline-block text-xs font-semibold uppercase tracking-wide text-white bg-[#1B3246] px-3 py-1 rounded-full w-fit mb-3'>
                            {accessoire.type}
                        </span>
                        <h1 className='text-3xl font-extrabold text-gray-900'>
                            {accessoire.name}
                        </h1>
                        <p className='text-sm text-gray-500 mt-2'>
                            Compatible avec {marque} {model}
                        </p>
                        <p className='text-3xl font-extrabold text-red-600 mt-6'>
                            {accessoire.prix}
                        </p>
                        <p className='border-b border-gray-200 mt-4 mb-6'></p>
                        <p className='text-gray-600 leading-relaxed'>
                            Améliorez le confort et l'esthétique de votre véhicule avec cet accessoire
                            d'origine, conçu pour s'adapter parfaitement à votre {marque} {model}.
                        </p>

                        {/* Quantité */}
                        <div className='flex items-center gap-4 mt-6'>
                            <span className='text-sm font-semibold text-gray-700'>Quantité</span>
                            <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
                                <button
                                    onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                                    className='px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition'
                                >-</button>
                                <span className='px-4 py-1.5 font-semibold'>{quantite}</span>
                                <button
                                    onClick={() => setQuantite((q) => q + 1)}
                                    className='px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition'
                                >+</button>
                            </div>
                        </div>

                        {/* CTA */}
                        <button className='mt-6 flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300'>
                            <MdOutlineLocalGroceryStore size={22} />
                            Ajouter au panier
                        </button>
                    </div>
                </div>

                {/* Autres accessoires */}
                {autresAccessoires.length > 0 && (
                    <div className='mt-14'>
                        <h2 className='text-xl font-extrabold text-gray-900 mb-5'>Autres accessoires</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                            {autresAccessoires.map((item, i) => (
                                <Link
                                    key={i}
                                    to={`/details-accessoires/${marque}/${model}/${encodeURIComponent(item.name)}/${i}`}
                                    className='group relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                                >
                                    <span className='absolute top-3 left-3 z-10 text-[11px] font-semibold uppercase tracking-wide text-white bg-[#1B3246]/90 px-2.5 py-1 rounded-full'>
                                        {item.type}
                                    </span>
                                    <div className='w-full h-40 overflow-hidden bg-gray-50'>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                                        />
                                    </div>
                                    <div className='p-3'>
                                        <h3 className='text-sm font-bold text-gray-800 leading-snug min-h-[32px]'>
                                            {item.name}
                                        </h3>
                                        <p className='text-lg font-extrabold text-red-600 mt-1'>
                                            {item.prix}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default AccessoireDetails;