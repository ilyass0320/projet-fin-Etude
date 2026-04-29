package com.example.Backend.Entity;

import jakarta.persistence.*;
import jdk.dynalink.linker.LinkerServices;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resp_Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_Resp_Paie;


    @OneToMany(mappedBy = "respPaiement")
    private List<Paiement> paiement_id_Rep;
}
