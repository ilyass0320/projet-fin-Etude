package com.example.Backend.DTO;

import com.example.Backend.Entity.Admin;
import com.example.Backend.Entity.Client;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignUpResquest {
    @JsonProperty("id")
    private  Long id;

    @JsonProperty("nom")
    private String Nom;

    @JsonProperty("prenom")
    private String Prenom;

    @Email
    @Valid
    @JsonProperty("email")
    private String Email;

    @JsonProperty("genre")
    private String Genre;

    @JsonProperty("phone")
    private String Telephone;

    @JsonProperty("adresse")
    private String Address;

    @JsonProperty("password")
    private String Password;

    private Client client;
    private String error;
    private String message;
    private String token;
    private String refresh;
    private List<Client> listClients;



}
