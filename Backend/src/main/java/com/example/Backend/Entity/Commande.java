package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomCommande;

    private float prixCommande;

    private LocalTime tempsCommande = LocalTime.now();
    private LocalDate dateCommande = LocalDate.now();


    @ManyToMany(mappedBy = "commande_id_Cli")
    private List<Client> clients;

    @ManyToMany(mappedBy = "commandesPai")
    private List<Paiement> paiementsC;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produit_id",nullable = false)
    private Produit produitC;


}
