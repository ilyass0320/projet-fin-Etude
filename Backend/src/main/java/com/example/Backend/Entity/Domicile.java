package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("Domicile")
public class Domicile extends Livraison{

    private String addressLivraison;
    private String villeLivraison;
    private int codePostal;
    private String paysLivraison;
}
