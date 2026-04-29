package com.example.Backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "produit")
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    private String marque;
    private String model;
    private Integer annee;
    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Couleur invalide")
    private String couleur;
    private Float prix;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageProduit;

    private String imageProduitType; //imag/png or jpeg

    @Column
    private LocalTime tempsAjtPrd = LocalTime.now();
    @Column
    private LocalDate dateAjtPrd = LocalDate.now();


    String DisponibiliteProduit(){
        if (getMarque().equals(marque) && getModel().equals(model)){
            return "disponible";
        }
        return null;
    };

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    @JsonIgnoreProperties("produits")
    private Categorie categorie;

    @OneToMany(mappedBy = "produitC",
    cascade = CascadeType.ALL,
    orphanRemoval = true)
    private List<Commande> commandes;

    @ManyToOne
    @JoinColumn(name = "admin_id_Pro")
    @JsonIgnore
    private Admin GereAdmin;


}
