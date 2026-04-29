package com.example.Backend.DTO;

import com.example.Backend.Entity.Categorie;
import com.example.Backend.Entity.Commande;
import com.example.Backend.Entity.Produit;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProduitRequest {
    @JsonProperty("marque")
    private String marque;
    @JsonProperty("model")
    private String model;
    @JsonProperty("annee")
    private Integer annee;

    @JsonProperty("imageProduit")
    private MultipartFile imageProduit;
    @JsonProperty("couleur")
    private String couleur;
    @JsonProperty("prix")
    private Float prix;
    @JsonProperty("categories")
    private String categorie;

    @CreatedDate
    private LocalDate dateAjtPro;
    @CreationTimestamp
    private LocalTime tempsAjtPro;

    private String message;
    private List<Produit> produitList;
    private List<CommandeRequest> commandes;

}
