package com.example.Backend.Respository;

import com.example.Backend.Entity.Admin;
import com.example.Backend.Enums.RolesAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRespository extends JpaRepository<Admin,Long> {
    Optional<Admin> findByEmail(String email);
}
