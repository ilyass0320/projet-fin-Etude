package com.example.Backend.Respository;

import com.example.Backend.Entity.Location;
import com.example.Backend.Entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Location> {

}
