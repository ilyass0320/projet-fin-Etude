package com.example.Backend.Service;

import com.example.Backend.DTO.CategorieRequest;
import com.example.Backend.DTO.ProduitRequest;
import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Client;
import com.example.Backend.Entity.Produit;
import com.example.Backend.Respository.CategorieRepository;
import com.example.Backend.Respository.ProduitRepository;
import com.example.Backend.Respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProduitManagementService {
    @Autowired
    private final ProduitRepository produitRepository;
    @Autowired
    private final CategorieRepository categorieRepository;
    private final UserRepository userRepository;
    private final NotificationAjouterProduits nouveauProduitService;
    @Transactional
    public ProduitRequest addProduit(ProduitRequest produitRequest, MultipartFile img) throws Exception {
        ProduitRequest response =new ProduitRequest();
        System.out.println("\n========== START SAVE PRODUIT ==========");
        System.out.println("Marque   : " + produitRequest.getMarque());
        System.out.println("Model    : " + produitRequest.getModel());
        System.out.println("Annee    : " + produitRequest.getAnnee());
        System.out.println("Prix     : " + produitRequest.getPrix());
        System.out.println("Categorie: " + produitRequest.getCategorie());
        System.out.println("Couleur  : "+produitRequest.getCouleur());
        System.out.println("========================================");
        try{
            if (produitRequest.getMarque() == null || produitRequest.getMarque().isBlank()) {
                response.setMessage("La marque est obligatoire");
                return response;
            }
            if (produitRequest.getModel() == null || produitRequest.getModel().isBlank()) {
                response.setMessage("Le modèle est obligatoire");
                return response;
            }
            if (produitRequest.getPrix() == null) {
                response.setMessage("Le prix est obligatoire");
                return response;
            }
            if (produitRequest.getCategorie() == null || produitRequest.getCategorie().isBlank()) {
                response.setMessage("La catégorie est obligatoire");
                return response;
            }
            if (produitRequest.getAnnee() == null) {
                response.setMessage("L'annee est obligatoire");
                return response;
            }
            // ✅ Récupérer l'objet Categorie depuis la BDD
            Categorie categorie = categorieRepository
                    .findByNomCategorie(produitRequest.getCategorie())
                    .orElseThrow(() -> new RuntimeException(
                            "Catégorie '" + produitRequest.getCategorie() + "' non trouvée"
                    ));
            Produit produit = new Produit();
            produit.setCategorie(categorie);
            produit.setMarque(produitRequest.getMarque());
            produit.setModel(produitRequest.getModel());
            produit.setAnnee(produitRequest.getAnnee());
            produit.setPrix(produitRequest.getPrix());
            produit.setCouleur(produitRequest.getCouleur());

            // HANDLE IMAGE CORRECTLY
            if (img != null && !img.isEmpty()) {
                produit.setImageProduit(img.getBytes());
                produit.setImageProduitType(img.getContentType());

                System.out.println("Image received: " + img.getOriginalFilename());
            } else {
                System.out.println("No image uploaded");
            }

            Produit savedProduit = produitRepository.save(produit);
            System.out.println("\n========================================");
            System.out.println("\n✅ PRODUIT SAVED SUCCESSFULLY!");
            System.out.println("ID                          : " + savedProduit.getId());
            System.out.println("Marque                      : " + savedProduit.getMarque());
            System.out.println("Model                       : " + savedProduit.getModel());
            System.out.println("Categorie                   : " + savedProduit.getCategorie().getNomCategorie());
            System.out.println("Type Image                  : " + savedProduit.getImageProduitType());
            System.out.println("Date d'ajout du produit     : " + savedProduit.getDateAjtPrd());
            System.out.println("Temps d'ajout du produit    : " + savedProduit.getTempsAjtPrd());
            System.out.println("========================================\n");
            response.setMessage("Produits enregistre avec succees");
            // 2. Récupérer les emails de tous les utilisateurs
            List<String> tousLesEmails = userRepository.findAll()
                    .stream()
                    .map(Client::getEmail)
                    .filter(email -> email != null && !email.isEmpty())
                    .toList();
            System.out.println("📧 Envoi à " + tousLesEmails.size() + " utilisateurs...");
            // 3. Envoyer les notifications
            nouveauProduitService.envoyerNotificationATous(tousLesEmails, savedProduit);
            System.out.println("=======================================================");
        }catch (Exception e){
                response.setMessage("Error :"+e.getMessage());
        }
        return response;
    }
    public ProduitRequest getAllProduit(){
        ProduitRequest response = new ProduitRequest();
        List<Produit> produits = produitRepository.findAll();
        response.setProduitList(produits);
        response.setMessage("Produit recuperer avec succes");
        return response;
    }
    public Produit getProduitById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit avec l'id " + id + " non trouvé"));
    }
}
