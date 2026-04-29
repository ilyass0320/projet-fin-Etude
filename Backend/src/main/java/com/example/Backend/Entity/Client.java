package com.example.Backend.Entity;

import com.example.Backend.Enums.Genre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_client;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column
    private String telephone;

    @Column(nullable = false)
    private String address;

    private String password;

    @Column
    private String resetToken;

    @Column
    private LocalTime tempsAjtClt = LocalTime.now();

    @Column
    private LocalDate dateAjtClt = LocalDate.now();

    // ✅ ROLE_CLIENT au lieu de ROLE_ADMIN
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    @ManyToMany
    @JoinTable(name = "passe_commandes",
            joinColumns = @JoinColumn(name = "clients_id_Com"),
            inverseJoinColumns = @JoinColumn(name = "commande_id_Cli")
    )
    private List<Commande> commande_id_Cli;

    @ManyToMany(mappedBy = "clientsVeh")
    private List<Vehicule> vehicules_cli;
}