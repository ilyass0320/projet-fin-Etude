package com.example.Backend.Service;

import com.example.Backend.DTO.CategorieRequest;
import com.example.Backend.Entity.Categorie;
import com.example.Backend.Respository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategorieManagementService {

    @Autowired
    private final CategorieRepository categorieRepository;

    @Transactional
    public CategorieRequest addCategory(CategorieRequest categorieRequest, MultipartFile img) throws Exception {
        CategorieRequest response = new CategorieRequest();

        System.out.println("\n ---------------------------------");
        System.out.println("DEBUT ENREGISTREMENT CATEGORIE");
        System.out.println("------------------------------------");
        System.out.println("Categorie : " + categorieRequest.getNomCategorie());
        System.out.println("------------------------------------");

        try {
            if (categorieRequest.getNomCategorie() == null || categorieRequest.getNomCategorie().isBlank()) {
                response.setMessage("Le nom de la catégorie est obligatoire !");
                return response;
            }

            if (categorieRepository.existsByNomCategorie(categorieRequest.getNomCategorie())) {
                response.setMessage("La catégorie '" + categorieRequest.getNomCategorie() + "' existe déjà !");
                System.out.println("Catégorie déjà existante, enregistrement annulé.");
                return response;
            }

            Categorie categorie = new Categorie();
            categorie.setNomCategorie(categorieRequest.getNomCategorie());

            if (img != null && !img.isEmpty()) {
                categorie.setImageIcon(img.getBytes());
                categorie.setImageIconType(img.getContentType());
                System.out.println("Image reçue : " + img.getOriginalFilename());
            } else {
                System.out.println("Aucune image uploadée");
            }

            Categorie saved = categorieRepository.save(categorie);
            response.setNomCategorie(saved.getNomCategorie());
            response.setMessage("Catégorie enregistrée avec succès !");
            System.out.println("✅ Catégorie enregistrée : " + saved.getNomCategorie());
            System.out.println("✅ Id généré : " + saved.getId());

        } catch (Exception e) {
            response.setMessage("Erreur : " + e.getMessage());
            e.printStackTrace();
        }

        return response;
    }

    public CategorieRequest allCategories() {
        CategorieRequest response = new CategorieRequest();

        List<Categorie> categories = categorieRepository.findAll();

        response.setCategories(categories); // ✅ byte[] gardé tel quel
        response.setMessage("Categories récupérées avec succès");
        return response;
    }
}