package com.example.Backend.Entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@DiscriminatorValue("location")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Location extends Paiement{
    private float prixParJour;
    private long nombreJour;
    private LocalDateTime dateDebutLocation;
    private LocalDateTime dateFinLocation;
    private float prixTotalJours;

    public long calculerNombreJours() {
        return  nombreJour=ChronoUnit.DAYS.between(dateDebutLocation, dateDebutLocation) +1;
        // le +1 pour compte le dernier jour
    }
    public double calculerPrixTotal() {
        long jours = nombreJour;
        return prixTotalJours=jours * prixParJour;
    }

}
