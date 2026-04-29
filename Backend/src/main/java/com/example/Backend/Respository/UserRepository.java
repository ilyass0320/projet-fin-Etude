package com.example.Backend.Respository;

import com.example.Backend.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Client,Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByResetToken(String resetToken);
    @Query("SELECT COUNT(c) > 0 FROM Client c WHERE c.email = :email")
    boolean existsByEmail(@Param("email") String email);}
