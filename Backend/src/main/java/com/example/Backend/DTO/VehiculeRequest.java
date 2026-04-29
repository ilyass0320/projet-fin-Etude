package com.example.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeRequest {

    private String type;
    private String distribution;
    private String Refroidissement;
    private String cylindree;
    private String alesageXcourse;
    private String compression;
    private String puissance;
    private String puissanceLibre;
    private String Embrayage;
    private String boiteVitesse;
    private String transmission;
    private String cadre;
    private String suspensionAvantArriere;
    private String freinAvantArriere;
    private String pneuAvantArriere;
    private Float longueurM;
    private Float largueurM;
    private Float hauteurM;
    private Float hauteurSelle;
    private String reservoir;
    private String lumiereAvant;
    private String lumiereArriere;
    private String sonnette;
    private String reflecteurs;
    private String soudure;
    private String leviers;
    private String patin;
    private String usure;
    private String fourche;
    private String jeu;
    private String serrage;
    private String pedales;
    private String plateaux;
    private String axe;
    private String chalue;
    private String dignous;
    private String pneus;
    private String chambreAir;
    private String axeDeRoue;
    private String deraralle;
    private String passageDeVitesse;
    private Float prixMotors;
    private Float prixVelos;
    private Float prixMotorsJr;
    private Float prixVelosJr;
    private Float prixVente;
    private Float prixLocationJr;
    private String carburant;
    private Integer nombreCylindres;
    private String consomation;
    private Float longueurVeh;
    private Float largueurVeh;
    private Float hauteurVeh;
    private String climatisation;
    private String systemAudio;
    private String siegesChauffrants;
    private String connectivite;
    private Integer nombreAirbags;
    private String systemFrienageABS;
    private String kilometrage;
    private Boolean disponibilite;
    private Integer portes;
    private Integer places;
    private Float capaciteCoffre;

    private List<String> listCouleursMotors;
    private List<String> listCouleursVelos;
    private List<String> listCouleursVoitures;
    private List<UserSignUpResquest> clientsVeh;
}
