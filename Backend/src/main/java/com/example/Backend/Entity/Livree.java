package com.example.Backend.Entity;



public interface Livree {
    String confirmationLivraison(Client signatureClient, Commande photoClientCommande); // a la livraison du commande
    void preparationLivraison(); // les informations du livraison ,les informations du clients ,du paiemnets
    void prepareCamion(); // le choix du conduit du camion disponibilite du lui
}
