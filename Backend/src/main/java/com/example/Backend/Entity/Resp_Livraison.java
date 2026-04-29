package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.repository.cdi.Eager;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resp_Livraison implements Livree{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_Resp_Liv;

    @OneToMany(mappedBy = "respLivraison")
    private List<Livraison> livraisons_Resp;

    @Override
    public String confirmationLivraison(Client signatureClient, Commande photoClientCommande) {
        return "";
    }

    @Override
    public void preparationLivraison() {

    }

    @Override
    public void prepareCamion() {

    }
}
