package com.example.Backend.Service;

import com.example.Backend.DTO.AdminSignupRequest;
import com.example.Backend.Entity.Admin;
import com.example.Backend.Enums.Genre;
import com.example.Backend.Enums.RolesAdmin;
import com.example.Backend.Respository.AdminRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminManagementService {

    @Autowired
    private final AdminRespository adminRespository;
    @Autowired
    private final JwtService jwtService;
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AdminSignupRequest register(AdminSignupRequest req) {
        AdminSignupRequest response = new AdminSignupRequest();

        System.out.println("\n===========================================");
        System.out.println("    DÉBUT ENREGISTREMENT ADMIN");
        System.out.println("==========================================");
        System.out.println("Email      : " + req.getEmail());
        System.out.println("Nom        : " + req.getNom());
        System.out.println("Prénom     : " + req.getPrenom());
        System.out.println("Adresse    : " + req.getAdresse());
        System.out.println("Téléphone  : " + req.getTelephone());
        System.out.println("Genre      : " + req.getGenre());
        System.out.println("Password   : " + (req.getPassword() != null ? "[MASQUÉ]" : "NULL"));
        System.out.println("=============================================\n");

        try {

            System.out.println("Vérification si l'email existe déjà...");
            if (adminRespository.findByEmail(req.getEmail()).isPresent()) {
                System.err.println(" Email déjà existent : " + req.getEmail());
                response.setError("Un compte avec cet email existe déjà");
                return response;
            }
            System.out.println(" Email disponible ");
            System.out.println("Création de l'objet Admin...");
            Admin admin = new Admin();

            admin.setEmail(req.getEmail());
            admin.setPrenom(req.getPrenom());
            admin.setNom(req.getNom());
            admin.setAddress(req.getAdresse());
            admin.setTelephone(req.getTelephone());
            admin.setGenre(Genre.valueOf(req.getGenre()));

            // Définir le rôle ADMIN
            admin.setRolesAdmin(RolesAdmin.ADMIN);
            System.out.println("Rôle défini : " + RolesAdmin.ADMIN);

            // Gérer le genre
            if (req.getGenre() != null && !req.getGenre().isEmpty()) {
                try {
                    Genre genreEnum = Genre.valueOf(req.getGenre().toUpperCase());
                    admin.setGenre(genreEnum);
                    System.out.println("Genre défini : " + genreEnum);
                } catch (IllegalArgumentException e) {
                    System.err.println("Genre invalide : " + req.getGenre());
                    System.err.println("Valeurs acceptées : " + java.util.Arrays.toString(Genre.values()));
                }
            }

            // Encoder le mot de passe
            System.out.println("Encodage du mot de passe...");
            String encodedPassword = passwordEncoder.encode(req.getPassword());
            admin.setPassword(encodedPassword);
            System.out.println(" Mot de passe encodé Valid");

            // Afficher l'état de l'objet avant sauvegarde
            System.out.println("----------------------------------------");
            System.out.println("\n État de l'admin avant sauvegarde :");
            System.out.println("----------------------------------------");
            System.out.println("   - Email      : " + admin.getEmail());
            System.out.println("   - Nom        : " + admin.getNom());
            System.out.println("   - Prénom     : " + admin.getPrenom());
            System.out.println("   - Adresse    : " + admin.getAddress());
            System.out.println("   - Téléphone  : " + admin.getTelephone());
            System.out.println("   - Genre      : " + admin.getGenre());
            System.out.println("   - Rôle       : " + admin.getRolesAdmin());
            System.out.println("   - Password   : " + (admin.getPassword() != null ? "[ENCODÉ]" : "NULL"));
            System.out.println("----------------------------------------");

            // Sauvegarder
            System.out.println("\nTentative de sauvegarde dans la base de données...");
            Admin savedAdmin = adminRespository.save(admin);

            System.out.println("\nADMIN SAUVEGARDÉ AVEC SUCCÈS ! ");
            System.out.println("ID généré  : " + savedAdmin.getId());
            System.out.println("Email      : " + savedAdmin.getEmail());
            System.out.println("Nom complet: " + savedAdmin.getPrenom() + " " + savedAdmin.getNom());

            // Générer les tokens
            System.out.println("\n Génération des tokens JWT...");
            String jwt = jwtService.generateToken(savedAdmin);
            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), savedAdmin);
            System.out.println("Tokens générés");

            response.setMessage("Admin créé avec succès");
            response.setAdmin(savedAdmin);
            response.setToken(jwt);
            response.setRefresh(refreshToken);

            System.out.println("\n==========================================");
            System.out.println("   FIN ENREGISTREMENT (SUCCÈS)");
            System.out.println("===========================================\n");

        } catch (Exception e) {
            System.err.println("\n----- ERREUR LORS DE L'ENREGISTREMENT --------");
            System.err.println("Type d'erreur : " + e.getClass().getName());
            System.err.println("Message       : " + e.getMessage());
            System.err.println("\n Stack trace complet :");
            e.printStackTrace();
            System.err.println("------------------------------------------------\n");

            response.setError("Erreur lors de la création du compte : " + e.getMessage());
        }
        return response;
    }


    public AdminSignupRequest login(AdminSignupRequest loginRequest) {
        AdminSignupRequest response = new AdminSignupRequest();

        System.out.println("\n==========================================");
        System.out.println(" TENTATIVE DE CONNEXION");
        System.out.println("=========================================");
        System.out.println("  Email: " + loginRequest.getEmail());

        try {
            System.out.println("Authentification en cours...");
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            System.out.println("Authentification réussie");

            System.out.println("Recherche de l'admin dans la base...");
            Admin admin = adminRespository
                    .findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            System.out.println("Admin trouvé : " + admin.getNom() + " " + admin.getPrenom());

            System.out.println("Génération des tokens...");
            String jwt = jwtService.generateToken(admin);
            String refreshToken = jwtService.generateRefreshToken(new HashMap<>(), admin);

            response.setToken(jwt);
            response.setRefresh(refreshToken);
            response.setMessage("Connexion réussie");
            response.setAdmin(admin);

            System.out.println(" Connexion réussie !");
            System.out.println(" ========================================\n");

        } catch (Exception e) {
            System.err.println("\n--- ERREUR DE CONNEXION ----");
            System.err.println("Type : " + e.getClass().getName());
            System.err.println("Message : " + e.getMessage());
            e.printStackTrace();
            System.err.println("----------------------------------------\n");

            response.setError("Email ou mot de passe incorrect");
        }
        return response;
    }
    public AdminSignupRequest getAdminById(Integer id) {
        try {
            Admin admin = adminRespository.findById(Long.valueOf(id))
                    .orElseThrow(() -> new RuntimeException("Admin avec l'identifiant '" + id + "' n'existe pas"));

            AdminSignupRequest adminRequest = new AdminSignupRequest();
            adminRequest.setAdmin(admin);
            adminRequest.setMessage("Admin récupéré avec succès");

            return adminRequest;

        } catch (Exception e) {
            AdminSignupRequest errorResponse = new AdminSignupRequest();
            errorResponse.setMessage("Erreur: " + e.getMessage());

            return errorResponse;
        }
    }

    public AdminSignupRequest getAdminConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Admin admin = adminRespository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé"));

        AdminSignupRequest dto = new AdminSignupRequest();
        dto.setNom(admin.getNom());
        dto.setEmail(admin.getEmail());
        dto.setAdresse(admin.getAddress());
        dto.setNomRole(admin.getNomRole());
        dto.setGenre(String.valueOf(admin.getGenre()).toUpperCase());
        return dto;
    }
}
