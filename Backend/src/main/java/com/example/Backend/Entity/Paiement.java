package com.example.Backend.Entity;

import jakarta.persistence.*;
import jdk.dynalink.linker.LinkerServices;
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
@DiscriminatorColumn(name = "modePaiement")
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_Paiement;

    private String typeTransaction;
    private LocalDateTime datePaiement;
    private float montantTotal;
    private String statusPaiement;
    private float montantReprise;

    @Column(insertable=false, updatable=false)
    private String modePaiement;

    @ManyToMany
    @JoinTable(name = "payer_c_p",
    joinColumns = @JoinColumn(name = "paiement_id_com"),
    inverseJoinColumns = @JoinColumn(name = "commande_id_paie")
    )
    private List<Commande> commandesPai;

    @ManyToOne
    @JoinColumn(name = "paiement_id_rep")
    private Resp_Paiement respPaiement;

    @ManyToMany(mappedBy = "paiements_LIV")
    private List<Livraison> livraisons;
}
