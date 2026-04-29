package com.example.Backend.Respository;

import com.example.Backend.Entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie,Long> {
    boolean existsByNomCategorie(String nomCategorie); // ✅ pour doublon
    Optional<Categorie> findByNomCategorie(String nomCategorie);
}
