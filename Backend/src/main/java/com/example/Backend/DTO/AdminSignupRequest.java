package com.example.Backend.DTO;

import com.example.Backend.Entity.Admin;
import com.example.Backend.Entity.Roles;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSignupRequest {

    @JsonProperty("id")
    private Long id;
    // Utiliser les mêmes noms que le frontend (en minuscules)
    @JsonProperty("nom")
    private String Nom;

    @JsonProperty("prenom")
    private String Prenom;

    @JsonProperty("email")
    private String Email;

    @JsonProperty("genre")
    private String Genre;

    @JsonProperty("telephone")
    private String Telephone;

    @JsonProperty("address")
    private String adresse;

    @JsonProperty("password")
    private String Password;

    @JsonProperty("role")
    private String role;

    @JsonProperty("profileAdm")
    @Lob
    private Byte[] adminImg;

    private String error;
    private String message;
    private Admin admin;
    private List<AdminSignupRequest> listAdmin;
    private List<Roles> nomRole;
    private String token;
    private String refresh;

}
