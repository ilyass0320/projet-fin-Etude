import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.tsx';
import NotFound from './NotFound.tsx';
import Acheter from './pages/VendreETlocation/acheter.tsx';
import Reprise from './pages/Reprise/reprise.tsx';
import Assisstance from './pages/Assisstance/assisstance.tsx';
import Login from './pages/connecter/Login.tsx';
import SignUp from './pages/connecter/SignUp.tsx';
import Comparaison from './pages/Comparaison/comparaison.tsx';
import Account from './pages/connecter/Account.tsx';
import RecupererMotPass from './pages/connecter/recuperer_mot_pass.tsx';
import Admin from './pages/Adiministration/Admin.tsx';
import PageDetails from './pages/VendreETlocation/PageDetails.tsx';
import DashbordAdmin from './pages/Adiministration/DashbordAdmin.tsx';
import ComptAdmin from './pages/Adiministration/createConptAdmin.tsx';
import ContacterAgence from './pages/VendreETlocation/contacterAgence.tsx';
import Analyse from './pages/Comparaison/comparaison.tsx';
import CommanderEnLigne from './pages/VendreETlocation/commander.tsx';
import ResetPass from './pages/connecter/RenitialisationMotPass.tsx';
import Chatboot from './pages/Chatboot/chat.tsx';
// ✅ Ajouter cet import
import { CartProvider } from './pages/content/CarteContent.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/createConptAdmin",
    element: <ComptAdmin />
  },
  {
    path: "/Acheter-Location",
    element: <Acheter />
  },
  {
    path: "/Reprise",
    element: <Reprise />
  },
  {
    path: "/Assistance",
    element: <Assisstance />
  },
  {
    path: "/Login",
    element: <Login />
  },
  {
    path: "/SignUp",
    element: <SignUp />
  },
  {
    path: "/Comparaison",
    element: <Comparaison />
  },
  {
    path: "/profile",
    element: <Account />
  },
  {
    path: "/recuperer_mot_pass",
    element: <RecupererMotPass />
  },
  {
    path: "/renitialiser-Mot-Pass?token=:token",
    element: <ResetPass />
  },
  {
    path: "/Admin/login",
    element: <Admin />
  },
  {
    path: "/Admin",
    element: <DashbordAdmin />
  },
  {
    path: "/details/:type/:marque/:model/:id",
    element: <PageDetails />
  },
  {
    path: "/comparaisonCarte",
    element: <Analyse />
  },
  {
    path: "/contacter-Agence/:type/:marque/:model/:id",
    element: <ContacterAgence />
  },
  {
    path: "/commander/:type/:marque/:model/:id",
    element: <CommanderEnLigne />
  },
  {
    path: "/renitialiser-Mot-Pass",
    element: <ResetPass />
  }, {
    path: "/chat-ia-aide",
    element: <Chatboot />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ✅ CartProvider enveloppe RouterProvider — le panier est accessible partout */}
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)