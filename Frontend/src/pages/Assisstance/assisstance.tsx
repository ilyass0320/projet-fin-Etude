import Header from "../Navbar/Header"
import Footer from "../Navbar/Footer"

const assisstance = () => {
    return (
        <div>
            <Header />
            <div className='w-full h-16 bg-black' ></div>

            {/* Section d'introduction */}
            <div className='flex flex-row md:flex-row gap-6 p-6 max-w-6xl mx-auto'>
                <div className='flex-shrink-0'>
                    <img
                        src="../images/manager-selling-car-happy.avif"
                        className='w-64 h-48 object-cover brightness-75 rounded-xl'
                        alt="Manager vendant une voiture"
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <div className="text-center md:text-left mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">MOTO</h1>
                        <p className="text-lg font-light text-gray-600 flex items-start ml-3">
                            Tout ce que vous devez savoir
                        </p>
                    </div>
                    <p className="text-sm text-center text-gray-500 leading-relaxed">
                        Notre équipe est toujours prête à vous aider dans l'achat de votre voiture. Que vous souhaitiez acheter depuis le confort de votre canapé ou visiter notre agence pour voir les vehicules disponibles, nous avons ce qu'il vous faut. Notre objectif est de vous assurer que vous pouvez acheter votre prochaine Vehicule de manière confortable, sûre et sécurisée. Ci-dessous, vous trouverez un aperçu de comment fonctionne MOTO et comment nous parvenons à rester le meilleur choix pour l'achat et location de voitures, motors, velos et ces accessoires.
                    </p>
                </div>
            </div>

            {/* Section Comment ça marche */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className='text-center mb-8 font-extrabold text-4xl text-gray-900 border-b-2 border-gray-200 pb-4'>
                    Comment ça marche ?
                </h1>

                <div className="space-y-12">
                    {/* Étape 1: Commandez */}
                    <div className="flex flex-row lg:flex-row gap-8 items-start">
                        <div className='flex-shrink-0 lg:w-1/3'>
                            <img
                                src="../images/trouverV.jpeg"
                                alt="Trouver un véhicule"
                                className='w-full h-64 object-cover rounded-lg shadow-md'
                            />
                        </div>
                        <div className='lg:w-2/3'>
                            <h2 className='text-2xl text-gray-700 font-bold mb-1'>Commandez</h2>
                            <h3 className="text-lg font-light text-gray-600 mb-1">Trouvez le véhicule parfait</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Nous proposons une large gamme de marques et de modèles, avec de nouvelles voitures ajoutées quotidiennement. Notre boutique en ligne vous permet de visualiser chaque voiture avec des photos détaillées sous tous les angles, y compris des gros plans sur les caractéristiques clés.
                                <br /><br />
                                Lors de l'achat de votre voiture en ligne, pour finaliser votre commande, vous devrez vérifier votre numéro de téléphone et télécharger vos justificatifs d'identité et d'adresse. Notre équipe vous contactera ensuite pour confirmer la disponibilité de la voiture et vérifier votre commande. Une fois votre commande vérifiée, nous commençons le contrôle de livraison de votre voiture et réservons le transport jusqu'à votre domicile.
                            </p>
                        </div>
                    </div>

                    {/* Étape 2: Paiement */}
                    <div className="flex flex-row-reverse lg:flex-row-reverse gap-8 items-start">
                        <div className='flex-shrink-0 lg:w-1/3'>
                            <img
                                src="../images/paiement.jpg"
                                alt="Options de paiement"
                                className='w-full h-64 object-cover rounded-lg shadow-md'
                            />
                        </div>
                        <div className='lg:w-2/3'>
                            <h2 className='text-2xl text-gray-700 font-bold mb-1'>Paiement</h2>
                            <h3 className="text-lg font-light text-gray-600 mb-1">Vous décidez comment vous souhaitez payer</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Pas de frais cachés, et différentes options en fonction de vos besoins ! Vous souhaitez payer votre voiture en plusieurs fois en sollicitant un financement ? Moto a ce qu'il vous faut : nous proposons des options de financement sécurisées et adaptées à vos besoins.
                                <br /><br />
                                Vous souhaitez régler votre commande au comptant ? Vous avez le choix de régler par chèque certifié le jour de la livraison, ou par virement en amont de celle-ci.
                                <br /><br />
                                Si vous souhaitez faire reprendre votre ancienne voiture, demandez un prix de reprise directement sur notre site. Vous pourrez ensuite le déduire du prix de votre nouvelle voiture, et vous n'aurez à régler que la différence.
                            </p>
                        </div>
                    </div>

                    {/* Étape 3: Livraison */}
                    <div className="flex flex-row lg:flex-row gap-8 items-start">
                        <div className='flex-shrink-0 lg:w-1/3'>
                            <img
                                src="../images/Livraison_camion.jpg"
                                alt="Livraison de véhicule"
                                className='w-full h-64 object-cover rounded-lg shadow-md'
                            />
                        </div>
                        <div className='lg:w-2/3'>
                            <h2 className='text-2xl text-gray-700 font-bold mb-1'>Livraison</h2>
                            <h3 className="text-lg font-light text-gray-600 mb-1">Comment vous choisissez de recevoir votre voiture</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Chez Moto, nous offrons pour toutes les voitures des options de livraison pratiques. Lors du processus d'achat de votre commande, vous pouvez sélectionner votre option de livraison préférée pour votre adresse.
                                <br /><br />
                                En amont de la livraison, nous préparons les documents nécessaires et votre voiture est contrôlée une dernière fois et nettoyée. Nous vous informons ensuite dès que votre voiture est prête à vous être livrée.
                                <br /><br />
                                Vous aurez l'occasion de voir la voiture pour la première fois en personne lors de la livraison. C'est également à ce moment que d'autres étapes importantes sont effectuées, comme l'inspection de votre reprise et les procédures administratives. Nous sommes toujours disponibles pour répondre à toutes vos questions.
                            </p>
                        </div>
                    </div>

                    {/* Étape 4: Profitez */}
                    <div className="flex flex-row-reverse lg:flex-row-reverse gap-8 items-start">
                        <div className='flex-shrink-0 lg:w-1/3'>
                            <img
                                src="../images/profit.jpeg"
                                alt="Profiter de votre voiture"
                                className='w-full h-64 object-cover rounded-lg shadow-md'
                            />
                        </div>
                        <div className='lg:w-2/3'>
                            <h2 className='text-2xl text-gray-700 font-bold mb-1'>Profitez de votre voiture</h2>
                            <h3 className="text-lg font-light text-gray-600 mb-1">Nous nous assurons que vous êtes 100% satisfait</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Maintenant que vous avez votre nouvelle voiture, nous voulons nous assurer que vous vivez une expérience optimale avec elle. Nous serons toujours là pour vous aider, même pendant l'immatriculation de votre voiture. Toutes nos voitures sont livrées avec une garantie d'un an.
                                <br /><br />
                                Il est très important pour nous que votre nouvelle voiture réponde entièrement à toutes vos attentes. C'est pourquoi vous avez également 21 jours (et jusqu'à 500 km) pour tester votre nouvelle voiture ; si vous n'êtes pas satisfait, nous la reprenons sans poser de questions ! Bien entendu, nous vous remboursons intégralement si vous rendez la voiture pendant cette période.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default assisstance
