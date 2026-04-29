package com.example.Backend.Controller;

import com.example.Backend.DTO.ProduitRequest;
import com.example.Backend.DTO.UserSignUpResquest;
import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Produit;
import com.example.Backend.Respository.CategorieRepository;
import com.example.Backend.Respository.ProduitRepository;
import com.example.Backend.Service.ProduitManagementService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/auth/produit/")
@AllArgsConstructor
public class ProduitController {
    @Autowired
    private final ProduitManagementService produitManagementService;
    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;

    @PostMapping(value = "/Ajouter")
    public ResponseEntity<?> createProduit(
            @RequestPart("produit") ProduitRequest produitRequest,
            @RequestPart(value = "img", required = false) MultipartFile img) throws Exception {

        System.out.println("Catégorie reçue : " + produitRequest.getCategorie());

        ProduitRequest produit = produitManagementService.addProduit(produitRequest, img);
        return ResponseEntity.status(201).body(produit);
    }

    @GetMapping("/allProduits")
    public ResponseEntity<ProduitRequest> RecupererProduits(){
        return ResponseEntity.ok(produitManagementService.getAllProduit());
    }
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Produit produit =produitRepository.findById(id).orElseThrow();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(produit.getImageProduitType()))
                .body(produit.getImageProduit());
    }
}
