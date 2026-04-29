package com.example.Backend.Respository;

import com.example.Backend.Entity.Notiification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotiificationRepository extends JpaRepository<Notiification,Long> {
    List<Notiification> findByEmail(String email);
}
