
import Filrate from './FiltrageCompa.tsx';
import Header from '../Navbar/Header.tsx';
import Footer from '../Navbar/Footer.tsx';

const comparaison = () => {
    return (
        <div>
            <div className='w-full h-15 bg-black'>
                <Header />
            </div>
            {/* <h1 className='block text-center text-xl font-bold text-gray-900'>Comparaison des Vehicule Chez <span className='text-2xl text-gray-900 font-bold text-shadow-sm text-shadow-black'>MOTO</span> </h1> */}
            <h1 className='text-center text-shadow-xl mb-2 mt-4 bg-linear-to-r from-gray-400 to-gray-900 bg-clip-text text-5xl font-extrabold text-transparent text-shadow-xl text-shadow-black'>Comparaison des Véhicules</h1>
            <p className='text-center text-md font-mono text-gray-700'>Comparez les véhicules facilement pour faire le meilleur choix en termes de qualité, de performance et de prix.</p>
            <Filrate />
            <Footer />
        </div>
    )
}
export default comparaison;
