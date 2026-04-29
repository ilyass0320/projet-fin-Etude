package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "modeLivraison")
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id_Liv;

//    private Commande idcommande;
//    private Client id_client;
    private String typeProduit; //soit vehicule ou composant
    private LocalDateTime datePreuve =LocalDateTime.now();
    private LocalDateTime dateEffectuer =LocalDateTime.now();
    private String statusLivraison;

    @Column(insertable=false, updatable=false)
    private String modeLivraison;


    @ManyToMany
    @JoinTable(name = "suiv_Livraison",
    joinColumns = @JoinColumn(name = "livraison_id_paiem"),
    inverseJoinColumns = @JoinColumn(name = "paiem_Liv"))
    private List<Paiement> paiements_LIV;

    @ManyToOne
    @JoinColumn(name = "livraison_rep")
    private Resp_Livraison respLivraison;
}

