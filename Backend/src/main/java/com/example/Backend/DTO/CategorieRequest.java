package com.example.Backend.DTO;

import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Client;
import com.example.Backend.Entity.Produit;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
 public class CategorieRequest {

    @JsonProperty("nomCate")
    private String nomCategorie;

    @JsonProperty("imagIcon")
    @Column(columnDefinition = "LONGTEXT")
    private MultipartFile imageIcon;

    private List<Categorie> categories;
    private List<ProduitRequest> produitsC;


    private String message;



}
