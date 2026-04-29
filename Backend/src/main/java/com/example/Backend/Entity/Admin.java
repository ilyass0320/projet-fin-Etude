package com.example.Backend.Entity;

import com.example.Backend.Enums.Genre;
import com.example.Backend.Enums.RolesAdmin;
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
public class Admin implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private String telephone;

    @Column(unique = true)
    private String address;

    private String password;

    @Lob
    private byte[] adminImg;

    private LocalTime tempsAjtAdm = LocalTime.now();
    private LocalDate dateAjtAdm = LocalDate.now();





    @Override
    public String getUsername() {
        return email;  // ✅ Utiliser l'email comme username
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Enumerated(EnumType.STRING)
    private RolesAdmin rolesAdmin;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    protected List<Roles> nomRole;

    @OneToMany(mappedBy = "GereAdmin", cascade = CascadeType.ALL)
    private List<Produit> produitsAdmin;

    // ✅ Initialiser le rôle par défaut
    @PrePersist
    private void init() {
        if (rolesAdmin == null) {
            rolesAdmin = RolesAdmin.ADMIN;
        }
    }

    // ✅ Override pour retourner les bonnes autorités
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rolesAdmin.name()));
    }
}