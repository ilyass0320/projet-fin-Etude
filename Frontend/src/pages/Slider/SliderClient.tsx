import "./sliderClient.css"

const description = [
    {
        id: 1,
        image: "/images/Home_achat_vehicules.jpg",
        title: "confiance",
        text: "Un service impeccable, rapide et professionnel. Très satisfait de mon expérience, je recommande vivement à tous ceux qui cherchent confiance et qualité"
    },
    {
        id: 2,
        image: "/images/man-checks-bicycle-buying-sport-shop-bike-sports-52267950.webp",
        title: "qualité",
        text: "Très bon rapport qualité/prix et un service impeccable. J\’y retournerai sans hésiter."
    },
    {
        id: 3,
        image: "/images/men-motorbike-salon-handsome-young-bearded-black-leather-jacket-buying-attractive-blond-giving-keys-handshaking-67791656.webp",
        title: "réactive",
        text: "Une équipe à l\’écoute, professionnelle et réactive. Merci pour cette belle expérience !"
    },
    {
        id: 4,
        image: "/images/emotional_guy_holding_key_hand.webp",
        title: "sérieuse",
        text: "Un vrai plaisir de traiter avec une équipe aussi sérieuse et compétente."
    }
]

const SliderClient = () => {
    return (
        <div className='flex flex-col  p-4 border bg-gray-900 pt-5 mt-5' >
            <h1 className="text-white text-5xl font-bold text-bold text-center mb-4">Avis de nos clients</h1>
            <div className="flex flex-row gap-5">
                {
                    description.map((desc) => (
                        <div key={desc.id} className="card w-[400px] h-[320px] border p-2 mt-1 rounded-xl border-2 border-gray-300 shadow-lg flex flex-col items-center">
                            <img src={desc.image} alt="" className="w-[300px] h-[150px] rounded-xl border border-white border-3" />
                            <div className="mt-2">
                                <h1 className="font-bold">{desc.title}</h1>
                                <p className='font-thin pl-4 text-center text-md'>{desc.text}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div >
    )
}
export default SliderClient