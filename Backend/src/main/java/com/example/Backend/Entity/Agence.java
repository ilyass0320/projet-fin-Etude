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
@DiscriminatorValue("Agence")
public class Agence  extends Livraison{
    private String nomAgence;

    private String addresseAgence;

    private String telephoneAgence;

    private String emailAgence;
}
