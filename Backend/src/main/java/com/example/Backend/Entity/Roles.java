package com.example.Backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Roles {
    public static List<Roles> nomRole;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idRole;

    @ManyToOne
    private Admin admin;



}
